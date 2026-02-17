import { getTopLevelServices } from "@/actions/service";
import { getServiceCategories } from "@/actions/service-category";
import NewServiceForm from "@/components/form/new-service-form";

export default async function NewServicePage() {
  const [services, serviceCategories] = await Promise.all([
    getTopLevelServices(),
    getServiceCategories(),
  ]);

  return (
    <div className="w-full">
      <NewServiceForm
        services={services}
        serviceCategories={serviceCategories}
      />
    </div>
  );
}
