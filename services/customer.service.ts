import { db } from "@/db";
import { customers } from "@/db/schema";

async function getCustomers() {
  const customers = await db.query.customers.findMany();
  return customers;
}

async function getCustomerByPhoneNumber(phoneNumber: string) {
  const customer = await db.query.customers.findFirst({
    where: (customers, { eq }) => eq(customers.phoneNumber, phoneNumber),
  });
  return customer;
}

async function getCustomerById(id: string) {
  const customer = await db.query.customers.findFirst({
    where: (customers, { eq }) => eq(customers.id, id),
  });
  return customer;
}

async function createCustomer(
  name: string,
  phoneNumber: string,
  email?: string,
) {
  const insertedCustomer = await db
    .insert(customers)
    .values({
      name: name,
      phoneNumber: phoneNumber,
      email: email,
    })
    .returning();
  return insertedCustomer[0];
}

export const CustomerService = {
  getCustomers,
  getCustomerById,
  getCustomerByPhoneNumber,
  createCustomer,
};
