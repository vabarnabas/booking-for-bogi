import { Database } from "lucide-react";
import { getTopLevelServices } from "@/actions/service";
import NewServiceButton from "@/components/buttons/new-service-button";
import EmptyState from "@/components/empty-state/empty-state";
import { Separator } from "@/components/ui/separator";
import { serviceTypeTranslations } from "@/lib/service-type-translations";
import { formatCurrency } from "@/lib/utils";

export default async function ServicesPage() {
  const services = await getTopLevelServices();

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
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="overflow-clip rounded-md border">
              <div className="border-b bg-secondary p-4">
                <p className="font-semibold text-2xl">{service.name}</p>
              </div>
              <div className="p-4">
                <p className="">
                  {service.price
                    ? formatCurrency(service.price as number)
                    : "Nincs ár megadva"}
                </p>
                <p className="">
                  {service.duration
                    ? `${service.duration} perc`
                    : "Nincs időtartam megadva"}
                </p>
                {service.children.length > 0 ? (
                  <>
                    <Separator className="my-4" />
                    <p className="font-semibold text-xl">
                      Hozzátartozó Szolgáltatások
                    </p>
                    <div className="mt-4 space-y-2">
                      {Array.from(
                        new Set(
                          service.children.map(({ child }) => child.type),
                        ),
                      ).map((uniqueType) => (
                        <div key={uniqueType} className="rounded-md border p-3">
                          <p className="font-semibold text-lg">
                            {serviceTypeTranslations[uniqueType]}
                          </p>
                          <Separator className="my-3" />
                          <div className="mt-2 space-y-1">
                            {service.children
                              .filter(({ child }) => child.type === uniqueType)
                              .map(({ child }) => (
                                <div
                                  key={child.id}
                                  className="flex flex-col justify-between gap-2 md:flex-row md:items-center"
                                >
                                  <div className="">
                                    <p className="font-medium text-lg">
                                      {child.name}
                                    </p>
                                  </div>
                                  <p className="text-muted-foreground">
                                    {child.price
                                      ? formatCurrency(child.price as number)
                                      : null}
                                    {child.price && child.duration ? " - " : ""}
                                    {child.duration
                                      ? `${child.duration} perc`
                                      : null}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
