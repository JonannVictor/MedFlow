import { describe, expect, it } from "vitest";
import {
  filterBookedTimeSlots,
  formatDateOnlyString,
  generateAvailableTimeSlots,
  parseDateOnlyString,
  type AppointmentRecord,
  type AvailabilityRecord,
} from "../lib/medflow-supabase";

describe("medflow scheduling helpers", () => {
  it("formats and parses local dates without shifting the day", () => {
    const localDate = new Date(2026, 3, 16, 22, 25, 0);

    const formatted = formatDateOnlyString(localDate);
    const parsed = parseDateOnlyString(formatted);

    expect(formatted).toBe("2026-04-16");
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(3);
    expect(parsed.getDate()).toBe(16);
  });

  it("generates time slots from professional availability", () => {
    const availability: AvailabilityRecord[] = [
      {
        id: "1",
        professional_id: "pro-1",
        day_of_week: 3,
        start_time: "08:00",
        end_time: "11:00",
      },
    ];

    expect(generateAvailableTimeSlots(availability, 3)).toEqual(["08:00", "09:00", "10:00"]);
  });

  it("filters out pending and confirmed booked slots", () => {
    const appointments: AppointmentRecord[] = [
      {
        id: "apt-1",
        patient_id: "pat-1",
        professional_id: "pro-1",
        patient_name: "Paciente",
        professional_name: "Profissional",
        specialty: "Cardio",
        price: 10000,
        date: "2026-04-16",
        time: "09:00",
        status: "pending",
      },
      {
        id: "apt-2",
        patient_id: "pat-2",
        professional_id: "pro-1",
        patient_name: "Paciente 2",
        professional_name: "Profissional",
        specialty: "Cardio",
        price: 10000,
        date: "2026-04-16",
        time: "10:00",
        status: "cancelled",
      },
    ];

    expect(
      filterBookedTimeSlots(["08:00", "09:00", "10:00"], appointments, "2026-04-16"),
    ).toEqual(["08:00", "10:00"]);
  });
});
