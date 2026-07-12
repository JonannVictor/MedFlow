import { Redirect } from "expo-router";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
import { ScreenContainer } from "@/components/screen-container";
import { Text, ActivityIndicator, View } from "react-native";
import type { Href } from "expo-router";

/**
 * Root index screen - handles initial navigation based on auth state
 * This is the entry point of the app
 * 
 * Flow:
 * 1. If loading → show loading screen
 * 2. If not authenticated → redirect to landing
 * 3. If authenticated → redirect to tabs (layout will render correct screen based on userType)
 */
export default function Index() {
  const { isAuthenticated, loading, userType } = useUnifiedAuth();

  if (loading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <View className="gap-4">
          <ActivityIndicator size="large" color="#0066CC" />
          <Text className="text-center text-foreground">Carregando...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/landing" />;
  }

  // Authenticated - redirect to correct tabs based on userType
  const targetRoute = userType === "professional" 
    ? "/(tabs)/professional" 
    : "/(tabs)/patient";
  return <Redirect href={targetRoute as Href} />;
}
