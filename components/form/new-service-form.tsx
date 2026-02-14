"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { createService } from "@/actions/service";
import { createServiceSchema, type Service } from "@/types/service.types";
import type { ServiceCategory } from "@/types/service-category.types";
import { Button } from "../ui/button";
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

export default function NewServiceForm({
  services,
  serviceCategories,
}: {
  services: Service[];
  serviceCategories: ServiceCategory[];
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof createServiceSchema>>({
    defaultValues: {
      name: "",
      type: "top-level",
      duration: "0",
      price: "0",
      parentIds: [],
    },
    resolver: zodResolver(createServiceSchema),
  });

  const parentIds = useFieldArray({
    control: form.control,
    name: "parentIds",
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const toastId = toast.loading("Szolgáltatás létrehozása folyamatban...");

    try {
      if (data.price === "0") {
        data.price = undefined;
      }

      if (data.duration === "0") {
        data.duration = undefined;
      }

      await createService(data);
      toast.success("Sikeres szolgáltatás létrehozás!", { id: toastId });
      await router.push("/dashboard/services");
    } catch {
      toast.error("Hiba történt a szolgáltatás létrehozása során.", {
        id: toastId,
      });
    }
  });

  form.watch();

  React.useEffect(() => {
    form.reset();
  }, [form]);

  return (
    <form
      onSubmit={onSubmit}
      className="w-full overflow-clip rounded-md border"
    >
      <p className="border-b bg-secondary p-4 font-bold text-2xl">
        Új szolgáltatás
      </p>
      <div className="space-y-4 p-4">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field aria-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="service-form-name">Név</FieldLabel>
              <Input id="service-form-name" {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="type"
          render={({ field, fieldState }) => (
            <Field aria-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="service-form-type">Típus</FieldLabel>
              <Select
                id="service-form-type"
                items={serviceCategories.map((category) => ({
                  value: category.slug,
                  label: category.displayName,
                }))}
                onValueChange={(value) => field.onChange(value)}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectGroup>
                    {serviceCategories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.displayName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="flex flex-col gap-4 md:flex-row">
          <Controller
            control={form.control}
            name="price"
            render={({ field, fieldState }) => (
              <Field aria-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="service-form-price">Ár</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="service-form-duration"
                    type="number"
                    {...field}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>Ft</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="duration"
            render={({ field, fieldState }) => (
              <Field aria-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="service-form-duration">
                  Időtartam
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="service-form-duration"
                    type="number"
                    {...field}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>perc</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        {form.watch("type") !== "top-level" ? (
          <Controller
            control={form.control}
            name="parentIds"
            render={({ fieldState }) => (
              <Field aria-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="service-form-parentId">
                  Szülő Szolgáltatás
                </FieldLabel>
                <Select
                  id="service-form-parentId"
                  items={services.map((service) => ({
                    value: service.id,
                    label: service.name,
                  }))}
                  onValueChange={(value) => {
                    if (
                      !parentIds.fields.some(
                        (field) => field.parentId === value,
                      )
                    ) {
                      parentIds.append({ id: value, parentId: value } as {
                        id: string;
                        parentId: string;
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    <SelectGroup>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {parentIds.fields.length > 0 ? (
                  <div className="">
                    <Separator className="my-4" />
                    {parentIds.fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-center justify-between gap-2"
                      >
                        <p className="">
                          {
                            services.find(
                              (service) => service.id === field.parentId,
                            )?.name
                          }
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => parentIds.remove(index)}
                        >
                          <X className="text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : null}
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        ) : null}
        <Button type="submit" className="w-full">
          Létrehozás
        </Button>
      </div>
    </form>
  );
}
