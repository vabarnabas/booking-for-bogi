import z from "zod";

export const serviceCategorySchema = z.object({
  id: z.uuid(),
  displayName: z.string(),
  slug: z.string(),
});

export type ServiceCategory = z.infer<typeof serviceCategorySchema>;

export const createServiceCategorySchema = z.object({
  displayName: z.string().min(2, {
    message: "A szolgáltatás kategória neve túl rövid.",
  }),
  slug: z.string().min(2, {
    message: "A szolgáltatás kategória slug-ja túl rövid.",
  }),
});

export type CreateServiceCategory = z.infer<typeof createServiceCategorySchema>;
