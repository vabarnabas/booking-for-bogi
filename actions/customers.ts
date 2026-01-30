"use server";

import { CustomerService } from "@/services/customer.service";
import type { Customer } from "@/types/customer.types";

export async function getCustomers(): Promise<Customer[]> {
  const response = await CustomerService.getCustomers();
  return response as Customer[];
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const response = await CustomerService.getCustomerById(id);
  return response as Customer | null;
}
