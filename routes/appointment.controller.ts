import { Hono } from "hono";
import { AppointmentService } from "@/services/appointment.service";

export const appointmentController = new Hono();

appointmentController.get("/", async (c) => {
  const appointments = await AppointmentService.getAppointments();

  return c.json(appointments);
});
