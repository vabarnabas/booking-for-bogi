"use server";

import { CustomerService } from "@/services/customer.service";
import type { Appointment } from "@/types/appointment.types";
import type { Customer } from "@/types/customer.types";

export async function getCustomers() {
  const response = await CustomerService.getCustomers();
  return response as Customer[];
}

export async function getCustomerById(id: string) {
  const response = await CustomerService.getCustomerById(id);
  return response as Customer & { appointments: Appointment[] };
}
