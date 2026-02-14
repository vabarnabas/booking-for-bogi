import { getTopLevelServices } from "@/actions/service";
import { getServiceCategories } from "@/actions/service-category";
import NewServiceForm from "@/components/form/new-service-form";

export default async function NewServicePage() {
  const [services, serviceCategories] = await Promise.all([
    getTopLevelServices(),
    getServiceCategories(),
  ]);

  console.log("Fetched services:", services);
  console.log("Fetched service categories:", serviceCategories);

  return (
    <div className="w-full">
      <NewServiceForm
        services={services}
        serviceCategories={serviceCategories}
      />
    </div>
  );
}
