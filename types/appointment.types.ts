import z from "zod";

export const appointmentSchema = z.object({
  id: z.uuid(),
  name: z.string(),

  startDate: z.date(),
  endDate: z.date(),

  notes: z.string().optional(),
  eventId: z.string(),

  customerId: z.string(),
});

export type Appointment = z.infer<typeof appointmentSchema>;

export const createAppointmentSchema = z.object({
  name: z.string(),
  phoneNumber: z.string(),
  email: z.string().optional(),

  service: z.string(),
  timeFrame: z.number(),

  startDate: z.string(),

  notes: z.string(),
});

export type CreateAppointment = z.infer<typeof createAppointmentSchema>;
