"use server";

import { AppointmentService } from "@/services/appointment.service";
import type { Appointment, CreateAppointment } from "@/types/appointment.types";
import type { Customer } from "@/types/customer.types";

export async function getAppointments(): Promise<
  (Appointment & { customer: Customer })[]
> {
  const response = await AppointmentService.getAppointments();
  return response as (Appointment & { customer: Customer })[];
}

export async function getAppointmentById(
  id: string,
): Promise<Appointment & { customer: Customer }> {
  const response = await AppointmentService.getAppointmentById(id);
  return response as Appointment & { customer: Customer };
}

export async function createAppointment(data: CreateAppointment) {
  const response = await fetch(`${process.env.APP_URL}/api/appointments`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error creating appointment: ${response.statusText}`);
  }

  const appointment = await response.json();
  return appointment as Appointment & { customer: Customer };
}
