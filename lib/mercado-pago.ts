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

export type MercadoPagoPixResponse = {
  appointmentId: string;
  orderId: string;
  paymentId: string | null;
  paymentStatus: "pending" | "paid" | "failed";
  appointmentStatus: "pending" | "confirmed";
  rawStatus: string;
  ticketUrl: string | null;
  qrCode: string | null;
  qrCodeBase64: string | null;
  expirationDate: string | null;
};

const PAYMENT_REQUEST_TIMEOUT_MS = 12000;

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

async function fetchWithTimeout(input: string, init?: RequestInit) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PAYMENT_REQUEST_TIMEOUT_MS);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        `A API de pagamentos nao respondeu em ${PAYMENT_REQUEST_TIMEOUT_MS / 1000}s. Confira EXPO_PUBLIC_API_BASE_URL e se o backend esta online.`,
      );
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function createMercadoPagoPreference(
  input: CreatePreferenceInput,
): Promise<MercadoPagoPreferenceResponse> {
  const apiBaseUrl = getPaymentsApiBaseUrl();
  const successUrl = buildReturnUrl("success", input.appointmentId);
  const failureUrl = buildReturnUrl("failure", input.appointmentId);
  const pendingUrl = buildReturnUrl("pending", input.appointmentId);

  console.log("[MercadoPago] Creating preference", {
    appointmentId: input.appointmentId,
    apiBaseUrl,
  });

  const response = await fetchWithTimeout(`${apiBaseUrl}/api/payments/mercadopago/preference`, {
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

  console.log("[MercadoPago] Preference created", {
    appointmentId: input.appointmentId,
    preferenceId: payload.preferenceId,
  });

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

  const response = await fetchWithTimeout(`${apiBaseUrl}/api/payments/mercadopago/verify`, {
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

export async function createMercadoPagoPixPayment(input: {
  appointmentId: string;
  description: string;
  transactionAmount: number;
  payer: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
}): Promise<MercadoPagoPixResponse> {
  const apiBaseUrl = getPaymentsApiBaseUrl();

  const response = await fetchWithTimeout(`${apiBaseUrl}/api/payments/mercadopago/pix`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.message || "Nao foi possivel gerar o Pix.");
  }

  return payload as MercadoPagoPixResponse;
}

export async function verifyMercadoPagoPixPayment(params: {
  appointmentId: string;
  orderId: string;
}): Promise<MercadoPagoPixResponse> {
  const apiBaseUrl = getPaymentsApiBaseUrl();

  const response = await fetchWithTimeout(`${apiBaseUrl}/api/payments/mercadopago/pix/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.message || "Nao foi possivel verificar o Pix.");
  }

  return payload as MercadoPagoPixResponse;
}

export async function openMercadoPagoCheckout(checkoutUrl: string) {
  console.log("[MercadoPago] Opening checkout", { checkoutUrl, platform: Platform.OS });

  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.location.href = checkoutUrl;
    return;
  }

  const canOpen = await Linking.canOpenURL(checkoutUrl);

  if (canOpen) {
    await Linking.openURL(checkoutUrl);
    return;
  }

  void WebBrowser.openBrowserAsync(checkoutUrl);
}
