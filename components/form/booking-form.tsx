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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
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
      privacyPolicy: false,
      paymentMethod: "cash",
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
        phoneNumber: `+36${data.phoneNumber}`,
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
                    Név<span className="text-red-500">*</span>
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
                    Telefonszám<span className="text-red-500">*</span>
                  </FieldLabel>

                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>+36</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      id="booking-form-phone-number"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                  </InputGroup>
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
              name="paymentMethod"
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="booking-form-payment-method">
                    Fizetési mód
                  </FieldLabel>
                  <Select
                    id="booking-form-payment-method"
                    items={[
                      { label: "Készpénz", value: "cash" },
                      { label: "Átutalás", value: "transfer" },
                    ]}
                    {...field}
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue="cash"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="cash">Készpénz</SelectItem>
                        <SelectItem value="transfer">Átutalás</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {form.getValues("paymentMethod") === "transfer" ? (
              <>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <p className="mb-4 font-semibold text-xl">
                    Számlázási Adatok
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <Controller
                      control={form.control}
                      name="postCode"
                      render={({ field, fieldState }) => (
                        <Field aria-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="booking-form-postal-code">
                            Irányítószám<span className="text-red-500">*</span>
                          </FieldLabel>
                          <Input
                            id="booking-form-postal-code"
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
                      name="city"
                      render={({ field, fieldState }) => (
                        <Field aria-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="booking-form-city">
                            Város<span className="text-red-500">*</span>
                          </FieldLabel>
                          <Input
                            id="booking-form-city"
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
                      name="street"
                      render={({ field, fieldState }) => (
                        <Field aria-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="booking-form-street">
                            Utca<span className="text-red-500">*</span>
                          </FieldLabel>
                          <Input
                            id="booking-form-street"
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
                      name="houseNumber"
                      render={({ field, fieldState }) => (
                        <Field aria-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="booking-form-house-number">
                            Házszám<span className="text-red-500">*</span>
                          </FieldLabel>
                          <Input
                            id="booking-form-house-number"
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
                </div>
                <Separator className="my-6" />
              </>
            ) : null}
            <Controller
              control={form.control}
              name="privacyPolicy"
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <div className="flex gap-x-1.5">
                    <Checkbox
                      id="booking-form-privacy-policy"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FieldLabel htmlFor="booking-form-privacy-policy">
                      Elfogadom az adatvédelmi szabályzatot.
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                  </div>
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
