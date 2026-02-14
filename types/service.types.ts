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

export const createServiceSchema = z.object({
  name: z.string().min(2, { message: "A szolgáltatás neve túl rövid." }),
  type: z.string().min(2, { message: "A szolgáltatás típusa túl rövid." }),
  price: z.number().optional(),
  duration: z.number().optional(),
  image: z.string().optional(),
  optionCount: z.number().optional(),
});

export type CreateService = z.infer<typeof createServiceSchema>;

export const updateServiceSchema = createServiceSchema.partial();

export type UpdateService = z.infer<typeof updateServiceSchema>;
