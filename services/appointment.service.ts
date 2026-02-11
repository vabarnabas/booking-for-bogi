import { eq } from "drizzle-orm";
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

async function getAppointmentById(id: string) {
  const appointment = await db.query.appointments.findFirst({
    where: (appointments, { eq }) => eq(appointments.id, id),
    with: {
      customer: true,
    },
  });

  return appointment;
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
  notes: string;
  eventId: string;
  customerId: string;
}) {
  const createdAppointments = await db
    .insert(appointments)
    .values({
      name: service,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      notes: notes,
      eventId: eventId,
      customerId: customerId,
    })
    .returning();

  return createdAppointments[0];
}

async function updateAppointmentStatus(id: string, status: string) {
  const [updatedAppointment] = await db
    .update(appointments)
    .set({ status })
    .where(eq(appointments.id, id))
    .returning();

  return updatedAppointment;
}

export const AppointmentService = {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus,
};
