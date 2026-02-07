"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { login } from "@/actions/auth";
import { loginSchema } from "@/types/auth.types";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const toastId = toast.loading("Bejelentkezés folyamatban...");

    try {
      await login(data.identifier, data.password);
      toast.success("Sikeres bejelentkezés!", { id: toastId });
      router.push("/dashboard");
    } catch {
      toast.error("Hiba történt a bejelentkezés során.", { id: toastId });
    }
  });

  return (
    <div className="flex grow items-center justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4">
        <p className="pb-2 font-bold text-3xl">Bejelentkezés</p>
        <Controller
          control={form.control}
          name="identifier"
          render={({ field, fieldState }) => (
            <Field aria-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-form-identifier">
                Felhasználónév
              </FieldLabel>
              <Input id="login-form-identifier" {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field aria-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-form-password">Jelszó</FieldLabel>
              <Input type="password" id="login-form-password" {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button type="submit" className="w-full">
          Bejelentkezés
        </Button>
      </form>
    </div>
  );
}
