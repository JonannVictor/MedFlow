import { useEffect } from "react";
import { useUnifiedAuth } from "./use-unified-auth";
import { useRouter, useSegments } from "expo-router";

/**
 * Hook que gerencia redirecionamento automático baseado em autenticação
 * 
 * Lógica simples:
 * - Não autenticado → landing
 * - Autenticado → (tabs) - o layout de tabs renderiza as telas corretas baseado em userType
 * 
 * IMPORTANTE: Não tentamos navegar para rotas específicas dentro de tabs (como (tabs)/patient/index)
 * porque Expo Router não consegue fazer isso. O layout de tabs cuida de renderizar a tela correta.
 */
export function useUnifiedAuthRedirect() {
  const { isAuthenticated, loading, userType } = useUnifiedAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) {
      console.log("[useUnifiedAuthRedirect] Loading auth state...");
      return;
    }

    const inAuthSegment = segments[0] === "auth" || segments[0] === "landing";
    const inTabsSegment = segments[0] === "(tabs)";

    console.log("[useUnifiedAuthRedirect] Redirect check:", {
      isAuthenticated,
      currentSegment: segments[0],
      inAuthSegment,
      inTabsSegment,
    });

    if (!isAuthenticated) {
      // Not authenticated - redirect to landing
      if (!inAuthSegment && segments[0] !== undefined) {
        console.log("[useUnifiedAuthRedirect] Not authenticated, redirecting to landing");
        router.replace("landing" as any);
      }
    } else {
      // Authenticated - redirect to correct tabs based on userType
      if (!inTabsSegment && segments[0] !== undefined) {
        const targetRoute = userType === "professional" 
          ? "/(tabs)/professional" 
          : "/(tabs)/patient";
        console.log("[useUnifiedAuthRedirect] Authenticated, redirecting to:", targetRoute);
        router.replace(targetRoute as any);
      }
    }
  }, [isAuthenticated, loading, segments, userType]);
}
