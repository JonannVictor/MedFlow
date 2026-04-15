import { ScrollView, Text, View } from "react-native";
import { Link } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function LandingScreen() {
  const colors = useColors();

  // Redirecionamento é feito automaticamente por useUnifiedAuthRedirect

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-between py-8 px-6">
          {/* Hero Section */}
          <View className="flex-1 justify-center gap-6">
            <View className="items-center gap-4">
              <View
                className="w-20 h-20 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-4xl">🏥</Text>
              </View>
              <Text className="text-4xl font-bold text-foreground text-center">MedFlow</Text>
              <Text className="text-lg text-muted text-center leading-relaxed">
                Conectando pacientes e profissionais de saúde
              </Text>
            </View>

            {/* Description */}
            <View className="bg-surface rounded-2xl p-6 gap-3">
              <Text className="text-base font-semibold text-foreground">
                Consultas online de triagem
              </Text>
              <Text className="text-sm text-muted leading-relaxed">
                Reduzimos filas, facilitamos acesso à saúde e criamos triagem médica eficiente.
              </Text>
            </View>
          </View>

          {/* CTA Buttons */}
          <View className="gap-3">
            <Link href={"auth/patient-signup" as any} asChild>
              <View
                style={{ backgroundColor: colors.primary }}
                className="py-4 px-6 rounded-full items-center active:opacity-80"
              >
                <Text className="text-base font-semibold text-white">Sou Paciente</Text>
              </View>
            </Link>

            <Link href={"auth/professional-signup" as any} asChild>
              <View
                style={{
                  borderColor: colors.primary,
                  borderWidth: 2,
                }}
                className="py-4 px-6 rounded-full items-center active:opacity-80"
              >
                <Text className="text-base font-semibold" style={{ color: colors.primary }}>
                  Sou Profissional
                </Text>
              </View>
            </Link>

            <Link href={"auth/login" as any} asChild>
              <View className="py-3 px-6 rounded-full items-center active:opacity-80">
                <Text className="text-base font-semibold" style={{ color: colors.primary }}>
                  Já tenho conta
                </Text>
              </View>
            </Link>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
