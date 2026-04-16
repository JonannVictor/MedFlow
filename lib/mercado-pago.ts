import * as Linking from "expo-linking";
import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { getApiBaseUrl } from "@/constants/oauth";

type CreatePreferenceInput = {
  appointmentId: string;
  title: string;
  description: string;
  unitPrice: number;
};

type MercadoPagoPreferenceResponse = {
  preferenceId: string;
  checkoutUrl: string;
};

type MercadoPagoVerifyResponse = {
  paymentId: string | null;
  paymentStatus: "pending" | "paid" | "failed";
  appointmentStatus: "pending" | "confirmed";
  rawStatus: string;
};

function getPaymentsApiBaseUrl() {
  const apiBaseUrl = getApiBaseUrl();

  if (!apiBaseUrl) {
    throw new Error(
      "API do backend indisponivel. Defina EXPO_PUBLIC_API_BASE_URL para testar pagamentos no dispositivo."
    );
  }

  return apiBaseUrl.replace(/\/$/, "");
}

function buildReturnUrl(pathname: string, appointmentId: string) {
  const path = `/payment-return?appointmentId=${encodeURIComponent(appointmentId)}&flow=${pathname}`;

  if (Platform.OS === "web" && typeof window !== "undefined") {
    return `${window.location.origin}${path}`;
  }

  return Linking.createURL(path);
}

export async function createMercadoPagoPreference(
  input: CreatePreferenceInput,
): Promise<MercadoPagoPreferenceResponse> {
  const apiBaseUrl = getPaymentsApiBaseUrl();
  const successUrl = buildReturnUrl("success", input.appointmentId);
  const failureUrl = buildReturnUrl("failure", input.appointmentId);
  const pendingUrl = buildReturnUrl("pending", input.appointmentId);

  const response = await fetch(`${apiBaseUrl}/api/payments/mercadopago/preference`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      appointmentId: input.appointmentId,
      title: input.title,
      description: input.description,
      unitPrice: input.unitPrice,
      successUrl,
      failureUrl,
      pendingUrl,
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.message || "Nao foi possivel iniciar o pagamento.");
  }

  return {
    preferenceId: payload.preferenceId,
    checkoutUrl: payload.checkoutUrl,
  };
}

export async function verifyMercadoPagoPayment(params: {
  appointmentId: string;
  paymentId: string;
}): Promise<MercadoPagoVerifyResponse> {
  const apiBaseUrl = getPaymentsApiBaseUrl();

  const response = await fetch(`${apiBaseUrl}/api/payments/mercadopago/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.message || "Nao foi possivel verificar o pagamento.");
  }

  return payload as MercadoPagoVerifyResponse;
}

export async function openMercadoPagoCheckout(checkoutUrl: string) {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.location.href = checkoutUrl;
    return;
  }

  await WebBrowser.openBrowserAsync(checkoutUrl);
}
