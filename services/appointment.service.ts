import { db } from "@/db";
import { appointments } from "@/db/schema";

async function getAppointments() {
  const appointments = await db.query.appointments.findMany({
    with: {
      customer: true,
    },
  });

  return appointments;
}

async function createAppointment({
  service,
  startDate,
  endDate,
  notes,
  eventId,
  customerId,
}: {
  service: string;
  startDate: string;
  endDate: string;
  notes?: string;
  eventId: string;
  customerId: string;
}) {
  return await db.insert(appointments).values({
    name: service,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    notes: notes || "",
    eventId: eventId,
    customerId: customerId,
  });
}

export const AppointmentService = {
  getAppointments,
  createAppointment,
};
