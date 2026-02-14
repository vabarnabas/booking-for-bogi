import z from "zod";

export const serviceSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  type: z.string(),
  price: z.number().nullable(),
  duration: z.number().nullable(),
  image: z.string().nullable(),
});

export type Service = z.infer<typeof serviceSchema>;

const baseServiceSchema = z.object({
  name: z.string().min(2, { message: "A szolgáltatás neve túl rövid." }),
  type: z.string().min(2, { message: "A szolgáltatás típusa túl rövid." }),
  price: z.string().optional(),
  duration: z.string().optional(),
  image: z.string().optional(),
  parentIds: z
    .array(z.object({ id: z.string(), parentId: z.string() }))
    .optional(),
});

// Create schema with conditional parentId
export const createServiceSchema = baseServiceSchema.refine(
  (data) =>
    data.type === "top-level" ||
    (!!data.parentIds && data.parentIds.length > 0),
  {
    message:
      'Válassz legalább egy szülő szolgáltatást, ha nem "Fő szolgáltatás" típusú a szolgáltatás.',
    path: ["parentId"],
  },
);

export type CreateService = z.infer<typeof createServiceSchema>;

// Update schema — partial of the base (no refine issues)
export const updateServiceSchema = baseServiceSchema.partial();

export type UpdateService = z.infer<typeof updateServiceSchema>;
