import z from "zod";

export const customerSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),

  notes: z.string().optional(),
});

export type Customer = z.infer<typeof customerSchema>;
