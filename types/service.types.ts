import z from "zod";

export const serviceSchema = z.object({
  name: z.string(),
  type: z.string(),
  price: z.number().nullable(),
  duration: z.number().nullable(),
  image: z.string().optional(),
  optionCount: z.number().optional(),
});

export type Service = z.infer<typeof serviceSchema>;
