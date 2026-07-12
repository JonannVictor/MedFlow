import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { syncProfessionalProfileFromAuth } from "@/lib/medflow-supabase";

export type UserType = "patient" | "professional";

export interface UnifiedAuthUser {
  id: string;
  email: string;
  name?: string;
  userType?: UserType;
}

export interface UseUnifiedAuthReturn {
  user: UnifiedAuthUser | null;
  userType: UserType | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signup: (
    email: string,
    password: string,
    userType: UserType,
    name: string,
    profileData?: Record<string, unknown>
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export function useUnifiedAuth(): UseUnifiedAuthReturn {
  const [user, setUser] = useState<UnifiedAuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<UserType | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);

        // Try to get session from Supabase
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("[useUnifiedAuth] Session error:", sessionError);
          setSession(null);
          setUser(null);
          setUserType(null);
          return;
        }

        if (currentSession?.user) {
          const supabaseUser = currentSession.user;
          const userTypeFromMetadata = (supabaseUser.user_metadata?.userType as UserType) || null;

          try {
            await syncProfessionalProfileFromAuth(supabaseUser);
          } catch (syncError) {
            console.error("[useUnifiedAuth] Professional profile sync failed:", syncError);
          }

          const unifiedUser: UnifiedAuthUser = {
            id: supabaseUser.id,
            email: supabaseUser.email || "",
            name: supabaseUser.user_metadata?.name || supabaseUser.email,
            userType: userTypeFromMetadata,
          };

          setSession(currentSession);
          setUser(unifiedUser);
          setUserType(userTypeFromMetadata);

          // Cache session for persistence
          await AsyncStorage.setItem("@medflow_session", JSON.stringify(currentSession));
          await AsyncStorage.setItem("@medflow_user_type", userTypeFromMetadata || "");

          console.log("[useUnifiedAuth] Initialized with session:", {
            userId: supabaseUser.id,
            userType: userTypeFromMetadata,
          });
        } else {
          // Try to restore from AsyncStorage
          const cachedSession = await AsyncStorage.getItem("@medflow_session");
          const cachedUserType = await AsyncStorage.getItem("@medflow_user_type");

          if (cachedSession) {
            try {
              const parsedSession = JSON.parse(cachedSession);
              const supabaseUser = parsedSession.user;

              const unifiedUser: UnifiedAuthUser = {
                id: supabaseUser.id,
                email: supabaseUser.email || "",
                name: supabaseUser.user_metadata?.name || supabaseUser.email,
                userType: (cachedUserType as UserType) || null,
              };

              setSession(parsedSession);
              setUser(unifiedUser);
              setUserType((cachedUserType as UserType) || null);

              console.log("[useUnifiedAuth] Restored from cache:", {
                userId: supabaseUser.id,
                userType: cachedUserType,
              });
            } catch (e) {
              console.error("[useUnifiedAuth] Failed to parse cached session:", e);
              await AsyncStorage.removeItem("@medflow_session");
              await AsyncStorage.removeItem("@medflow_user_type");
            }
          } else {
            console.log("[useUnifiedAuth] No session found");
            setSession(null);
            setUser(null);
            setUserType(null);
          }
        }
      } catch (error) {
        console.error("[useUnifiedAuth] Initialization error:", error);
        setSession(null);
        setUser(null);
        setUserType(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("[useUnifiedAuth] Auth state changed:", event);

      if (newSession?.user) {
        const supabaseUser = newSession.user;
        const userTypeFromMetadata = (supabaseUser.user_metadata?.userType as UserType) || null;

        try {
          await syncProfessionalProfileFromAuth(supabaseUser);
        } catch (syncError) {
          console.error("[useUnifiedAuth] Professional profile sync failed:", syncError);
        }

        const unifiedUser: UnifiedAuthUser = {
          id: supabaseUser.id,
          email: supabaseUser.email || "",
          name: supabaseUser.user_metadata?.name || supabaseUser.email,
          userType: userTypeFromMetadata,
        };

        setSession(newSession);
        setUser(unifiedUser);
        setUserType(userTypeFromMetadata);

        // Cache session
        await AsyncStorage.setItem("@medflow_session", JSON.stringify(newSession));
        await AsyncStorage.setItem("@medflow_user_type", userTypeFromMetadata || "");

        console.log("[useUnifiedAuth] User logged in:", {
          userId: supabaseUser.id,
          userType: userTypeFromMetadata,
        });
      } else {
        setSession(null);
        setUser(null);
        setUserType(null);

        // Clear cache
        await AsyncStorage.removeItem("@medflow_session");
        await AsyncStorage.removeItem("@medflow_user_type");

        console.log("[useUnifiedAuth] User logged out");
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signup = useCallback(
    async (
      email: string,
      password: string,
      userTypeParam: UserType,
      name: string,
      profileData?: Record<string, unknown>
    ) => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              userType: userTypeParam,
              name,
              ...profileData,
            },
          },
        });

        if (error) throw error;

        try {
          await syncProfessionalProfileFromAuth(data.user ?? null);
        } catch (syncError) {
          console.error("[useUnifiedAuth] Professional profile sync failed:", syncError);
        }

        console.log("[useUnifiedAuth] Signup successful:", {
          userId: data.user?.id,
          userType: userTypeParam,
        });

        return;
      } catch (error) {
        console.error("[useUnifiedAuth] Signup error:", error);
        throw error;
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

      if (data.session?.user) {
        const supabaseUser = data.session.user;
        const userTypeFromMetadata = (supabaseUser.user_metadata?.userType as UserType) || null;

        const unifiedUser: UnifiedAuthUser = {
          id: supabaseUser.id,
          email: supabaseUser.email || "",
          name: supabaseUser.user_metadata?.name || supabaseUser.email,
          userType: userTypeFromMetadata,
        };

        setSession(data.session);
        setUser(unifiedUser);
        setUserType(userTypeFromMetadata);

        // Cache session
        await AsyncStorage.setItem("@medflow_session", JSON.stringify(data.session));
        await AsyncStorage.setItem("@medflow_user_type", userTypeFromMetadata || "");

        console.log("[useUnifiedAuth] Login successful:", {
          userId: supabaseUser.id,
          userType: userTypeFromMetadata,
        });
      }

      return;
    } catch (error) {
      console.error("[useUnifiedAuth] Login error:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
      setUserType(null);

      // Clear cache
      await AsyncStorage.removeItem("@medflow_session");
      await AsyncStorage.removeItem("@medflow_user_type");

      console.log("[useUnifiedAuth] Logout successful");

      return;
    } catch (error) {
      console.error("[useUnifiedAuth] Logout error:", error);
      throw error;
    }
  }, []);

  const isAuthenticated = useMemo(() => Boolean(user && session), [user, session]);

  return {
    user,
    userType,
    session,
    loading,
    isAuthenticated,
    signup,
    login,
    logout,
  };
}
