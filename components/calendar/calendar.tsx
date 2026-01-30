import React from "react";
import { cn } from "@/lib/utils";

export default function Calendar({
  onDaySelect,
}: {
  onDaySelect?: (date: Date) => void;
}) {
  const [selectedDay, setSelectedDay] = React.useState<number | null>(null);
  const [currentYear, _setCurrentYear] = React.useState(
    new Date().getFullYear(),
  );
  const [currentMonth, _setCurrentMonth] = React.useState(
    new Date().getMonth(),
  );
  const [numberOfDays, setNumberOfDays] = React.useState(0);

  React.useEffect(() => {
    setNumberOfDays(new Date(currentYear, currentMonth + 1, 0).getDate());
  }, [currentYear, currentMonth]);

  return (
    <div>
      <div className="flex justify-center font-semibold text-lg">
        {currentYear}{" "}
        {
          [
            "Január",
            "Február",
            "Március",
            "Április",
            "Május",
            "Június",
            "Július",
            "Augusztus",
            "Szeptember",
            "Október",
            "November",
            "December",
          ][currentMonth]
        }
      </div>
      <div className="mt-6 grid grid-cols-7 content-center items-center gap-y-3">
        {Array.from({ length: numberOfDays }, (_, i) => i + 1).map((day) => (
          <button
            key={day}
            type="button"
            disabled={new Date(currentYear, currentMonth, day) <= new Date()}
            className={cn(
              "flex aspect-square size-9 items-center justify-center rounded-full hover:bg-primary/30 disabled:cursor-not-allowed disabled:text-muted-foreground/30 disabled:hover:bg-muted",
              selectedDay === day
                ? "bg-primary font-semibold text-primary-foreground"
                : "bg-muted text-muted-foreground",
            )}
            onClick={() => {
              setSelectedDay(day);
              if (onDaySelect) {
                const date = new Date(currentYear, currentMonth, day + 1);
                onDaySelect(date);
              }
            }}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}
