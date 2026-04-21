import { ScrollView, Text, View } from "react-native";
import { Link } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { Badge, Button, Card, ScreenHeader } from "@/components/ui/medflow";

export default function LandingScreen() {
  // Redirecionamento e feito automaticamente por useUnifiedAuthRedirect.

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-between px-6 py-8">
          <View className="flex-1 justify-center gap-8">
            <View className="gap-5">
              <Badge label="Triagem online" tone="primary" />
              <View className="gap-4">
                <View className="h-20 w-20 items-center justify-center rounded-3xl bg-primary">
                  <Text className="text-4xl font-extrabold text-white">M</Text>
                </View>
                <ScreenHeader
                  title="MedFlow"
                  subtitle="Conectando pacientes e profissionais de saude com agendamento simples, pagamento integrado e consulta online."
                />
              </View>
            </View>

            <Card className="gap-4">
              <Text className="text-lg font-bold text-foreground">Cuidado mais rapido, fluxo mais claro.</Text>
              <Text className="text-sm leading-6 text-muted">
                O paciente encontra um profissional, agenda um horario disponivel e acompanha tudo em um so lugar.
              </Text>
              <View className="flex-row flex-wrap gap-2">
                <Badge label="Agenda real" tone="success" />
                <Badge label="Pagamento" tone="warning" />
                <Badge label="Videochamada" tone="primary" />
              </View>
            </Card>
          </View>

          <View className="gap-3">
            <Link href={"auth/patient-signup" as any} asChild>
              <Button title="Sou Paciente" />
            </Link>

            <Link href={"auth/professional-signup" as any} asChild>
              <Button title="Sou Profissional" variant="secondary" />
            </Link>

            <Link href={"auth/login" as any} asChild>
              <Button title="Ja tenho conta" variant="ghost" />
            </Link>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
