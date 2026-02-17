"use client";

import React from "react";
import { toast } from "sonner";
import { updateAppointment } from "@/actions/appointment";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const statuses = [
  { value: "scheduled", label: "Lefoglalva" },
  { value: "completed", label: "Teljesítve" },
  { value: "canceled", label: "Lemondva" },
];

export default function AppointmentStatusSelector({
  appointmentId,
  defaultValue,
}: {
  appointmentId: string;
  defaultValue?: string;
}) {
  const [value, setValue] = React.useState(defaultValue);
  const onValueChange = async (value: string | null) => {
    if (!value) return;

    const toastId = toast.loading("Foglalás állapotának frissítése...");

    try {
      await updateAppointment(appointmentId, { status: value });
      setValue(value);
      toast.success("Foglalás állapotának frissítése sikeres!", {
        id: toastId,
      });
    } catch {
      toast.error("Hiba történt az állapot frissítése során.", { id: toastId });
    }
  };

  return (
    <Select items={statuses} onValueChange={onValueChange} value={value}>
      <SelectTrigger className="bg-background">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end" alignItemWithTrigger={false}>
        <SelectGroup>
          {statuses.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
