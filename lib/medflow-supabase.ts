import { supabase } from "@/lib/supabase";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no-show";

export type ProfessionalRecord = {
  id: string;
  name: string;
  specialty: string;
  bio: string | null;
  price: number;
  location: string | null;
  crm: string;
  rating: number | null;
  created_at?: string;
  updated_at?: string;
};

export type AppointmentRecord = {
  id: string;
  patient_id: string;
  professional_id: string;
  patient_name: string | null;
  professional_name: string | null;
  specialty: string | null;
  price: number;
  date: string;
  time: string;
  status: AppointmentStatus;
  created_at?: string;
  updated_at?: string;
};

export type ProfessionalProfileFormData = {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  crm: string;
  bio: string;
  price: string;
};

export type AvailabilityRecord = {
  id: string;
  professional_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  created_at?: string;
  updated_at?: string;
};

type ProfessionalProfileInput = {
  id: string;
  name: string;
  specialty: string;
  crm: string;
  bio?: string;
  location?: string;
  price?: number;
  rating?: number | null;
};

type AuthUserLike = {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
};

type CreateAppointmentInput = {
  patientId: string;
  patientName?: string;
  professionalId: string;
  professionalName?: string;
  specialty?: string;
  price?: number;
  date: string;
  time: string;
};

function toMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    if (error.message.includes("schema cache")) {
      return `${fallback} Execute o SQL de supabase/schema.sql no projeto Supabase primeiro.`;
    }
    return error.message;
  }

  return fallback;
}

function ensurePositiveInteger(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return Math.round(value);
  }

  if (typeof value === "string") {
    const normalized = Number(value.replace(",", "."));
    if (Number.isFinite(normalized) && normalized >= 0) {
      return Math.round(normalized);
    }
  }

  return fallback;
}

function parsePriceToCents(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return Math.round(value * 100);
  }

  if (typeof value === "string") {
    const normalized = Number(value.replace(",", "."));
    if (Number.isFinite(normalized) && normalized >= 0) {
      return Math.round(normalized * 100);
    }
  }

  return fallback;
}

export const medflowQueryKeys = {
  professionals: ["medflow", "professionals"] as const,
  professionalAppointments: (professionalId: string) =>
    ["medflow", "appointments", "professional", professionalId] as const,
  patientAppointments: (patientId: string) =>
    ["medflow", "appointments", "patient", patientId] as const,
  professionalAvailability: (professionalId: string) =>
    ["medflow", "availability", "professional", professionalId] as const,
};

export async function listProfessionals() {
  const { data, error } = await supabase.from("professionals").select("*").order("name");

  if (error) {
    throw new Error(toMessage(error, "Nao foi possivel carregar os profissionais."));
  }

  return (data ?? []) as ProfessionalRecord[];
}

export async function getProfessionalById(professionalId: string) {
  const { data, error } = await supabase
    .from("professionals")
    .select("*")
    .eq("id", professionalId)
    .single();

  if (error) {
    throw new Error(toMessage(error, "Nao foi possivel carregar o profissional."));
  }

  return data as ProfessionalRecord;
}

export async function getProfessionalByIdOrNull(professionalId: string) {
  const { data, error } = await supabase
    .from("professionals")
    .select("*")
    .eq("id", professionalId)
    .maybeSingle();

  if (error) {
    throw new Error(toMessage(error, "Nao foi possivel carregar o perfil profissional."));
  }

  return (data ?? null) as ProfessionalRecord | null;
}

export async function upsertProfessionalProfile(profile: ProfessionalProfileInput) {
  const payload = {
    id: profile.id,
    name: profile.name,
    specialty: profile.specialty,
    crm: profile.crm,
    bio: profile.bio ?? "",
    location: profile.location ?? "",
    price: ensurePositiveInteger(profile.price, 0),
    rating: typeof profile.rating === "number" ? profile.rating : null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("professionals")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    throw new Error(toMessage(error, "Nao foi possivel sincronizar o perfil profissional."));
  }

  return data as ProfessionalRecord;
}

export async function syncProfessionalProfileFromAuth(user: AuthUserLike | null | undefined) {
  if (!user) return null;

  const metadata = user.user_metadata ?? {};
  if (metadata.userType !== "professional") return null;

  const specialty = typeof metadata.specialty === "string" ? metadata.specialty : "";
  const crm = typeof metadata.crm === "string" ? metadata.crm : "";

  if (!specialty || !crm) return null;

  return upsertProfessionalProfile({
    id: user.id,
    name:
      (typeof metadata.name === "string" && metadata.name) ||
      user.email ||
      "Profissional",
    specialty,
    crm,
    bio: typeof metadata.bio === "string" ? metadata.bio : "",
    location: typeof metadata.location === "string" ? metadata.location : "",
    price: ensurePositiveInteger(metadata.price, 0),
    rating: typeof metadata.rating === "number" ? metadata.rating : null,
  });
}

export async function ensureProfessionalProfileForCurrentUser(userId: string) {
  const existingProfile = await getProfessionalByIdOrNull(userId);
  if (existingProfile) {
    return existingProfile;
  }

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) {
    throw new Error(toMessage(authError, "Nao foi possivel carregar o usuario autenticado."));
  }

  const syncedProfile = await syncProfessionalProfileFromAuth(authData.user ?? null);
  if (syncedProfile) {
    return syncedProfile;
  }

  throw new Error(
    "Seu perfil profissional ainda nao foi criado. Abra a aba Perfil, confira especialidade e CRM e salve uma vez."
  );
}

