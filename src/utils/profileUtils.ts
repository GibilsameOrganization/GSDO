import { supabase } from '@/integrations/supabase/client';

export const ensureUserProfile = async (userId: string, email: string) => {
  try {
    console.log('ProfileUtils: Ensuring profile exists for user:', userId, email);
    
    // First, try to get the existing profile
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, role, email')
      .eq('id', userId)
      .single();
    
    if (fetchError && fetchError.code === 'PGRST116') {
      // Profile doesn't exist, create it
      console.log('ProfileUtils: Profile not found, creating new profile...');
      
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: email,
          role: 'user', // Default role
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (createError) {
        console.error('ProfileUtils: Error creating profile:', createError);
        return { profile: null, error: createError };
      }
      
      console.log('ProfileUtils: Profile created successfully:', newProfile);
      return { profile: newProfile, error: null };
    } else if (fetchError) {
      console.error('ProfileUtils: Error fetching profile:', fetchError);
      return { profile: null, error: fetchError };
    } else {
      console.log('ProfileUtils: Profile found:', existingProfile);
      return { profile: existingProfile, error: null };
    }
  } catch (error) {
    console.error('ProfileUtils: Unexpected error:', error);
    return { profile: null, error };
  }
};

export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  try {
    console.log('ProfileUtils: Checking admin status for user:', userId);

    // First try using the Supabase function (bypasses RLS)
    try {
      console.log('ProfileUtils: Trying is_admin function...');
      const { data: functionResult, error: functionError } = await supabase
        .rpc('is_admin', { user_id: userId });

      if (!functionError && functionResult !== null) {
        console.log('ProfileUtils: Function result:', functionResult);
        return functionResult;
      } else {
        console.log('ProfileUtils: Function failed or not available:', functionError);
      }
    } catch (funcError) {
      console.log('ProfileUtils: Function call failed:', funcError);
    }

    // Fallback to direct table query
    console.log('ProfileUtils: Falling back to direct table query...');
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('ProfileUtils: Error checking admin status:', error);
      console.log('ProfileUtils: Error details:', { code: error.code, message: error.message });

      // If it's an RLS error, log it specifically
      if (error.message?.includes('RLS') || error.message?.includes('policy') || error.code === '42501') {
        console.error('ProfileUtils: RLS policy is blocking access to profiles table');
      }

      return false;
    }

    const isAdmin = profile?.role === 'admin';
    console.log('ProfileUtils: Admin status result:', { role: profile?.role, isAdmin });
    return isAdmin;
  } catch (error) {
    console.error('ProfileUtils: Unexpected error checking admin status:', error);
    return false;
  }
};
