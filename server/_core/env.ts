export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  mercadoPagoAccessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN ?? "",
  mercadoPagoPublicKey: process.env.EXPO_PUBLIC_MERCADO_PAGO_PUBLIC_KEY ?? "",
  mercadoPagoWebhookUrl: process.env.MERCADO_PAGO_WEBHOOK_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};
