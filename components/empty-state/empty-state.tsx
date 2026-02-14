import type { LucideProps } from "lucide-react";
import React from "react";

export default function EmptyState({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}) {
  return (
    <div className="flex grow flex-col items-center justify-center">
      <div className="flex w-full max-w-md flex-col items-center justify-center">
        <div className="flex aspect-square size-18 items-center justify-center rounded-lg bg-primary">
          {React.createElement(icon, {
            className: "size-9 text-primary-foreground",
          })}
        </div>
        <p className="mt-4 font-semibold text-2xl">{title}</p>
        <p className="mt-1 text-center text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
