import z from "zod";
import { serviceSchema } from "./service.types";

export const bookingFormSchema = z.object({
  service: z.string(),
  options: z.array(serviceSchema),
  name: z.string(),
  phoneNumber: z.string(),
  email: z.string().optional(),
  timeSlot: z.object({
    start: z.string(),
    end: z.string(),
  }),
});

export type BookingForm = z.infer<typeof bookingFormSchema>;
