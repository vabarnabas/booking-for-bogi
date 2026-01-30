"use server";

import { AppointmentService } from "@/services/appointment.service";
import type { Appointment } from "@/types/appointment.types";
import type { Customer } from "@/types/customer.types";

export async function getAppointments(): Promise<
  (Appointment & { customer: Customer })[]
> {
  const response = await AppointmentService.getAppointments();
  return response as (Appointment & { customer: Customer })[];
}
