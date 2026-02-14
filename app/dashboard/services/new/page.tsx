import { getTopLevelServices } from "@/actions/service";
import NewServiceForm from "@/components/form/new-service-form";

export default async function NewServicePage() {
  const services = await getTopLevelServices();

  return (
    <div className="w-full">
      <NewServiceForm services={services} />
    </div>
  );
}
