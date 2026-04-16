import { ScrollView, Text, View, Pressable, TextInput, ActivityIndicator, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

  const handleSave = async () => {
    await saveMutation.mutateAsync();
  };

  const handleLogout = async () => {
    await logout();
  };

  const initials = formData.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "P";

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="gap-6 px-4 py-6">
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Meu Perfil</Text>
            <Text className="text-base text-muted">Gerencie suas informacoes profissionais</Text>
          </View>

          <View className="items-center gap-3">
            <View
              className="w-20 h-20 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-3xl font-bold text-white">{initials}</Text>
            </View>
            <Text className="text-xl font-bold text-foreground">{formData.name || "Profissional"}</Text>
            <Text className="text-sm text-muted">{formData.specialty || "Especialidade nao informada"}</Text>
          </View>

          <Pressable
            className={`rounded-lg py-3 ${isEditing ? "bg-error" : "bg-primary"}`}
            onPress={() => {
              if (isEditing && profileData) {
                setFormData(profileData);
              }
              setIsEditing(!isEditing);
            }}
          >
            <Text className="text-white font-semibold text-center">
              {isEditing ? "Cancelar Edicao" : "Editar Perfil"}
            </Text>
          </Pressable>

          <View className="gap-4 bg-surface rounded-2xl p-4 border border-border">
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Nome Completo</Text>
              <TextInput
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                editable={isEditing}
                className={`border rounded-lg px-3 py-2 text-foreground ${
                  isEditing ? "border-primary bg-background" : "border-border bg-background opacity-60"
                }`}
                placeholderTextColor={colors.muted}
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Email</Text>
              <TextInput
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                editable={false}
                keyboardType="email-address"
                className="border rounded-lg px-3 py-2 text-foreground border-border bg-background opacity-60"
                placeholderTextColor={colors.muted}
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Telefone</Text>
              <TextInput
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                editable={isEditing}
                keyboardType="phone-pad"
                className={`border rounded-lg px-3 py-2 text-foreground ${
                  isEditing ? "border-primary bg-background" : "border-border bg-background opacity-60"
                }`}
                placeholderTextColor={colors.muted}
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Especialidade</Text>
              <TextInput
                value={formData.specialty}
                onChangeText={(text) => setFormData({ ...formData, specialty: text })}
                editable={isEditing}
                className={`border rounded-lg px-3 py-2 text-foreground ${
                  isEditing ? "border-primary bg-background" : "border-border bg-background opacity-60"
                }`}
                placeholderTextColor={colors.muted}
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">CRM</Text>
              <TextInput
                value={formData.crm}
                onChangeText={(text) => setFormData({ ...formData, crm: text })}
                editable={isEditing}
                className={`border rounded-lg px-3 py-2 text-foreground ${
                  isEditing ? "border-primary bg-background" : "border-border bg-background opacity-60"
                }`}
                placeholderTextColor={colors.muted}
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Bio</Text>
              <TextInput
                value={formData.bio}
                onChangeText={(text) => setFormData({ ...formData, bio: text })}
                editable={isEditing}
                multiline
                numberOfLines={3}
                className={`border rounded-lg px-3 py-2 text-foreground ${
                  isEditing ? "border-primary bg-background" : "border-border bg-background opacity-60"
                }`}
                placeholderTextColor={colors.muted}
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Valor da Consulta (R$)</Text>
              <TextInput
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                editable={isEditing}
                keyboardType="decimal-pad"
                className={`border rounded-lg px-3 py-2 text-foreground ${
                  isEditing ? "border-primary bg-background" : "border-border bg-background opacity-60"
                }`}
                placeholderTextColor={colors.muted}
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Link da Consulta</Text>
              <TextInput
                value={formData.meetingUrl}
                onChangeText={(text) => setFormData({ ...formData, meetingUrl: text })}
                editable={isEditing}
                autoCapitalize="none"
                keyboardType="url"
                className={`border rounded-lg px-3 py-2 text-foreground ${
                  isEditing ? "border-primary bg-background" : "border-border bg-background opacity-60"
                }`}
                placeholder="https://meet.google.com/..."
                placeholderTextColor={colors.muted}
              />
            </View>
          </View>

          {isEditing && (
            <Pressable className="bg-success rounded-lg py-3" onPress={handleSave} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-center">Salvar Alteracoes</Text>
              )}
            </Pressable>
          )}

          <Pressable className="bg-error rounded-lg py-3" onPress={handleLogout}>
            <Text className="text-white font-semibold text-center">Sair da Conta</Text>
          </Pressable>

          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">Estatisticas</Text>
            <View className="flex-row gap-3">
              <View className="flex-1 bg-surface rounded-2xl p-4 border border-border items-center gap-1">
                <Text className="text-2xl font-bold text-primary">4.8</Text>
                <Text className="text-xs text-muted text-center">Avaliacao Media</Text>
              </View>
              <View className="flex-1 bg-surface rounded-2xl p-4 border border-border items-center gap-1">
                <Text className="text-2xl font-bold text-success">127</Text>
                <Text className="text-xs text-muted text-center">Consultas Realizadas</Text>
              </View>
              <View className="flex-1 bg-surface rounded-2xl p-4 border border-border items-center gap-1">
                <Text className="text-2xl font-bold text-primary">95%</Text>
                <Text className="text-xs text-muted text-center">Taxa de Confirmacao</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
