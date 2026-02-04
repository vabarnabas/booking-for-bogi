import Image from "next/image";
import { cn, formatCurrency } from "@/lib/utils";
import type { Service } from "@/types/service.types";

export default function ServiceButton({
  service,
  isSelected,
  onClick,
}: {
  service: Service;
  isSelected: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      key={service.name}
      type="button"
      onClick={() => (onClick ? onClick() : null)}
      className={cn(
        "flex w-full items-center gap-x-4 rounded-md border bg-secondary/30 p-3",
        isSelected ? "border-primary bg-primary/10" : "",
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
      ) : null}
      <div className="flex w-full flex-col items-start">
        <p className="font-semibold text-xl">{service.name}</p>
        <p className="text-lg text-muted-foreground">
          {service.price ? formatCurrency(service.price as number) : null}
          {service.price && service.duration ? " - " : ""}
          {service.duration ? `${service.duration} perc` : null}
        </p>
      </div>
    </button>
  );
}
