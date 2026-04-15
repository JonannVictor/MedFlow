import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export type UserType = "patient" | "professional";

export interface AuthContextType {
  user: any;
  userType: UserType | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [userType, setUserType] = useState<UserType | null>(null);

  useEffect(() => {
    if (user && "userType" in user) {
      setUserType((user as any).userType as UserType);
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    userType,
    isAuthenticated,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
