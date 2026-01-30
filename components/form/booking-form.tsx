"use client";

import Image from "next/image";
import React from "react";
import { toast } from "sonner";
import { cn, formatDateTime, getTimeFromDate } from "@/lib/utils";
import Calendar from "../calendar/calendar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Service {
  name: string;
  category: "top-level" | "type" | "size" | "decoration" | "extra";
  price: number | null;
  timeFrame: number | null;
  image?: string;
  optionCount?: number;
}

const services: Service[] = [
  {
    name: "Manikűr",
    category: "top-level",
    price: null,
    timeFrame: null,
    image: "/photos/manicure.jpg",
    optionCount: 1,
  },
  {
    name: "Műkörömépítés",
    category: "top-level",
    price: null,
    timeFrame: null,
    optionCount: 3,
  },
  {
    name: "Férfi Manikűr",
    category: "type",
    price: 4000,
    timeFrame: 30,
  },
  {
    name: "Géllakk",
    category: "top-level",
    price: 7000,
    timeFrame: 60,
    optionCount: 2,
  },
  {
    name: "Női Manikűr",
    category: "type",
    price: 4000,
    timeFrame: 30,
  },
  {
    name: "Japán Manikűr",
    category: "type",
    price: 5500,
    timeFrame: 45,
  },
  {
    name: "S Méret",
    category: "size",
    price: 8000,
    timeFrame: 90,
  },
  {
    name: "S/M Méret",
    category: "size",
    price: 8500,
    timeFrame: 90,
  },
  {
    name: "M Méret",
    category: "size",
    price: 9000,
    timeFrame: 90,
  },
  {
    name: "M/L Méret",
    category: "size",
    price: 9500,
    timeFrame: 120,
  },
  {
    name: "L Méret",
    category: "size",
    price: 10000,
    timeFrame: 120,
  },
  {
    name: "XL Méret",
    category: "size",
    price: 11000,
    timeFrame: 150,
  },
  {
    name: "Beépített Francia",
    category: "decoration",
    price: 2500,
    timeFrame: 40,
  },
  {
    name: "Francia Festés",
    category: "decoration",
    price: 1000,
    timeFrame: 20,
  },
  {
    name: "Babyboomer",
    category: "decoration",
    price: 1000,
    timeFrame: 10,
  },
  {
    name: "Kis Díszítés",
    category: "decoration",
    price: 1000,
    timeFrame: 15,
  },
  {
    name: "Közepes Díszítés",
    category: "decoration",
    price: 1500,
    timeFrame: 25,
  },
  {
    name: "Nagy Díszítés",
    category: "decoration",
    price: 2500,
    timeFrame: 35,
  },
  {
    name: "Nem kérek extra díszítést",
    category: "decoration",
    price: 0,
    timeFrame: 0,
  },
  {
    name: "Van Más Munkája a Körmömön",
    category: "extra",
    price: 3000,
    timeFrame: 30,
  },
  {
    name: "Nincs Más Munkája a Körmömön",
    category: "extra",
    price: 0,
    timeFrame: 0,
  },
];

