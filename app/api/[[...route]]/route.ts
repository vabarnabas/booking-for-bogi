import { Hono } from "hono";
import { handle } from "hono/vercel";
import { appointmentController } from "@/routes/appointment.controller";
import { calendarController } from "@/routes/calendar.controller";

const app = new Hono().basePath("/api");

app.get("/hello", (c) => {
  return c.json({
    message: "Hello Next.js!",
  });
});

app.route("/calendar", calendarController);
app.route("/appointments", appointmentController);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
