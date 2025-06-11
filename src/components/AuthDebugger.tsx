import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const AuthDebugger: React.FC = () => {
  const { user, session, loading, isAdmin } = useAuth();
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null);
  const [rlsIssue, setRlsIssue] = useState<string | null>(null);

  useEffect(() => {
    // Test Supabase connection and profiles table access
    const testConnection = async () => {
      try {
        console.log('AuthDebugger: Testing Supabase connection...');
        const { data, error } = await supabase.from('profiles').select('id, role').limit(1);
        console.log('AuthDebugger: Profiles query result:', { data, error });
        setSupabaseConnected(!error);

        // If user exists, also test their specific profile
        if (user) {
          console.log('AuthDebugger: Testing user profile access...');
          const { data: userProfile, error: userError } = await supabase
            .from('profiles')
            .select('id, role, email')
            .eq('id', user.id)
            .single();
          console.log('AuthDebugger: User profile result:', { userProfile, userError });

          // Test if RLS is blocking access
          if (userError) {
            console.log('AuthDebugger: Testing RLS policies...');
            console.log('AuthDebugger: Error code:', userError.code);
            console.log('AuthDebugger: Error message:', userError.message);
            console.log('AuthDebugger: Error details:', userError.details);

            // Check for common RLS error patterns
            if (userError.message?.includes('RLS') ||
                userError.message?.includes('policy') ||
                userError.message?.includes('permission') ||
                userError.code === '42501') {
              setRlsIssue('RLS policy blocking access');
            } else if (userError.code === 'PGRST116') {
              setRlsIssue('No rows returned (possible RLS)');
            } else {
              setRlsIssue(`Unknown error: ${userError.code}`);
            }

            // Try to access without filters to see if RLS is the issue
            const { data: allProfiles, error: allError } = await supabase
              .from('profiles')
              .select('id, role, email')
              .limit(5);
            console.log('AuthDebugger: All profiles query (should fail if RLS blocks):', { allProfiles, allError });
          } else {
            setRlsIssue(null);
          }
        }
      } catch (error) {
        console.error('AuthDebugger: Connection test failed:', error);
        setSupabaseConnected(false);
      }
    };
    testConnection();
  }, [user]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Auth Debug Info</h3>
      <div className="space-y-1">
        <div>Supabase: {supabaseConnected === null ? 'testing...' : supabaseConnected ? 'connected' : 'error'}</div>
        <div>Loading: {loading ? 'true' : 'false'}</div>
        <div>User: {user ? user.email : 'null'}</div>
        <div>User ID: {user ? user.id : 'null'}</div>
        <div>Session: {session ? 'exists' : 'null'}</div>
        <div>Is Admin: {isAdmin ? 'true' : 'false'}</div>
        {rlsIssue && <div className="text-red-400">RLS Issue: {rlsIssue}</div>}
        <div>Timestamp: {new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  );
};

export default AuthDebugger;
