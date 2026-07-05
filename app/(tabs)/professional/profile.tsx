import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ScreenContainer } from "@/components/screen-container";
import { Badge, Button, Card, ScreenHeader, StatCard, TextField } from "@/components/ui/medflow";
import { useColors } from "@/hooks/use-colors";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
import {
  getProfessionalProfileFormData,
  medflowQueryKeys,
  saveProfessionalProfile,
  type ProfessionalProfileFormData,
} from "@/lib/medflow-supabase";

const EMPTY_FORM: ProfessionalProfileFormData = {
  name: "",
  email: "",
  phone: "",
  specialty: "",
  crm: "",
  bio: "",
  price: "",
  meetingUrl: "",
};

export default function ProfessionalProfileScreen() {
  const colors = useColors();
  const { user, loading, logout } = useUnifiedAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfessionalProfileFormData>(EMPTY_FORM);
  const queryClient = useQueryClient();
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: user ? ["medflow", "professional-profile", user.id] : ["medflow", "professional-profile", "anonymous"],
    queryFn: () => getProfessionalProfileFormData(user!.id, user?.email ?? ""),
    enabled: Boolean(user?.id),
  });

  useEffect(() => {
    if (profileData) {
      setFormData(profileData);
    }
  }, [profileData]);

  const saveMutation = useMutation({
    mutationFn: () => {
      if (!user) {
        throw new Error("Usuario nao encontrado.");
      }

      if (!formData.name || !formData.specialty || !formData.crm) {
        throw new Error("Nome, especialidade e CRM sao obrigatorios.");
      }

      return saveProfessionalProfile(user.id, formData);
    },
    onSuccess: async () => {
      if (user) {
        await queryClient.invalidateQueries({
          queryKey: ["medflow", "professional-profile", user.id],
        });
        await queryClient.invalidateQueries({
          queryKey: medflowQueryKeys.professionals,
        });
      }
      setIsEditing(false);
      Alert.alert("Perfil atualizado", "Seus dados profissionais foram salvos.");
    },
    onError: (error) => {
      Alert.alert("Erro ao salvar", error.message);
    },
  });

  if (loading || profileLoading) {
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
            eyebrow="Profissional"
            title="Meu perfil"
            subtitle="Atualize seu perfil publico, CRM e link da consulta para manter o fluxo funcionando sem atrito."
          />

          <Card className="items-center gap-3">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-primary">
              <Text className="text-3xl font-extrabold text-white">{initials}</Text>
            </View>
            <Text className="text-xl font-extrabold text-foreground">{formData.name || "Profissional"}</Text>
            <Badge label={formData.specialty || "Especialidade pendente"} tone="primary" />
          </Card>

          <View className="flex-row gap-3">
            <StatCard value={formData.crm ? "OK" : "--"} label="CRM" tone="primary" />
            <StatCard value={formData.meetingUrl ? "OK" : "--"} label="Link" tone="success" />
            <StatCard value={formData.price ? `R$ ${formData.price}` : "--"} label="Consulta" tone="warning" />
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
              label="Especialidade"
              value={formData.specialty}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, specialty: text }))}
              editable={isEditing}
              inputClassName={!isEditing ? "opacity-60" : undefined}
            />
            <TextField
              label="CRM"
              value={formData.crm}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, crm: text }))}
              editable={isEditing}
              inputClassName={!isEditing ? "opacity-60" : undefined}
            />
            <TextField
              label="Bio"
              value={formData.bio}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, bio: text }))}
              editable={isEditing}
              multiline
              numberOfLines={4}
              inputClassName={!isEditing ? "opacity-60" : undefined}
            />
            <TextField
              label="Valor da consulta (R$)"
              value={formData.price}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, price: text }))}
              editable={isEditing}
              keyboardType="decimal-pad"
              helperText="Digite apenas numeros. Exemplo: 150"
              inputClassName={!isEditing ? "opacity-60" : undefined}
            />
            <TextField
              label="Link da consulta"
              value={formData.meetingUrl}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, meetingUrl: text }))}
              editable={isEditing}
              autoCapitalize="none"
              keyboardType="url"
              placeholder="https://meet.google.com/..."
              helperText="Se nao comecar com https://, o app completa automaticamente."
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
            <Text className="text-sm font-bold text-foreground">Importante</Text>
            <Text className="text-sm leading-5 text-muted">
              CRM, especialidade e link da consulta impactam diretamente confirmacoes, exibicao na busca do paciente e
              abertura da videochamada.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
