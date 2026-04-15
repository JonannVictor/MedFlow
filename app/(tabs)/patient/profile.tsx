import { ScrollView, Text, View, Pressable, TextInput, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
import { useState } from "react";

export default function PatientProfileScreen() {
  const colors = useColors();
  const { isAuthenticated, loading, logout } = useUnifiedAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "João Silva",
    email: "joao@example.com",
    phone: "(11) 98765-4321",
    birthDate: "1990-05-15",
    cpf: "123.456.789-00",
  });

  if (loading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  const handleSave = () => {
    console.log("Perfil atualizado:", formData);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="gap-6 px-4 py-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Meu Perfil</Text>
            <Text className="text-base text-muted">Gerencie suas informações pessoais</Text>
          </View>

          {/* Profile Avatar */}
          <View className="items-center gap-3">
            <View
              className="w-20 h-20 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-3xl font-bold text-white">JS</Text>
            </View>
            <Text className="text-xl font-bold text-foreground">{formData.name}</Text>
            <Text className="text-sm text-muted">Paciente</Text>
          </View>

          {/* Edit Mode Toggle */}
          <Pressable
            className={`rounded-lg py-3 ${isEditing ? "bg-error" : "bg-primary"}`}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Text className="text-white font-semibold text-center">
              {isEditing ? "Cancelar Edição" : "Editar Perfil"}
            </Text>
          </Pressable>

          {/* Profile Form */}
          <View className="gap-4 bg-surface rounded-2xl p-4 border border-border">
            {/* Name */}
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

            {/* Email */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Email</Text>
              <TextInput
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                editable={isEditing}
                keyboardType="email-address"
                className={`border rounded-lg px-3 py-2 text-foreground ${
                  isEditing ? "border-primary bg-background" : "border-border bg-background opacity-60"
                }`}
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Phone */}
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

            {/* Birth Date */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Data de Nascimento</Text>
              <TextInput
                value={formData.birthDate}
                onChangeText={(text) => setFormData({ ...formData, birthDate: text })}
                editable={isEditing}
                placeholder="YYYY-MM-DD"
                className={`border rounded-lg px-3 py-2 text-foreground ${
                  isEditing ? "border-primary bg-background" : "border-border bg-background opacity-60"
                }`}
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* CPF */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">CPF</Text>
              <TextInput
                value={formData.cpf}
                onChangeText={(text) => setFormData({ ...formData, cpf: text })}
                editable={isEditing}
                className={`border rounded-lg px-3 py-2 text-foreground ${
                  isEditing ? "border-primary bg-background" : "border-border bg-background opacity-60"
                }`}
                placeholderTextColor={colors.muted}
              />
            </View>
          </View>

          {/* Save Button */}
          {isEditing && (
            <Pressable className="bg-success rounded-lg py-3" onPress={handleSave}>
              <Text className="text-white font-semibold text-center">Salvar Alterações</Text>
            </Pressable>
          )}

          {/* Logout Button */}
          <Pressable className="bg-error rounded-lg py-3" onPress={handleLogout}>
            <Text className="text-white font-semibold text-center">Sair da Conta</Text>
          </Pressable>

          {/* Info */}
          <View className="bg-warning/10 rounded-lg p-4 gap-2">
            <Text className="text-sm font-semibold text-foreground">Informações de Segurança</Text>
            <Text className="text-xs text-muted">
              Seus dados são criptografados e seguros. Nunca compartilhamos suas informações pessoais.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
