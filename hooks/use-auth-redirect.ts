import { useEffect } from "react";
import { useAuth } from "./use-auth";
import { useRouter, useSegments } from "expo-router";

export function useAuthRedirect() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "auth" || segments[0] === "landing";

    if (!isAuthenticated && !inAuthGroup) {
      // User is not authenticated and not in auth group, redirect to landing
      router.replace("landing" as any);
    } else if (isAuthenticated && inAuthGroup) {
      // User is authenticated and in auth group, redirect to dashboard
      router.replace("(tabs)" as any);
    }
  }, [isAuthenticated, loading, segments]);
}
