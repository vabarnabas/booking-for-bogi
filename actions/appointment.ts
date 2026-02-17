"use server";

import { eq } from "drizzle-orm";
import { cacheTag, updateTag } from "next/cache";
import { db } from "@/db";
import { appointments, customers } from "@/db/schema";
import { generateBaseAppointmentNotes } from "@/lib/utils";
import type {
  Appointment,
  CreateAppointment,
  UpdateAppointment,
} from "@/types/appointment.types";
import type { Customer } from "@/types/customer.types";
import { sendEmail } from "./email";

export async function getAppointments() {
  "use cache";
  cacheTag("/appointments");

  try {
    const appointments = await db.query.appointments.findMany({
      with: {
        customer: true,
      },
    });

    return appointments as (Appointment & { customer: Customer })[];
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw new Error("Error fetching appointments");
  }
}

export async function getAppointmentById(id: string) {
  "use cache";
  cacheTag(`/appointments/${id}`);
  try {
    const appointment = await db.query.appointments.findFirst({
      where: (appointments, { eq }) => eq(appointments.id, id),
      with: {
        customer: true,
      },
    });

    return appointment as Appointment & { customer: Customer };
  } catch (error) {
    console.error("Error fetching appointment by ID:", error);
    throw new Error("Error fetching appointment by ID");
  }
}

export async function createAppointment(dto: CreateAppointment) {
  try {
    const url = new URL(
      `${process.env.CALENDAR_API_URL}/${process.env.CALENDAR_KEY}/events`,
    );
    url.searchParams.append("inputFormat", "markdown");

    const endDate = new Date(
      new Date(dto.startDate).getTime() + (dto.timeFrame || 30) * 60000,
    );

    let customerId: string;

    const customer = await db.query.customers.findFirst({
      where: eq(customers.phoneNumber, dto.phoneNumber),
    });

    if (!customer) {
      const [newCustomer] = await db
        .insert(customers)
        .values({
          name: dto.name,
          phoneNumber: dto.phoneNumber,
          email: dto.email,
        })
        .returning();
      customerId = newCustomer.id;
    } else {
      customerId = customer.id;
    }

    const notes = generateBaseAppointmentNotes({
      service: dto.service,
      bookingName: dto.name,
      bookingPhoneNumber: dto.phoneNumber,
      totalTime: dto.timeFrame,
      totalCost: dto.details.totalCost,
      selectedServiceNames: dto.details.serviceOptions,
      bookingEmail: dto.email,
      ...(dto.details.paymentMethod === "transfer"
        ? {
            paymentMethod: "transfer",
            city: dto.details.city,
            postCode: dto.details.postCode,
            street: dto.details.street,
            houseNumber: dto.details.houseNumber,
          }
        : { paymentMethod: "cash" }),
    });

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        subcalendar_ids: ["15143779"],
        start_dt: new Date(dto.startDate)
          .toISOString()
          .replace(/\.\d{3}Z$/, "Z"),
        end_dt: endDate.toISOString().replace(/\.\d{3}Z$/, "Z"),
        signup_enabled: false,
        comments_enabled: true,
        attachments: [],
        title: dto.service,
        notes,
        who: dto.name,
      }),
      headers: {
        "Teamup-Token": `${process.env.CALENDAR_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error creating event: ${response.statusText}`);
    }

    const event = await response.json();

    const [appointment] = await db
      .insert(appointments)
      .values({
        name: dto.service,
        startDate: new Date(dto.startDate),
        endDate: new Date(endDate),
        notes: notes,
        eventId: event.event.id,
        customerId: customerId,
        details: dto.details,
        status: dto.status,
      })
      .returning();

    await sendEmail(dto);
    updateTag("/appointments");
    return appointment as Appointment;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw new Error("Error creating appointment");
  }
}

export async function updateAppointment(id: string, dto: UpdateAppointment) {
  try {
    const [updatedAppointment] = await db
      .update(appointments)
      .set({
        name: dto.service,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.startDate
          ? new Date(
              new Date(dto.startDate).getTime() + (dto.timeFrame || 30) * 60000,
            )
          : undefined,
        details: dto.details,
        status: dto.status,
      })
      .where(eq(appointments.id, id))
      .returning();

    updateTag(`/appointments/${id}`);
    updateTag("/appointments");
    return updatedAppointment as Appointment;
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw new Error("Error updating appointment");
  }
}
