import z from "zod";

export const eventSchema = z.object({
  id: z.string(),
  subcalendar_ids: z.array(z.string()),
  start_dt: z.string(),
  end_dt: z.string(),
  all_day: z.boolean(),
  creation_dt: z.string(),
  update_dt: z.string(),
  tz: z.string(),
  title: z.string(),
  who: z.string(),
});

export type Event = z.infer<typeof eventSchema>;

export const createEventSchema = z.object({
  start_dt: z.string(),
  timeFrame: z.number(),
  title: z.string(),
  notes: z.string(),
  who: z.string(),
});

export type CreateEvent = z.infer<typeof createEventSchema>;
