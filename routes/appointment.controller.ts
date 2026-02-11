import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  generateBaseAppointmentNotes,
  generateExtendedAppointmentNotes,
} from "@/lib/utils";
import { AppointmentService } from "@/services/appointment.service";
import { CalendarService } from "@/services/calendar.service";
import { CustomerService } from "@/services/customer.service";
import { createAppointmentSchema } from "@/types/appointment.types";

export const appointmentController = new Hono();

appointmentController.get("/", async (c) => {
  const appointments = await AppointmentService.getAppointments();

  return c.json(appointments);
});

appointmentController.get("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const appointment = await AppointmentService.getAppointmentById(id);
    return c.json(appointment);
  } catch {
    return c.json({ error: "Appointment not found" }, 404);
  }
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

    let customerId: string;

    const customer = await CustomerService.getCustomerByPhoneNumber(
      body.phoneNumber,
    );

    if (!customer) {
      const newCustomer = await CustomerService.createCustomer(
        body.name,
        body.phoneNumber,
        body.email,
      );
      customerId = newCustomer.id;
    } else customerId = customer.id;

    const notes = generateBaseAppointmentNotes({
      service: body.service,
      bookingName: body.name,
      bookingPhoneNumber: body.phoneNumber,
      totalTime: body.timeFrame,
      totalCost: body.details.totalCost,
      selectedServiceNames: body.details.serviceOptions,
      bookingEmail: body.email,
      ...(body.details.paymentMethod === "transfer"
        ? {
            paymentMethod: "transfer",
            city: body.details.city,
            postCode: body.details.postCode,
            street: body.details.street,
            houseNumber: body.details.houseNumber,
          }
        : { paymentMethod: "cash" }),
    });

    const event = await CalendarService.createEvent({
      title: body.service,
      start_dt: body.startDate,
      timeFrame: body.timeFrame,
      notes: generateExtendedAppointmentNotes(notes, customerId),
      who: body.name,
    });

    const appointment = await AppointmentService.createAppointment({
      customerId,
      service: body.service,
      startDate: body.startDate,
      endDate: endDate.toISOString(),
      notes: notes,
      eventId: event.id,
    });

    return c.json(appointment);
  },
);
