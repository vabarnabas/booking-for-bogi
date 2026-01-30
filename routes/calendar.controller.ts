import { Hono } from "hono";
import { CalendarService } from "@/services/calendar.service";

export const calendarController = new Hono();

calendarController.post("/events", async (c) => {
  const body = await c.req.json();

  const service = body.service as string | undefined;
  const name = body.name as string | undefined;
  const startDate = body.startDate as string | undefined;
  const description = body.description as string | undefined;
  const timeFrame = body.timeFrame as number | undefined;

  return c.json(
    await CalendarService.createEvent(
      startDate || "",
      service || "Appointment",
      name || "Guest",
      {
        description,
        timeFrame,
      },
    ),
  );
});

calendarController.get("/events", async (c) => {
  const startDate = c.req.query("startDate") as string | undefined;
  const endDate = c.req.query("endDate") as string | undefined;
  const timezone = c.req.query("tz") as string | undefined;

  return c.json(
    await CalendarService.getEvents({
      startDate,
      endDate,
      timezone,
    }),
  );
});

calendarController.get("/timeslots", async (c) => {
  const date = c.req.query("date") as string;

  const timeFrame = parseInt(c.req.query("timeFrame") as string) || 30;

  return c.json(await CalendarService.getAllTimeSlots(date, timeFrame));
});
