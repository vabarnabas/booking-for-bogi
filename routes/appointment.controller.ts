import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { db } from "@/db";
import { AppointmentService } from "@/services/appointment.service";
import { CustomerService } from "@/services/customer.service";
import { createAppointmentSchema } from "@/types/appointment.types";

export const appointmentController = new Hono();

appointmentController.get("/", async (c) => {
  const appointments = await AppointmentService.getAppointments();

  return c.json(appointments);
});

appointmentController.post(
  "/",
  zValidator("json", createAppointmentSchema),
  async (c) => {
    const body = c.req.valid("json");

    const url = new URL(
      `${process.env.CALENDAR_API_URL}/${process.env.CALENDAR_KEY}/events`,
    );

    url.searchParams.append("inputFormat", "markdown");

    const endDate = new Date(
      new Date(body.startDate).getTime() + (body.timeFrame || 30) * 60000,
    );

    const calendarResponse = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        subcalendar_ids: ["15143779"],
        start_dt: new Date(body.startDate)
          .toISOString()
          .replace(/\.\d{3}Z$/, "Z"),
        end_dt: endDate.toISOString().replace(/\.\d{3}Z$/, "Z"),
        signup_enabled: false,
        comments_enabled: true,
        attachemnts: [],
        title: body.service,
        notes: body.notes || "Appointment created via API",
        who: body.name,
      }),
      headers: {
        "Teamup-Token": `${process.env.CALENDAR_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!calendarResponse.ok) {
      throw new Error(`Error creating event: ${calendarResponse.statusText}`);
    }

    const calendarEvent = await calendarResponse.json();

    let customerId: string;

    const customer = await db.query.customers.findFirst({
      where: (customers, { eq }) => eq(customers.name, body.name),
    });

    if (!customer) {
      const newCustomer = await CustomerService.createCustomer(
        body.name,
        "N/A",
      );
      customerId = newCustomer.id;
    } else customerId = customer.id;

    await AppointmentService.createAppointment({
      customerId,
      service: body.service,
      startDate: body.startDate,
      endDate: endDate.toISOString(),
      notes: body.notes,
      eventId: calendarEvent.event.id,
    });

    return c.json({ event: calendarEvent.event, customer });
  },
);
