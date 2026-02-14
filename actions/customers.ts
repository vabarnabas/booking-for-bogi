"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { customers } from "@/db/schema";
import type { Appointment } from "@/types/appointment.types";
import type { Customer } from "@/types/customer.types";

export async function getCustomers() {
  try {
    const customers = await db.query.customers.findMany();
    return customers as Customer[];
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw new Error("Error fetching customers");
  }
}

export async function getCustomerById(id: string) {
  try {
    const customer = await db.query.customers.findFirst({
      where: eq(customers.id, id),
      with: {
        appointments: true,
      },
    });

    return customer as Customer & { appointments: Appointment[] };
  } catch (error) {
    console.error("Error fetching customer by ID:", error);
    throw new Error("Error fetching customer by ID");
  }
}
