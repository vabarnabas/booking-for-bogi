import { db } from "@/db";
import { customers } from "@/db/schema";

async function getCustomers() {
  try {
    const customers = await db.query.customers.findMany();
    return customers;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw new Error("Error fetching customers");
  }
}

async function getCustomerByPhoneNumber(phoneNumber: string) {
  try {
    const customer = await db.query.customers.findFirst({
      where: (customers, { eq }) => eq(customers.phoneNumber, phoneNumber),
    });
    return customer;
  } catch (error) {
    console.error("Error fetching customer by phone number:", error);
    throw new Error("Error fetching customer by phone number");
  }
}

async function getCustomerById(id: string) {
  try {
    const customer = await db.query.customers.findFirst({
      where: (customers, { eq }) => eq(customers.id, id),
    });
    return customer;
  } catch (error) {
    console.error("Error fetching customer by ID:", error);
    throw new Error("Error fetching customer by ID");
  }
}

async function createCustomer(
  name: string,
  phoneNumber: string,
  email?: string,
) {
  try {
    const insertedCustomer = await db
      .insert(customers)
      .values({
        name: name,
        phoneNumber: phoneNumber,
        email: email,
      })
      .returning();
    return insertedCustomer[0];
  } catch (error) {
    console.error("Error creating customer:", error);
    throw new Error("Error creating customer");
  }
}

export const CustomerService = {
  getCustomers,
  getCustomerById,
  getCustomerByPhoneNumber,
  createCustomer,
};
