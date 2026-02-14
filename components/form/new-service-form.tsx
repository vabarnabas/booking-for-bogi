"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { createService } from "@/actions/service";
import { createServiceSchema, type Service } from "@/types/service.types";
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

export default function NewServiceForm({ services }: { services: Service[] }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof createServiceSchema>>({
    defaultValues: {
      name: "",
      type: "top-level",
      duration: undefined,
      price: undefined,
    },
    resolver: zodResolver(createServiceSchema),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const toastId = toast.loading("Szolgáltatás létrehozása folyamatban...");

    if (data.type !== "top-level" && !data.parentId) {
      toast.error("Kérem válassza ki a szülő szolgáltatást.", { id: toastId });
      return;
    }

    try {
      await createService(data);
      toast.success("Sikeres szolgáltatás létrehozás!", { id: toastId });
      router.push("/dashboard/services");
    } catch {
      toast.error("Hiba történt a szolgáltatás létrehozása során.", {
        id: toastId,
      });
    }
  });

  form.watch();

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
                items={{
                  "top-level": "Fő szolgáltatás",
                  type: "Típus",
                  size: "Méret",
                  decoration: "Díszítés",
                  extra: "Extra",
                }}
                onValueChange={(value) => field.onChange(value)}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectGroup>
                    <SelectItem value="top-level">Fő szolgáltatás</SelectItem>
                    <SelectItem value="type">Típus</SelectItem>
                    <SelectItem value="size">Méret</SelectItem>
                    <SelectItem value="decoration">Díszítés</SelectItem>
                    <SelectItem value="extra">Extra</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="duration"
          render={({ field, fieldState }) => (
            <Field aria-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="service-form-duration">Időtartam</FieldLabel>
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {form.getValues("type") !== "top-level" ? (
          <Controller
            control={form.control}
            name="parentId"
            render={({ field, fieldState }) => (
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
                  onValueChange={(value) => field.onChange(value)}
                  defaultValue={field.value}
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
