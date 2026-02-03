import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTimeFromDate(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function formatDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}.${month}.${day} ${getTimeFromDate(date)}`;
}

export function generateBaseAppointmentNotes(
  service: string,
  selectedServiceNames: string[],
  totalCost: number,
  totalTime: number,
): string {
  return `
**Kiválasztott szolgáltatás:** ${service}

**Kiválasztott opciók:**
${selectedServiceNames.map((s) => `- ${s}`).join("\n")}

**Teljes ár:** ${Intl.NumberFormat("hu-HU", {
    style: "currency",
    currency: "HUF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalCost)}
                
                
**Teljes idő:** ${totalTime} perc`;
}

export function generateExtendedAppointmentNotes(
  baseNote: string,
  customerId: string,
) {
  return `${baseNote}
  
**Ügyfél:** [Link](${process.env.APP_URL}/dashboard/customers/${customerId})`;
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("hu-HU", {
    style: "currency",
    currency: "HUF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
