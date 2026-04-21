import { ScrollView, Text, View, Pressable } from "react-native";
import { Link } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { Button, Card, ScreenHeader, TextField } from "@/components/ui/medflow";
import { useUnifiedAuth } from "@/hooks/use-unified-auth";
import { useState } from "react";

export default function LoginScreen() {
  const { login } = useUnifiedAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirecionamento e feito automaticamente por useUnifiedAuthRedirect.

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Preencha email e senha");
      return;
    }

    setLoading(true);
    setError("");
    try {
      console.log("[Login] Starting login for:", email);
      await login(email, password);
    } catch (err: any) {
      console.error("[Login] Login error:", err);
      setError(err.message || "Email ou senha incorretos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-between px-6 py-8">
          <View className="gap-6">
            <ScreenHeader
              eyebrow="Acesso seguro"
              title="Bem-vindo"
              subtitle="Faca login para continuar acompanhando suas consultas no MedFlow."
            />

            {error ? (
              <Card className="border-error/30 bg-error/10">
                <Text className="text-sm font-bold text-error">{error}</Text>
              </Card>
            ) : null}

            <Card className="gap-4">
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
              />

              <Link href={"#" as any} asChild>
                <Pressable>
                  <Text className="text-sm font-bold text-primary">Esqueci minha senha</Text>
                </Pressable>
              </Link>
            </Card>
          </View>

          <View className="gap-3">
            <Button title="Entrar" onPress={handleLogin} loading={loading} />

            <View className="flex-row justify-center gap-1">
              <Text className="text-sm text-muted">Nao tem conta?</Text>
              <Link href={"landing" as any} asChild>
                <Pressable>
                  <Text className="text-sm font-bold text-primary">Criar conta</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
