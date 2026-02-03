"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { createAppointment } from "@/actions/appointments";
import {
  cn,
  formatCurrency,
  generateBaseAppointmentNotes,
  getTimeFromDate,
} from "@/lib/utils";
import { bookingFormSchema } from "@/types/form.types";
import type { Service } from "@/types/service.types";
import BookingDetails from "../booking-details/booking-details";
import Calendar from "../calendar/calendar";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

const services: Service[] = [
  {
    name: "Manikűr",
    type: "top-level",
    price: null,
    duration: null,
    image: "/photos/manicure.jpg",
    optionCount: 1,
  },
  {
    name: "Műkörömépítés",
    type: "top-level",
    price: null,
    duration: null,
    optionCount: 3,
  },
  {
    name: "Férfi Manikűr",
    type: "type",
    price: 4000,
    duration: 30,
  },
  {
    name: "Géllakk",
    type: "top-level",
    price: 7000,
    duration: 60,
    optionCount: 2,
  },
  {
    name: "Női Manikűr",
    type: "type",
    price: 4000,
    duration: 30,
  },
  {
    name: "Japán Manikűr",
    type: "type",
    price: 5500,
    duration: 45,
  },
  {
    name: "S Méret",
    type: "size",
    price: 8000,
    duration: 90,
  },
  {
    name: "S/M Méret",
    type: "size",
    price: 8500,
    duration: 90,
  },
  {
    name: "M Méret",
    type: "size",
    price: 9000,
    duration: 90,
  },
  {
    name: "M/L Méret",
    type: "size",
    price: 9500,
    duration: 120,
  },
  {
    name: "L Méret",
    type: "size",
    price: 10000,
    duration: 120,
  },
  {
    name: "XL Méret",
    type: "size",
    price: 11000,
    duration: 150,
  },
  {
    name: "Beépített Francia",
    type: "decoration",
    price: 2500,
    duration: 40,
  },
  {
    name: "Francia Festés",
    type: "decoration",
    price: 1000,
    duration: 20,
  },
  {
    name: "Babyboomer",
    type: "decoration",
    price: 1000,
    duration: 10,
  },
  {
    name: "Kis Díszítés",
    type: "decoration",
    price: 1000,
    duration: 15,
  },
  {
    name: "Közepes Díszítés",
    type: "decoration",
    price: 1500,
    duration: 25,
  },
  {
    name: "Nagy Díszítés",
    type: "decoration",
    price: 2500,
    duration: 35,
  },
  {
    name: "Nem kérek extra díszítést",
    type: "decoration",
    price: 0,
    duration: 0,
  },
  {
    name: "Van Más Munkája a Körmömön",
    type: "extra",
    price: 3000,
    duration: 30,
  },
  {
    name: "Nincs Más Munkája a Körmömön",
    type: "extra",
    price: 0,
    duration: 0,
  },
];

