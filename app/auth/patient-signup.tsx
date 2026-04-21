import { ScrollView, Text, View, Pressable } from "react-native";
import { Link, router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { Badge, Button, Card, ScreenHeader, TextField } from "@/components/ui/medflow";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
import { useState } from "react";

export default function PatientSignupScreen() {
  const { signup } = useUnifiedAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirecionamento e feito automaticamente por useUnifiedAuthRedirect.

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError("Preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas nao coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    setError("");
    try {
      console.log("[PatientSignup] Starting signup for:", email);
      await signup(email, password, "patient", name);
      console.log("[PatientSignup] Signup successful, redirecting to login");
      setTimeout(() => {
        router.replace("auth/login" as any);
      }, 500);
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta. Tente novamente.");
      console.error("[PatientSignup] Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-between gap-8 px-6 py-8">
          <View className="gap-6">
            <View className="gap-3">
              <Badge label="Conta paciente" tone="success" />
              <ScreenHeader
                title="Criar conta"
                subtitle="Agende consultas, acompanhe pagamentos e entre na consulta online pelo MedFlow."
              />
            </View>

            {error ? (
              <Card className="border-error/30 bg-error/10">
                <Text className="text-sm font-bold text-error">{error}</Text>
              </Card>
            ) : null}

            <Card className="gap-4">
              <TextField
                label="Nome completo"
                placeholder="Seu nome"
                value={name}
                onChangeText={setName}
                editable={!loading}
              />

              <TextField
                label="Email"
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />

              <TextField
                label="Senha"
                placeholder="********"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
                helperText="Use pelo menos 6 caracteres."
              />

              <TextField
                label="Confirmar senha"
                placeholder="********"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
              />
            </Card>
          </View>

          <View className="gap-3">
            <Button title="Criar conta" onPress={handleSignup} loading={loading} />

            <View className="flex-row justify-center gap-1">
              <Text className="text-sm text-muted">Ja tem conta?</Text>
              <Link href={"login" as any} asChild>
                <Pressable>
                  <Text className="text-sm font-bold text-primary">Fazer login</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
