import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const AdminSetup: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const testRLS = async () => {
    if (!user) return;

    console.log('AdminSetup: Testing RLS policies...');

    // Test direct profile access
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role, email')
      .eq('id', user.id)
      .single();

    console.log('AdminSetup: Direct profile query:', { profile, profileError });

    // Test is_admin function
    const { data: isAdminResult, error: funcError } = await supabase
      .rpc('is_admin', { user_id: user.id });

    console.log('AdminSetup: is_admin function:', { isAdminResult, funcError });

    toast({
      title: "RLS Test Complete",
      description: "Check console for detailed results",
    });
  };

  const createAdminProfile = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "No user logged in",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('AdminSetup: Creating/updating admin profile for user:', user.id);
      
      // First try to update existing profile
      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({ 
          role: 'admin',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select();

      if (updateError && updateError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('AdminSetup: Profile not found, creating new admin profile...');
        
        const { data: insertData, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            role: 'admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();

        if (insertError) {
          console.error('AdminSetup: Error creating profile:', insertError);
          toast({
            title: "Error creating profile",
            description: insertError.message,
            variant: "destructive",
          });
        } else {
          console.log('AdminSetup: Admin profile created:', insertData);
          toast({
            title: "Success",
            description: "Admin profile created successfully. Please refresh the page.",
          });
        }
      } else if (updateError) {
        console.error('AdminSetup: Error updating profile:', updateError);
        toast({
          title: "Error updating profile",
          description: updateError.message,
          variant: "destructive",
        });
      } else {
        console.log('AdminSetup: Admin profile updated:', updateData);
        toast({
          title: "Success",
          description: "Admin profile updated successfully. Please refresh the page.",
        });
      }
    } catch (error) {
      console.error('AdminSetup: Unexpected error:', error);
      toast({
        title: "Unexpected error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="text-sm">Admin Setup (Dev Only)</CardTitle>
          <CardDescription className="text-xs">
            Create or update admin profile for current user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs">
            <div>User: {user?.email || 'Not logged in'}</div>
            <div>User ID: {user?.id || 'N/A'}</div>
            <div className="space-y-1">
              <Button
                onClick={testRLS}
                disabled={!user}
                size="sm"
                variant="outline"
                className="w-full"
              >
                Test RLS
              </Button>
              <Button
                onClick={createAdminProfile}
                disabled={!user || loading}
                size="sm"
                className="w-full"
              >
                {loading ? 'Creating...' : 'Make Admin'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;
