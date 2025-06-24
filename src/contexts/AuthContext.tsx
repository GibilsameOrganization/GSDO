import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { checkAdminStatus as utilsCheckAdminStatus } from '@/utils/profileUtils';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckInProgress, setAdminCheckInProgress] = useState(false);

  const checkAdminStatus = async (userId: string) => {
    // Prevent multiple concurrent admin checks
    if (adminCheckInProgress) {
      console.log('AuthContext: Admin check already in progress, skipping...');
      return;
    }

    try {
      setAdminCheckInProgress(true);
      console.log('AuthContext: Checking admin status for user:', userId);

      // Use the utility function which handles RLS issues
      const isAdminUser = await utilsCheckAdminStatus(userId);
      console.log('AuthContext: Admin status check result:', { isAdmin: isAdminUser });
      setIsAdmin(isAdminUser);

    } catch (error) {
      console.error('AuthContext: Unexpected error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setAdminCheckInProgress(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthContext: Auth state change:', event, session?.user?.email);

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          console.log('AuthContext: User authenticated, checking admin status...');
          // Check admin status when user is authenticated, but don't await it
          // to prevent blocking the loading state
          checkAdminStatus(session.user.id).catch(error => {
            console.error('AuthContext: Admin status check failed:', error);
            setIsAdmin(false);
          });
        } else {
          console.log('AuthContext: No user session, clearing admin status');
          setIsAdmin(false);
        }

        // Always set loading to false after processing auth state
        console.log('AuthContext: Setting loading to false');
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('AuthContext: Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Check admin status but don't block loading state
        checkAdminStatus(session.user.id).catch(error => {
          console.error('AuthContext: Initial admin status check failed:', error);
          setIsAdmin(false);
        });
      } else {
        setIsAdmin(false);
      }

      console.log('AuthContext: Setting initial loading to false');
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    try {
      console.log('AuthContext: Starting sign out process...');

      // Clear state first to ensure immediate UI update
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setLoading(false);

      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('AuthContext: Sign out error:', error);
        throw error; // Re-throw to let calling component handle it
      } else {
        console.log('AuthContext: Sign out successful');
      }
    } catch (error) {
      console.error('AuthContext: Unexpected sign out error:', error);
      // Even if Supabase signOut fails, we've already cleared local state
      // This ensures the UI updates correctly
      throw error; // Re-throw to let calling component handle it
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
