import { db } from "@/db";
import { customers } from "@/db/schema";

async function getCustomers() {
  const customers = await db.query.customers.findMany();
  return customers;
}

async function getCustomerById(id: string) {
  const customer = await db.query.customers.findFirst({
    where: (customers, { eq }) => eq(customers.id, id),
  });
  return customer;
}

async function createCustomer(name: string, phoneNumber: string) {
  const insertedCustomer = await db
    .insert(customers)
    .values({
      name: name,
      phoneNumber: phoneNumber,
    })
    .returning();
  return insertedCustomer[0];
}

export const CustomerService = {
  getCustomers,
  getCustomerById,
  createCustomer,
};
