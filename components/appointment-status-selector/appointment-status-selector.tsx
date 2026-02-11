"use client";

import { toast } from "sonner";
import { updateAppointmentStatus } from "@/actions/appointments";
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
  const onValueChange = async (value: string | null) => {
    if (!value) return;

    const toastId = toast.loading("Foglalás állapotának frissítése...");

    try {
      await updateAppointmentStatus(appointmentId, value);
      toast.success("Foglalás állapotának frissítése sikeres!", {
        id: toastId,
      });
    } catch {
      toast.error("Hiba történt az állapot frissítése során.", { id: toastId });
    }
  };

  return (
    <Select
      items={statuses}
      onValueChange={onValueChange}
      defaultValue={defaultValue}
    >
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
