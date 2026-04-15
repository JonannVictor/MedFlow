import { ScrollView, Text, View, TextInput, Pressable, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";

export default function ProfessionalProfileScreen() {
  const colors = useColors();
  const { isAuthenticated, loading: authLoading, logout, userType } = useUnifiedAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    specialty: "",
    bio: "",
    price: "",
    location: "",
    crm: "",
  });



  const handleSaveProfile = async () => {
    // TODO: Save profile to database
    console.log("Save profile:", formData);
    setIsEditing(false);
  };

  if (authLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  if (userType !== "professional") {
    console.warn("[ProfessionalProfile] User is not a professional, this should not happen");
    return (
      <ScreenContainer className="items-center justify-center gap-4 px-6">
        <Text className="text-2xl font-bold text-foreground text-center">Acesso Restrito</Text>
        <Text className="text-base text-muted text-center">
          Apenas profissionais podem acessar esta tela
        </Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 gap-6 py-6 px-6">
          {/* Header */}
          <View className="gap-1">
            <Text className="text-3xl font-bold text-foreground">Meu Perfil</Text>
            <Text className="text-base text-muted">Gerencie suas informações profissionais</Text>
          </View>

          {/* Profile Card */}
          <View className="bg-surface border border-border rounded-2xl p-6 gap-4">
            {/* Avatar */}
            <View
              className="w-16 h-16 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-3xl">👨‍⚕️</Text>
            </View>

            {/* User Info */}
            <View className="gap-3">
              <View className="gap-1">
                <Text className="text-sm text-muted">Nome</Text>
                <Text className="text-lg font-semibold text-foreground">Profissional</Text>
              </View>

              <View className="gap-1">
                <Text className="text-sm text-muted">Email</Text>
                <Text className="text-lg font-semibold text-foreground">N/A</Text>
              </View>
            </View>
          </View>

          {/* Professional Info */}
          {isEditing ? (
            <View className="gap-4">
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Especialidade</Text>
                <TextInput
                  placeholder="Ex: Cardiologia"
                  placeholderTextColor={colors.muted}
                  value={formData.specialty}
                  onChangeText={(text) => setFormData({ ...formData, specialty: text })}
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                  style={{ color: colors.foreground }}
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Bio/Descrição</Text>
                <TextInput
                  placeholder="Descreva sua experiência"
                  placeholderTextColor={colors.muted}
                  value={formData.bio}
                  onChangeText={(text) => setFormData({ ...formData, bio: text })}
                  multiline
                  numberOfLines={3}
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                  style={{ color: colors.foreground }}
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Valor da Consulta (R$)</Text>
                <TextInput
                  placeholder="Ex: 150.00"
                  placeholderTextColor={colors.muted}
                  value={formData.price}
                  onChangeText={(text) => setFormData({ ...formData, price: text })}
                  keyboardType="decimal-pad"
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                  style={{ color: colors.foreground }}
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Localização</Text>
                <TextInput
                  placeholder="Ex: São Paulo, SP"
                  placeholderTextColor={colors.muted}
                  value={formData.location}
                  onChangeText={(text) => setFormData({ ...formData, location: text })}
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                  style={{ color: colors.foreground }}
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">CRM</Text>
                <TextInput
                  placeholder="Seu número de CRM"
                  placeholderTextColor={colors.muted}
                  value={formData.crm}
                  onChangeText={(text) => setFormData({ ...formData, crm: text })}
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                  style={{ color: colors.foreground }}
                />
              </View>

              <View className="flex-row gap-2 pt-2">
                <Pressable
                  onPress={handleSaveProfile}
                  style={({ pressed }) => [
                    {
                      backgroundColor: colors.primary,
                      opacity: pressed ? 0.9 : 1,
                    },
                  ]}
                  className="flex-1 py-3 px-4 rounded-lg items-center"
                >
                  <Text className="text-base font-semibold text-white">Salvar</Text>
                </Pressable>

                <Pressable
                  onPress={() => setIsEditing(false)}
                  style={({ pressed }) => [
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      borderWidth: 1,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  className="flex-1 py-3 px-4 rounded-lg items-center"
                >
                  <Text className="text-base font-semibold text-foreground">Cancelar</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View className="gap-3">
              <Pressable
                onPress={() => setIsEditing(true)}
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                className="py-4 px-4 rounded-lg"
              >
                <Text className="text-base font-semibold text-foreground">Editar Perfil</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                className="py-4 px-4 rounded-lg"
              >
                <Text className="text-base font-semibold text-foreground">Configurações</Text>
              </Pressable>

              <Pressable
                onPress={logout}
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.error,
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}
                className="py-4 px-4 rounded-lg items-center mt-auto"
              >
                <Text className="text-base font-semibold text-white">Sair da Conta</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
