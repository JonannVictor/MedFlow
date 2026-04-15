import { Slot } from "expo-router";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
import { ScreenContainer } from "@/components/screen-container";
import { Text, ActivityIndicator, View } from "react-native";

/**
 * Tabs layout - renders the correct tab layout based on userType
 * 
 * This is the parent layout for all tabs.
 * It checks the userType and renders either:
 * - PatientTabLayout (patient) at app/(tabs)/patient/_layout.tsx
 * - ProfessionalTabLayout (professional) at app/(tabs)/professional/_layout.tsx
 */
export default function TabsLayout() {
  const { userType, loading } = useUnifiedAuth();

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

  // If no userType, show error
  if (!userType) {
    return (
      <ScreenContainer className="items-center justify-center">
        <View className="gap-4">
          <Text className="text-center text-foreground">Erro: Tipo de usuário não definido</Text>
        </View>
      </ScreenContainer>
    );
  }

  // Render the children - Expo Router will handle which screen to show based on the route
  // The route will be either /(tabs)/patient or /(tabs)/professional
  return <Slot />;
}
