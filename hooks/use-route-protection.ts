import { useEffect } from "react";
import { useUnifiedAuth } from "./use-unified-auth";
import { useRouter, useSegments } from "expo-router";

/**
 * Hook que protege rotas baseado no tipo de usuário
 * - Pacientes não podem acessar rotas de profissional
 * - Profissionais não podem acessar rotas de paciente
 */
export function useRouteProtection() {
  const { userType, isAuthenticated, loading } = useUnifiedAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading || !isAuthenticated) return;

    const routeSegments = Array.from(segments) as string[];
    const currentScreen = routeSegments[routeSegments.length - 1];
    const currentArea = routeSegments.includes("professional")
      ? "professional"
      : routeSegments.includes("patient")
        ? "patient"
        : null;

    console.log("[useRouteProtection]", {
      userType,
      segments: routeSegments,
      currentArea,
      currentScreen,
    });

    // If patient tries to access professional area
    if (userType === "patient" && currentArea === "professional") {
      console.warn("[useRouteProtection] Patient trying to access professional route, redirecting");
      router.replace("(tabs)/patient/index" as any);
      return;
    }

    // If professional tries to access patient area
    if (userType === "professional" && currentArea === "patient") {
      console.warn("[useRouteProtection] Professional trying to access patient route, redirecting");
      router.replace("(tabs)/professional/index" as any);
      return;
    }
  }, [userType, isAuthenticated, loading, segments]);
}