export async function getProfessionalProfileFormData(userId: string, fallbackEmail = "") {
  const [
    { data: authData, error: authError },
    professional,
  ] = await Promise.all([
    supabase.auth.getUser(),
    getProfessionalByIdOrNull(userId),
  ]);

  if (authError) {
    throw new Error(toMessage(authError, "Nao foi possivel carregar os dados do usuario."));
  }

  const authUser = authData.user;
  const metadata = (authUser?.user_metadata ?? {}) as Record<string, unknown>;

  return {
    name:
      professional?.name ||
      (typeof metadata.name === "string" ? metadata.name : "") ||
      authUser?.email ||
      "",
    email: authUser?.email || fallbackEmail,
    phone: typeof metadata.phone === "string" ? metadata.phone : "",
    specialty:
      professional?.specialty ||
      (typeof metadata.specialty === "string" ? metadata.specialty : ""),
    crm:
      professional?.crm ||
      (typeof metadata.crm === "string" ? metadata.crm : ""),
    bio:
      professional?.bio ||
      (typeof metadata.bio === "string" ? metadata.bio : ""),
    price:
      professional && typeof professional.price === "number"
        ? String(professional.price / 100)
        : typeof metadata.price === "number"
          ? String(metadata.price / 100)
          : "",
  } satisfies ProfessionalProfileFormData;
}

export async function saveProfessionalProfile(
  userId: string,
  formData: ProfessionalProfileFormData,
) {
  const priceInCents = parsePriceToCents(formData.price, 0);

  const { error: updateUserError } = await supabase.auth.updateUser({
    data: {
      name: formData.name,
      phone: formData.phone,
      specialty: formData.specialty,
      crm: formData.crm,
      bio: formData.bio,
      price: priceInCents,
    },
  });

  if (updateUserError) {
    throw new Error(toMessage(updateUserError, "Nao foi possivel atualizar os dados do usuario."));
  }

  return upsertProfessionalProfile({
    id: userId,
    name: formData.name,
    specialty: formData.specialty,
    crm: formData.crm,
    bio: formData.bio,
    price: priceInCents,
  });
}

export async function listProfessionalAvailability(professionalId: string) {
  const { data, error } = await supabase
    .from("availability")
    .select("*")
    .eq("professional_id", professionalId)
    .order("day_of_week", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    throw new Error(toMessage(error, "Nao foi possivel carregar os horarios do profissional."));
  }

  return (data ?? []) as AvailabilityRecord[];
}

export async function replaceProfessionalAvailability(
  professionalId: string,
  dayOfWeek: number,
  selectedTimes: string[],
) {
  await ensureProfessionalProfileForCurrentUser(professionalId);

  const { error: deleteError } = await supabase
    .from("availability")
    .delete()
    .eq("professional_id", professionalId)
    .eq("day_of_week", dayOfWeek);

  if (deleteError) {
    throw new Error(toMessage(deleteError, "Nao foi possivel limpar os horarios anteriores."));
  }

  if (selectedTimes.length === 0) {
    return [];
  }

  const payload = selectedTimes.map((time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const endHour = String(hours + 1).padStart(2, "0");
    const endTime = `${endHour}:${String(minutes).padStart(2, "0")}`;

    return {
      professional_id: professionalId,
      day_of_week: dayOfWeek,
      start_time: time,
      end_time: endTime,
      updated_at: new Date().toISOString(),
    };
  });

  const { data, error } = await supabase.from("availability").insert(payload).select();

  if (error) {
    throw new Error(toMessage(error, "Nao foi possivel salvar os horarios."));
  }

  return (data ?? []) as AvailabilityRecord[];
}

export async function createAppointment(input: CreateAppointmentInput) {
  const payload = {
    patient_id: input.patientId,
    patient_name: input.patientName ?? null,
    professional_id: input.professionalId,
    professional_name: input.professionalName ?? null,
    specialty: input.specialty ?? null,
    price: ensurePositiveInteger(input.price, 0),
    date: input.date,
    time: input.time,
    status: "pending" as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from("appointments").insert(payload).select().single();

  if (error) {
    throw new Error(toMessage(error, "Nao foi possivel criar a consulta."));
  }

  return data as AppointmentRecord;
}

export async function listPatientAppointments(patientId: string) {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("patient_id", patientId)
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error) {
    throw new Error(toMessage(error, "Nao foi possivel carregar as consultas do paciente."));
  }

  return (data ?? []) as AppointmentRecord[];
}

export async function listProfessionalAppointments(professionalId: string) {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("professional_id", professionalId)
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error) {
    throw new Error(toMessage(error, "Nao foi possivel carregar as consultas do profissional."));
  }

  return (data ?? []) as AppointmentRecord[];
}

export async function updateAppointmentStatus(appointmentId: string, status: AppointmentStatus) {
  const { data, error } = await supabase
    .from("appointments")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", appointmentId)
    .select()
    .single();

  if (error) {
    throw new Error(toMessage(error, "Nao foi possivel atualizar a consulta."));
  }

  return data as AppointmentRecord;
}

export function buildAppointmentDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00`);
}

export function toStoredDayOfWeek(date: Date) {
  const jsDayOfWeek = date.getDay();
  return jsDayOfWeek === 0 ? 6 : jsDayOfWeek - 1;
}

export function generateTimeSlotsFromRange(startTime: string, endTime: string) {
  const slots: string[] = [];
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  let currentMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  while (currentMinutes < endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    slots.push(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`);
    currentMinutes += 60;
  }

  return slots;
}

export function generateAvailableTimeSlots(
  availability: AvailabilityRecord[],
  storedDayOfWeek: number,
) {
  const daySlots = availability
    .filter((item) => item.day_of_week === storedDayOfWeek)
    .flatMap((item) => generateTimeSlotsFromRange(item.start_time, item.end_time));

  return Array.from(new Set(daySlots)).sort((a, b) => a.localeCompare(b));
}
