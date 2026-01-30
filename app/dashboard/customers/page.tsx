import { getCustomers } from "@/actions/customers";

export default async function Customers() {
  const customers = await getCustomers();

  return (
    <div className="w-full">
      <p className="mb-4 font-bold text-3xl">Vendégek</p>
      <div className="space-y-4">
        {customers.map((customer) => (
          <div key={customer.id} className="rounded-md border p-4">
            <p className="mb-2 font-semibold text-xl">{customer.name}</p>
            <p className="">
              Email: <span>{customer.email || "-"}</span>
            </p>
            <p className="">
              Telefonszám: <span>{customer.phoneNumber || "-"}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
