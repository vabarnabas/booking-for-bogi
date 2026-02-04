import { formatCurrency, formatDateTime, getTimeFromDate } from "@/lib/utils";
import type { Service } from "@/types/service.types";

export default function BookingDetails({
  formPage,
  service,
  options,
  totalTime,
  totalCost,
  startDate,
}: {
  formPage: number;
  service: string;
  options: Service[];
  totalTime: number;
  totalCost: number;
  startDate?: string;
}) {
  return (
    <div className="space-y-1 rounded-md bg-secondary p-3">
      <p className="mb-2 font-bold text-xl">Foglalás Részletei</p>
      {service ? (
        <p className="">{`${service} ${options.length ? `(${options.map((service) => service.name).join(", ")})` : ""}`}</p>
      ) : null}
      <div className="">
        <div className="grid grid-cols-2">
          <p className="font-semibold">{totalTime} perc</p>
          <p className="font-semibold">{formatCurrency(totalCost)}</p>
        </div>
      </div>
      {formPage === 2 && startDate ? (
        <p className="mt-4 rounded bg-primary/80 p-2 font-bold">
          {formatDateTime(new Date(startDate))}
          {" - "}
          {getTimeFromDate(
            new Date(new Date(startDate).getTime() + totalTime * 60000),
          )}
        </p>
      ) : null}
    </div>
  );
}
