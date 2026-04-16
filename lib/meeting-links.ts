import { Linking } from "react-native";

function normalizeMeetingUrl(value: string | null | undefined) {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export async function openMeetingUrl(meetingUrl: string | null | undefined) {
  const normalizedUrl = normalizeMeetingUrl(meetingUrl);

  if (!normalizedUrl) {
    throw new Error("Nenhum link de consulta foi definido ainda.");
  }

  const canOpen = await Linking.canOpenURL(normalizedUrl);
  if (!canOpen) {
    throw new Error("Nao foi possivel abrir o link da consulta.");
  }

  await Linking.openURL(normalizedUrl);
}
