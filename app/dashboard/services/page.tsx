import { Database } from "lucide-react";
import { getServices } from "@/actions/service";
import NewServiceButton from "@/components/buttons/new-service-button";
import EmptyState from "@/components/empty-state/empty-state";

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="flex w-full grow flex-col">
      <div className="mb-6 flex w-full items-center justify-between">
        <p className="font-bold text-3xl">Szolgáltatások</p>
        <NewServiceButton />
      </div>
      {services.length === 0 ? (
        <EmptyState
          icon={Database}
          title="Nincsenek Szolgáltatások"
          subtitle="Úgy néz ki nincsenek még elérhető szolgáltatások. Kattints a fenti gombra egy új szolgáltatás létrehozásához."
        />
      ) : null}
    </div>
  );
}
