import z from "zod";
import { serviceSchema } from "./service.types";

export const paymentDetailsSchema = z.discriminatedUnion("paymentMethod", [
  z.object({
    paymentMethod: z.literal("cash"),
  }),
  z.object({
    paymentMethod: z.literal("transfer"),
    postCode: z.string().min(4, { message: "Az irányítószám túl rövid." }),
    city: z.string().min(2, { message: "A város neve túl rövid." }),
    street: z.string().min(2, { message: "Az utca neve túl rövid." }),
    houseNumber: z.string().min(1, { message: "A házszám megadása kötelező." }),
  }),
]);

export const bookingFormSchema = z
  .object({
    service: z.string(),
    options: z.array(serviceSchema),
    name: z.string().min(2, { message: "A név túl rövid." }),
    phoneNumber: z
      .string()
      .min(6, { message: "A telefonszám túl rövid." })
      .refine((value) => /^[1-9][0-9]{8}$/.test(value), {
        message: "Érvénytelen telefonszám formátum.",
      }),
    email: z
      .string()
      .optional()
      .refine(
        (value) => {
          if (!value || value === "") return true;
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        { message: "Hibás email formátum." },
      ),
    timeSlot: z.object({
      start: z.string(),
      end: z.string(),
    }),
    privacyPolicy: z.boolean().refine((value) => value === true, {
      message: "Az adatvédelmi szabályzat elfogadása kötelező.",
    }),
  })
  .and(paymentDetailsSchema);

export type BookingForm = z.infer<typeof bookingFormSchema>;
