import { getCustomerById } from "@/actions/customers";

export const dynamic = "force-dynamic";

export default async function CustomerById({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    return <div>Ez a vendég nem található</div>;
  }

  return (
    <div>
      <p className="font-bold text-3xl">{customer.name}</p>
    </div>
  );
}
