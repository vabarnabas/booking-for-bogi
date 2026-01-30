import { db } from "@/db";

async function getAppointments() {
  const appointments = await db.query.appointments.findMany({
    with: {
      customer: true,
    },
  });

  return appointments;
}

export const AppointmentService = {
  getAppointments,
};
