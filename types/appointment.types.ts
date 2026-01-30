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
