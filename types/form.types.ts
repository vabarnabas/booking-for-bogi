import z from "zod";
import { serviceSchema } from "./service.types";

export const bookingFormSchema = z.object({
  service: z.string(),
  options: z.array(serviceSchema),
  name: z.string(),
  phoneNumber: z
    .string()
    .min(6, { message: "A telefonszám túl rövid." })
    .refine((value) => /^\+36[1-9][0-9]{8}$/.test(value), {
      message: "Érvénytelen telefonszám formátum.",
    }),
  email: z.email().optional(),
  timeSlot: z.object({
    start: z.string(),
    end: z.string(),
  }),
});

export type BookingForm = z.infer<typeof bookingFormSchema>;
