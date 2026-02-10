"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { createAppointment } from "@/actions/appointments";
import { getTimeSlots } from "@/actions/calendar";
import useSpinner from "@/hooks/useSpinner";
import { services } from "@/lib/services";
import { generateBaseAppointmentNotes, getTimeFromDate } from "@/lib/utils";
import { bookingFormSchema } from "@/types/form.types";
import type { Service } from "@/types/service.types";
import BookingDetails from "../booking-details/booking-details";
import Calendar from "../calendar/calendar";
import ServiceButton from "../service-button/service-button";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

export default function BookingForm() {
  const router = useRouter();
  const { spinnerComponent, startLoading, stopLoading } = useSpinner();
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

  const onSubmit = form.handleSubmit(async (data) => {
    startLoading();
    const toastId = toast.loading("Foglalás folyamatban...");
    try {
      const appointment = await createAppointment({
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
      router.push(`/appointments/${appointment.id}`);
    } catch {
      toast.error("Hiba történt a foglalás során.", { id: toastId });
    } finally {
      stopLoading();
    }
  });

  form.watch();

  console.log(options);

  return (
    <form id="booking-form" onSubmit={onSubmit} className="w-full max-w-lg">
      {formPage === 0 ? (
        <>
          <p className="mb-6 font-bold text-3xl">Válassz szolgáltatást!</p>
          <div className="flex flex-col">
            <div className="w-full space-y-2">
              {services
                .filter((service) => service.type === "top-level")
                .map((localService) => (
                  <ServiceButton
                    key={localService.name}
                    isSelected={localService.name === form.getValues("service")}
                    service={localService}
                    onClick={() => {
                      if (form.getValues("service") !== localService.name) {
                        console.log("Resetting options");
                        form.setValue("options", []);
                      }
                      form.setValue("service", localService.name);
                    }}
                  />
                ))}
            </div>
            {form.getValues("service") === "Manikűr" ? (
              <>
                <Separator className="my-6" />
                <p className="mb-6 font-semibold text-2xl">
                  Szolgáltatás Tipusa
                </p>
                <div className="w-full space-y-2">
                  {services
                    .filter((service) => service.type === "type")
                    .map((service) => (
                      <ServiceButton
                        key={service.name}
                        isSelected={options.some(
                          (s) =>
                            s.type === service.type && s.name === service.name,
                        )}
                        service={service}
                        onClick={() => selectServiceByCategory(service)}
                      />
                    ))}
                </div>
              </>
            ) : null}

            {form.getValues("service") === "Műkörömépítés" ? (
              <>
                <Separator className="my-6" />

                <p className="mb-6 font-semibold text-2xl">Válassz Méretet!</p>
                <div className="w-full space-y-2">
                  {services
                    .filter((service) => service.type === "size")
                    .map((service) => (
                      <ServiceButton
                        key={service.name}
                        isSelected={options.some(
                          (s) =>
                            s.type === service.type && s.name === service.name,
                        )}
                        service={service}
                        onClick={() => {
                          selectServiceByCategory(service);
                        }}
                      />
                    ))}
                </div>
              </>
            ) : null}
            {form.getValues("service") === "Műkörömépítés" ||
            form.getValues("service") === "Géllakk" ? (
              <>
                <Separator className="my-6" />
                <p className="mb-6 font-semibold text-2xl">
                  Válassz Diszitést!
                </p>
                <div className="w-full space-y-2">
                  {services
                    .filter((service) => service.type === "decoration")
                    .map((service) => (
                      <ServiceButton
                        key={service.name}
                        isSelected={options.some(
                          (s) =>
                            s.type === service.type && s.name === service.name,
                        )}
                        service={service}
                        onClick={() => selectServiceByCategory(service)}
                      />
                    ))}
                </div>
              </>
            ) : null}
            {form.getValues("service") === "Műkörömépítés" ||
            form.getValues("service") === "Géllakk" ? (
              <>
                <Separator className="my-6" />
                <p className="mb-6 font-semibold text-2xl">
                  Válassz Extra Szolgáltatást!
                </p>
                <div className="w-full space-y-2">
                  {services
                    .filter((service) => service.type === "extra")
                    .map((service) => (
                      <ServiceButton
                        key={service.name}
                        isSelected={options.some(
                          (s) =>
                            s.type === service.type && s.name === service.name,
                        )}
                        service={service}
                        onClick={() => {
                          selectServiceByCategory(service);
                        }}
                      />
                    ))}
                </div>
              </>
            ) : null}
            <Separator className="my-6" />
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
              Tovább az időpont választáshoz
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
              startLoading();

              const timeSlots = await getTimeSlots(
                new Date(date).toISOString().split("T")[0],
                totalTime,
              );

              setTimeSlots(timeSlots);
              stopLoading();
            }}
          />
          {timeSlots ? (
            <div className="">
              <Separator className="my-6" />
              <p className="mt-4 mb-2 font-bold text-2xl">Elérhető időpontok</p>
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
            <Controller
              control={form.control}
              name="privacyPolicy"
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FieldLabel htmlFor="booking-form-privacy-policy">
                    Adatvédelmi szabályzat elfogadása (kötelező)
                  </FieldLabel>
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
      {spinnerComponent}
    </form>
  );
}
