import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AuthUser extends User {
  userType?: "patient" | "professional";
}

export function useAuthSupabase() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);

        // Get current session
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        setSession(currentSession);
        setUser(currentSession?.user as AuthUser | null);
        setIsAuthenticated(!!currentSession);

        // Subscribe to auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          setSession(newSession);
          setUser(newSession?.user as AuthUser | null);
          setIsAuthenticated(!!newSession);

          if (newSession) {
            // Save session to AsyncStorage
            await AsyncStorage.setItem("@medflow_session", JSON.stringify(newSession));
          } else {
            // Clear session from AsyncStorage
            await AsyncStorage.removeItem("@medflow_session");
          }
        });

        return () => {
          subscription?.unsubscribe();
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signup = useCallback(
    async (email: string, password: string, userType: "patient" | "professional", name: string) => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              userType,
              name,
            },
          },
        });

        if (error) throw error;

        return { data, error: null };
      } catch (error) {
        console.error("Signup error:", error);
        return { data: null, error };
      }
    },
    []
  );

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Login error:", error);
      return { data: null, error };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
      setIsAuthenticated(false);

      return { error: null };
    } catch (error) {
      console.error("Logout error:", error);
      return { error };
    }
  }, []);

  return {
    user,
    session,
    loading,
    isAuthenticated,
    signup,
    login,
    logout,
  };
}