export default function BookingForm() {
  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      options: [],
    },
  });

  const service = form.watch("service");
  const options = form.watch("options");

  const selectServiceByCategory = (service: Service) => {
    const filtered = options.filter((s) => s.type !== service.type);
    form.setValue("options", [...filtered, service]);
  };
  const [timeSlots, setTimeSlots] = React.useState<
    { start: string; end: string }[]
  >([]);

  const [formPage, setFormPage] = React.useState(0);

  const totalCost = React.useMemo(() => {
    return (
      (services.find((s) => s.name === service)?.price || 0) +
      options.reduce((acc, service) => {
        return acc + (service.price || 0);
      }, 0)
    );
  }, [options, service]);

  const totalTime = React.useMemo(() => {
    return (
      (services.find((s) => s.name === service)?.duration || 0) +
      0 +
      options.reduce((acc, service) => {
        return acc + (service.duration || 0);
      }, 0)
    );
  }, [options, service]);

  const onSubmit = async (data: z.infer<typeof bookingFormSchema>) => {
    console.log("Submitting booking form with data:", data);
    const toastId = toast.loading("Foglalás folyamatban...");
    try {
      await createAppointment({
        name: data.name,
        phoneNumber: data.phoneNumber,
        email: data.email,
        service: data.service,
        notes: generateBaseAppointmentNotes(
          data.service,
          data.options.map((s) => s.name),
          totalCost,
          totalTime,
        ),
        startDate: data.timeSlot.start,
        timeFrame: totalTime,
      });
      toast.success("Sikeres foglalás!", { id: toastId });
    } catch {
      toast.error("Hiba történt a foglalás során.", { id: toastId });
    }
  };

  form.watch();

  return (
    <form
      id="booking-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full max-w-md"
    >
      {formPage === 0 ? (
        <>
          <p className="mb-6 font-bold text-3xl">Válassz szolgáltatást!</p>
          <div className="flex flex-col space-y-4">
            {services
              .filter((service) => service.type === "top-level")
              .map((service) => (
                <button
                  key={service.name}
                  type="button"
                  onClick={() => {
                    if (service.name !== form.getValues("service")) {
                      form.setValue("options", []);
                    }
                    form.setValue("service", service.name);
                  }}
                  className={cn(
                    "flex items-center gap-x-4 rounded-md border p-3",
                    form.getValues("service") === service.name
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
                        {formatCurrency(service.price as number)}
                        {service.duration ? ` - ${service.duration} perc` : ""}
                      </p>
                    ) : (
                      <p className=""></p>
                    )}
                  </div>
                </button>
              ))}
            {form.getValues("service") === "Manikűr" ? (
              <>
                <p className="font-semibold text-2xl">Szolgáltatás Tipusa</p>
                {services
                  .filter((service) => service.type === "type")
                  .map((service) => (
                    <button
                      key={service.name}
                      type="button"
                      onClick={() => selectServiceByCategory(service)}
                      className={cn(
                        "flex items-center gap-x-4 rounded-md border bg-secondary/30 p-3",
                        options.find(
                          (s) => s.type === "type" && s.name === service.name,
                        )
                          ? "border-primary bg-primary/10"
                          : "",
                      )}
                    >
                      <div className="aspect-square size-16 rounded bg-primary"></div>
                      <div className="flex w-full flex-col items-start">
                        <p className="font-semibold text-xl">{service.name}</p>
                        <p className="text-lg text-muted-foreground">
                          {formatCurrency(service.price as number)}
                          {service.duration
                            ? ` - ${service.duration} perc`
                            : ""}
                        </p>
                      </div>
                    </button>
                  ))}
              </>
            ) : null}

            {form.getValues("service") === "Műkörömépítés" ? (
              <>
                <p className="font-semibold text-2xl">Válassz Méretet!</p>
                {services
                  .filter((service) => service.type === "size")
                  .map((service) => (
                    <button
                      key={service.name}
                      type="button"
                      onClick={() => selectServiceByCategory(service)}
                      className={cn(
                        "flex items-center gap-x-4 rounded-md border bg-secondary/30 p-3",
                        options.find(
                          (s) => s.type === "size" && s.name === service.name,
                        )
                          ? "border-primary bg-primary/10"
                          : "",
                      )}
                    >
                      <div className="aspect-square size-16 rounded bg-primary"></div>
                      <div className="flex w-full flex-col items-start">
                        <p className="font-semibold text-xl">{service.name}</p>
                        <p className="text-lg text-muted-foreground">
                          {formatCurrency(service.price as number)}
                          {service.duration
                            ? ` - ${service.duration} perc`
                            : ""}
                        </p>
                      </div>
                    </button>
                  ))}
              </>
            ) : null}
            {form.getValues("service") === "Műkörömépítés" ||
            form.getValues("service") === "Géllakk" ? (
              <>
                <p className="font-semibold text-2xl">Válassz Diszitést!</p>
                {services
                  .filter((service) => service.type === "decoration")
                  .map((service) => (
                    <button
                      key={service.name}
                      type="button"
                      onClick={() => selectServiceByCategory(service)}
                      className={cn(
                        "flex items-center gap-x-4 rounded-md border bg-secondary/30 p-3",
                        options.find(
                          (s) =>
                            s.type === "decoration" && s.name === service.name,
                        )
                          ? "border-primary bg-primary/10"
                          : "",
                      )}
                    >
                      <div className="aspect-square size-16 rounded bg-primary"></div>
                      <div className="flex w-full flex-col items-start">
                        <p className="font-semibold text-xl">{service.name}</p>
                        <p className="text-lg text-muted-foreground">
                          {formatCurrency(service.price as number)}
                          {service.duration
                            ? ` - ${service.duration} perc`
                            : ""}
                        </p>
                      </div>
                    </button>
                  ))}
              </>
            ) : null}
            {form.getValues("service") === "Műkörömépítés" ||
            form.getValues("service") === "Géllakk" ? (
              <>
                <p className="font-semibold text-2xl">
                  Válassz Extra Szolgáltatást!
                </p>
                {services
                  .filter((service) => service.type === "extra")
                  .map((service) => (
                    <button
                      key={service.name}
                      type="button"
                      onClick={() => selectServiceByCategory(service)}
                      className={cn(
                        "flex items-center gap-x-4 rounded-md border bg-secondary/30 p-3",
                        options.find(
                          (s) => s.type === "extra" && s.name === service.name,
                        )
                          ? "border-primary bg-primary/10"
                          : "",
                      )}
                    >
                      <div className="aspect-square size-16 rounded bg-primary"></div>
                      <div className="flex w-full flex-col items-start">
                        <p className="font-semibold text-xl">{service.name}</p>
                        <p className="text-lg text-muted-foreground">
                          {formatCurrency(service.price as number)}
                          {service.duration
                            ? ` - ${service.duration} perc`
                            : ""}
                        </p>
                      </div>
                    </button>
                  ))}
              </>
            ) : null}
            <div className="mb-4">
              <BookingDetails
                formPage={formPage}
                options={options}
                service={service}
                totalTime={totalTime}
                totalCost={totalCost}
              />
            </div>
            <Button
              type="button"
              size={"lg"}
              disabled={
                !(
                  service &&
                  services.find(
                    (s) => s.type === "top-level" && s.name === service,
                  )?.optionCount &&
                  services.find(
                    (s) => s.type === "top-level" && s.name === service,
                  )?.optionCount === options.length
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
          <div className="mb-2">
            <Button
              onClick={() => setFormPage((prev) => prev - 1)}
              variant="link"
            >
              <ArrowLeft />
              Vissza
            </Button>
          </div>
          <div className="mb-6">
            <BookingDetails
              formPage={formPage}
              options={options}
              service={service}
              totalTime={totalTime}
              totalCost={totalCost}
              startDate={form.getValues("timeSlot")?.start || undefined}
            />
          </div>
          <p className="mb-4 font-bold text-3xl">Válassz időpontot!</p>
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
                      form.setValue("timeSlot", slot);
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
          <div className="mb-2">
            <Button
              onClick={() => {
                setFormPage((prev) => prev - 1);
                setTimeSlots([]);
              }}
              variant="link"
            >
              <ArrowLeft />
              Vissza
            </Button>
          </div>
          <div className="mb-4">
            <BookingDetails
              formPage={formPage}
              options={options}
              service={service}
              totalTime={totalTime}
              totalCost={totalCost}
              startDate={form.getValues("timeSlot")?.start || undefined}
            />
          </div>
          <p className="mb-4 font-semibold text-2xl">Személyes Adatok</p>
          <div className="space-y-4">
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="booking-form-name">
                    Név (kötelező)
                  </FieldLabel>
                  <Input
                    id="booking-form-name"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="phoneNumber"
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="booking-form-phone-number">
                    Telefonszám (kötelező)
                  </FieldLabel>
                  <Input
                    id="booking-form-phone-number"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="booking-form-email">Email</FieldLabel>
                  <Input
                    id="booking-form-email"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <Button
            disabled={!form.getValues("name") || !form.getValues("phoneNumber")}
            size="lg"
            className="mt-4 w-full"
            type="submit"
            form="booking-form"
          >
            Foglalás
          </Button>
        </div>
      ) : null}
    </form>
  );
}
