import { db } from "@/db";

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

export const CustomerService = {
  getCustomers,
  getCustomerById,
};