export default function BookingForm() {
  const [selectedTopLevelService, setSelectedTopLevelService] = React.useState<
    string | null
  >(null);
  const [selectedServices, setSelectedServices] = React.useState<Service[]>([]);

  const selectServiceByCategory = (service: Service) => {
    if (selectedServices.find((s) => s.category === service.category)) {
      setSelectedServices((prev) =>
        prev.map((s) => (s.category === service.category ? service : s)),
      );
    } else {
      setSelectedServices((prev) => [...prev, service]);
    }
  };
  const [timeSlots, setTimeSlots] = React.useState<
    { start: string; end: string }[]
  >([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState<{
    start: string;
    end: string;
  } | null>(null);

  const [formPage, setFormPage] = React.useState(0);

  const [name, setName] = React.useState("");

  const totalCost = React.useMemo(() => {
    return (
      (services.find((service) => service.name === selectedTopLevelService)
        ?.price || 0) +
      selectedServices.reduce((acc, service) => {
        return acc + (service.price || 0);
      }, 0)
    );
  }, [selectedServices, selectedTopLevelService]);

  const totalTime = React.useMemo(() => {
    return (
      (services.find((service) => service.name === selectedTopLevelService)
        ?.timeFrame || 0) +
      selectedServices.reduce((acc, service) => {
        return acc + (service.timeFrame || 0);
      }, 0)
    );
  }, [selectedServices, selectedTopLevelService]);

  return (
    <form action="" className="w-full max-w-md">
      {formPage === 0 ? (
        <>
          <p className="mb-4 font-bold text-3xl">Válassz szolgáltatást!</p>
          <div className="flex flex-col space-y-4">
            {services
              .filter((service) => service.category === "top-level")
              .map((service) => (
                <button
                  key={service.name}
                  type="button"
                  onClick={() => {
                    if (service.name !== selectedTopLevelService) {
                      setSelectedServices([]);
                    }
                    setSelectedTopLevelService(service.name);
                  }}
                  className={cn(
                    "flex items-center gap-x-4 rounded-md border p-3",
                    selectedTopLevelService === service.name
                      ? "border-primary bg-primary/10"
                      : "bg-secondary/30",
                  )}
                >
                  {service.image ? (
                    <div className="relative aspect-scare size-16 shrink-0 overflow-clip rounded">
                      <Image
                        src={service.image}
                        alt={service.name}
                        objectFit="cover"
                        fill
                      />
                    </div>
                  ) : (
                    <div className="aspect-square size-16 rounded bg-primary"></div>
                  )}
                  <div className="flex w-full flex-col items-start">
                    <p className="font-semibold text-xl">{service.name}</p>
                    {service.price ? (
                      <p className="text-lg text-muted-foreground">
                        {Intl.NumberFormat("hu-HU", {
                          style: "currency",
                          currency: "HUF",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(service.price as number)}
                        {service.timeFrame
                          ? ` - ${service.timeFrame} perc`
                          : ""}
                      </p>
                    ) : (
                      <p className=""></p>
                    )}
                  </div>
                </button>
              ))}
            {selectedTopLevelService === "Manikűr" ? (
              <>
                <p className="font-semibold text-2xl">Szolgáltatás Tipusa</p>
                {services
                  .filter((service) => service.category === "type")
                  .map((service) => (
                    <button
                      key={service.name}
                      type="button"
                      onClick={() => selectServiceByCategory(service)}
                      className={cn(
                        "flex items-center gap-x-4 rounded-md border bg-secondary/30 p-3",
                        selectedServices.find(
                          (s) =>
                            s.category === "type" && s.name === service.name,
                        )
                          ? "border-primary bg-primary/10"
                          : "",
                      )}
                    >
                      <div className="aspect-square size-16 rounded bg-primary"></div>
                      <div className="flex w-full flex-col items-start">
                        <p className="font-semibold text-xl">{service.name}</p>
                        <p className="text-lg text-muted-foreground">
                          {Intl.NumberFormat("hu-HU", {
                            style: "currency",
                            currency: "HUF",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(service.price as number)}
                          {service.timeFrame
                            ? ` - ${service.timeFrame} perc`
                            : ""}
                        </p>
                      </div>
                    </button>
                  ))}
              </>
            ) : null}

            {selectedTopLevelService === "Műkörömépítés" ? (
              <>
                <p className="font-semibold text-2xl">Válassz Méretet!</p>
                {services
                  .filter((service) => service.category === "size")
                  .map((service) => (
                    <button
                      key={service.name}
                      type="button"
                      onClick={() => selectServiceByCategory(service)}
                      className={cn(
                        "flex items-center gap-x-4 rounded-md border bg-secondary/30 p-3",
                        selectedServices.find(
                          (s) =>
                            s.category === "size" && s.name === service.name,
                        )
                          ? "border-primary bg-primary/10"
                          : "",
                      )}
                    >
                      <div className="aspect-square size-16 rounded bg-primary"></div>
                      <div className="flex w-full flex-col items-start">
                        <p className="font-semibold text-xl">{service.name}</p>
                        <p className="text-lg text-muted-foreground">
                          {Intl.NumberFormat("hu-HU", {
                            style: "currency",
                            currency: "HUF",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(service.price as number)}
                          {service.timeFrame
                            ? ` - ${service.timeFrame} perc`
                            : ""}
                        </p>
                      </div>
                    </button>
                  ))}
              </>
            ) : null}
            {selectedTopLevelService === "Műkörömépítés" ||
            selectedTopLevelService === "Géllakk" ? (
              <>
                <p className="font-semibold text-2xl">Válassz Diszitést!</p>
                {services
                  .filter((service) => service.category === "decoration")
                  .map((service) => (
                    <button
                      key={service.name}
                      type="button"
                      onClick={() => selectServiceByCategory(service)}
                      className={cn(
                        "flex items-center gap-x-4 rounded-md border bg-secondary/30 p-3",
                        selectedServices.find(
                          (s) =>
                            s.category === "decoration" &&
                            s.name === service.name,
                        )
                          ? "border-primary bg-primary/10"
                          : "",
                      )}
                    >
                      <div className="aspect-square size-16 rounded bg-primary"></div>
                      <div className="flex w-full flex-col items-start">
                        <p className="font-semibold text-xl">{service.name}</p>
                        <p className="text-lg text-muted-foreground">
                          {Intl.NumberFormat("hu-HU", {
                            style: "currency",
                            currency: "HUF",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(service.price as number)}
                          {service.timeFrame
                            ? ` - ${service.timeFrame} perc`
                            : ""}
                        </p>
                      </div>
                    </button>
                  ))}
              </>
            ) : null}
            {selectedTopLevelService === "Műkörömépítés" ||
            selectedTopLevelService === "Géllakk" ? (
              <>
                <p className="font-semibold text-2xl">
                  Válassz Extra Szolgáltatást!
                </p>
                {services
                  .filter((service) => service.category === "extra")
                  .map((service) => (
                    <button
                      key={service.name}
                      type="button"
                      onClick={() => selectServiceByCategory(service)}
                      className={cn(
                        "flex items-center gap-x-4 rounded-md border bg-secondary/30 p-3",
                        selectedServices.find(
                          (s) =>
                            s.category === "extra" && s.name === service.name,
                        )
                          ? "border-primary bg-primary/10"
                          : "",
                      )}
                    >
                      <div className="aspect-square size-16 rounded bg-primary"></div>
                      <div className="flex w-full flex-col items-start">
                        <p className="font-semibold text-xl">{service.name}</p>
                        <p className="text-lg text-muted-foreground">
                          {Intl.NumberFormat("hu-HU", {
                            style: "currency",
                            currency: "HUF",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(service.price as number)}
                          {service.timeFrame
                            ? ` - ${service.timeFrame} perc`
                            : ""}
                        </p>
                      </div>
                    </button>
                  ))}
              </>
            ) : null}
            <p className="text-lg">
              Teljes Ár:{" "}
              <span className="font-semibold">
                {Intl.NumberFormat("hu-HU", {
                  style: "currency",
                  currency: "HUF",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(totalCost)}
              </span>
            </p>
            <p className="text-lg">
              Teljes Idő:{" "}
              <span className="font-semibold">{totalTime} perc</span>
            </p>

            <Button
              type="button"
              size={"lg"}
              disabled={
                !(
                  selectedTopLevelService &&
                  services.find(
                    (s) =>
                      s.category === "top-level" &&
                      s.name === selectedTopLevelService,
                  )?.optionCount &&
                  services.find(
                    (s) =>
                      s.category === "top-level" &&
                      s.name === selectedTopLevelService,
                  )?.optionCount === selectedServices.length
                )
              }
              onClick={() => setFormPage((prev) => prev + 1)}
            >
              Tovább a naptárhoz
            </Button>
          </div>
        </>
      ) : null}
      {formPage === 1 ? (
        <div className="">
          <div className="mb-6 space-y-1 rounded-md bg-secondary p-3">
            <p className="mb-2 font-bold text-xl">Foglalás Adatai</p>

            <p className="">{`${selectedTopLevelService} (${selectedServices.map((service) => service.name).join(", ")})`}</p>
            <div className="grid grid-cols-2 content-center gap-2">
              <p className="font-semibold">{totalTime} perc</p>
              <p className="font-semibold">
                {Intl.NumberFormat("hu-HU", {
                  style: "currency",
                  currency: "HUF",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(totalCost)}
              </p>
            </div>
          </div>
          <Calendar
            onDaySelect={async (date) => {
              console.log("date", date);
              const url = new URL(
                "/api/calendar/timeslots",
                window.location.origin,
              );

              url.searchParams.append(
                "date",
                new Date(date).toISOString().split("T")[0],
              );
              url.searchParams.append("timeFrame", totalTime.toString());

              const response = await fetch(url);

              if (!response.ok) {
                throw new Error("Failed to fetch time slots");
              }

              const timeSlots = await response.json();

              setTimeSlots(timeSlots);
            }}
          />
          {timeSlots ? (
            <div className="">
              <p className="mt-6 mb-2 font-bold text-2xl">Elérhető időpontok</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    type="button"
                    onClick={() => {
                      setSelectedTimeSlot(slot);
                      setFormPage(2);
                    }}
                    key={slot.start}
                  >
                    {getTimeFromDate(new Date(slot.start))}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
      {formPage === 2 ? (
        <div className="">
          <div className="mb-6 space-y-1 rounded-md bg-secondary p-3">
            <p className="mb-2 font-bold text-xl">Foglalás Adatai</p>
            <p className="">{`${selectedTopLevelService} (${selectedServices.map((service) => service.name).join(", ")})`}</p>
            <div className="">
              <div className="grid grid-cols-2">
                <p className="font-semibold">{totalTime} perc</p>
                <p className="font-semibold">
                  {Intl.NumberFormat("hu-HU", {
                    style: "currency",
                    currency: "HUF",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(totalCost)}
                </p>
              </div>
            </div>
            <p className="mt-4 rounded bg-primary/80 p-2 font-bold">
              {formatDateTime(new Date(selectedTimeSlot?.start || ""))}
              {" - "}
              {getTimeFromDate(
                new Date(
                  new Date(selectedTimeSlot?.start || "").getTime() +
                    totalTime * 60000,
                ),
              )}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Név</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Button
            disabled={!name}
            onClick={async () => {
              const toastId = toast.loading("Foglalás folyamatban...");
              try {
                await fetch("/api/calendar/events", {
                  method: "POST",
                  body: JSON.stringify({
                    service: selectedTopLevelService,
                    name: name,
                    startDate: selectedTimeSlot?.start,
                    description: `
**Kiválasztott szolgáltatás:** ${selectedTopLevelService}\n
**Kiválasztott opciók:**
${selectedServices.map((s) => `- ${s.name}`).join("\n")}

**Teljes ár:** ${Intl.NumberFormat("hu-HU", {
                      style: "currency",
                      currency: "HUF",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(totalCost)}
                
                
**Teljes idő:** ${totalTime} perc`,
                    timeFrame: totalTime,
                  }),
                });
                toast.success("Sikeres foglalás!", { id: toastId });
              } catch {
                toast.error("Hiba történt a foglalás során.", { id: toastId });
              }
            }}
            size="lg"
            className="mt-4 w-full"
          >
            Foglalás
          </Button>
        </div>
      ) : null}
    </form>
  );
}
