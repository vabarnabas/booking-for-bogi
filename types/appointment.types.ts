import z from "zod";
import { paymentDetailsSchema } from "./form.types";

export const appointmentSchema = z.object({
  id: z.uuid(),
  name: z.string(),

  startDate: z.date(),
  endDate: z.date(),

  notes: z.string().optional(),
  eventId: z.string(),

  status: z.string(),

  customerId: z.string(),
});

export type Appointment = z.infer<typeof appointmentSchema>;

export const createAppointmentSchema = z.object({
  name: z.string(),
  phoneNumber: z.string(),
  email: z.string().optional(),

  service: z.string(),
  timeFrame: z.number(),

  status: z.string().optional(),

  startDate: z.date(),

  details: z
    .object({
      serviceOptions: z.array(z.string()),
      totalCost: z.number(),
      bookingName: z.string(),
      bookingPhoneNumber: z.string(),
      bookingEmail: z.string().optional(),
    })
    .and(paymentDetailsSchema),
});

export type CreateAppointment = z.infer<typeof createAppointmentSchema>;

export const updateAppointmentSchema = createAppointmentSchema.partial();

export type UpdateAppointment = z.infer<typeof updateAppointmentSchema>;
