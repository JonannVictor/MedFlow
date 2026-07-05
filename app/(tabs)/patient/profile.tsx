import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ScreenContainer } from "@/components/screen-container";
import { Badge, Button, Card, ScreenHeader, StatCard, TextField } from "@/components/ui/medflow";
import { useColors } from "@/hooks/use-colors";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
import { getPatientProfileFormData, savePatientProfile, type PatientProfileFormData } from "@/lib/medflow-supabase";

const EMPTY_FORM: PatientProfileFormData = {
  name: "",
  email: "",
  phone: "",
  birthDate: "",
  cpf: "",
};

export default function PatientProfileScreen() {
  const colors = useColors();
  const { user, loading, logout } = useUnifiedAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PatientProfileFormData>(EMPTY_FORM);
  const { data: profileData, isLoading } = useQuery({
    queryKey: user ? ["medflow", "patient-profile", user.id] : ["medflow", "patient-profile", "anonymous"],
    queryFn: () => getPatientProfileFormData(user?.email ?? ""),
    enabled: Boolean(user?.id),
  });

  useEffect(() => {
    if (profileData) {
      setFormData(profileData);
    }
  }, [profileData]);

  const saveMutation = useMutation({
    mutationFn: () => savePatientProfile(formData),
    onSuccess: () => {
      setIsEditing(false);
      Alert.alert("Perfil atualizado", "Seus dados pessoais foram salvos com sucesso.");
    },
    onError: (error) => {
      Alert.alert("Erro ao salvar", error.message);
    },
  });

  if (loading || isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  const initials =
    formData.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "P";

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="gap-6 px-4 py-6">
          <ScreenHeader
            eyebrow="Paciente"
            title="Meu perfil"
            subtitle="Gerencie seus dados pessoais e mantenha suas informacoes sempre atualizadas."
          />

          <Card className="items-center gap-3">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-primary">
              <Text className="text-3xl font-extrabold text-white">{initials}</Text>
            </View>
            <Text className="text-xl font-extrabold text-foreground">{formData.name || "Paciente"}</Text>
            <Badge label="Conta de paciente" tone="primary" />
          </Card>

          <View className="flex-row gap-3">
            <StatCard value={formData.phone ? "OK" : "--"} label="Telefone" tone="primary" />
            <StatCard value={formData.cpf ? "OK" : "--"} label="CPF" tone="success" />
            <StatCard value={formData.birthDate ? "OK" : "--"} label="Nascimento" tone="warning" />
          </View>

          <Button
            title={isEditing ? "Cancelar edicao" : "Editar perfil"}
            variant={isEditing ? "danger" : "primary"}
            onPress={() => {
              if (isEditing && profileData) {
                setFormData(profileData);
              }
              setIsEditing(!isEditing);
            }}
          />

          <Card className="gap-4">
            <TextField
              label="Nome completo"
              value={formData.name}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
              editable={isEditing}
              inputClassName={!isEditing ? "opacity-60" : undefined}
            />
            <TextField
              label="Email"
              value={formData.email}
              editable={false}
              keyboardType="email-address"
              inputClassName="opacity-60"
            />
            <TextField
              label="Telefone"
              value={formData.phone}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, phone: text }))}
              editable={isEditing}
              keyboardType="phone-pad"
              inputClassName={!isEditing ? "opacity-60" : undefined}
            />
            <TextField
              label="Data de nascimento"
              value={formData.birthDate}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, birthDate: text }))}
              editable={isEditing}
              placeholder="YYYY-MM-DD"
              inputClassName={!isEditing ? "opacity-60" : undefined}
            />
            <TextField
              label="CPF"
              value={formData.cpf}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, cpf: text }))}
              editable={isEditing}
              inputClassName={!isEditing ? "opacity-60" : undefined}
            />
          </Card>

          {isEditing ? (
            <Button
              title="Salvar alteracoes"
              variant="success"
              onPress={() => saveMutation.mutate()}
              loading={saveMutation.isPending}
              disabled={saveMutation.isPending}
            />
          ) : null}

          <Button title="Sair da conta" variant="danger" onPress={logout} />

          <Card variant="accent" className="gap-2">
            <Text className="text-sm font-bold text-foreground">Seguranca</Text>
            <Text className="text-sm leading-5 text-muted">
              Seus dados ficam vinculados a conta autenticada no Supabase. Sempre confira telefone, CPF e data de
              nascimento antes de agendar.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
