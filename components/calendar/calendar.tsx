import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

export default function Calendar({
  onDaySelect,
}: {
  onDaySelect?: (date: Date) => void;
}) {
  const [selectedDay, setSelectedDay] = React.useState<number | null>(null);
  const [currentYear, setCurrentYear] = React.useState(
    new Date().getFullYear(),
  );
  const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth());
  const [numberOfDays, setNumberOfDays] = React.useState(0);
  const [firstDayOfMonth, setFirstDayOfMonth] = React.useState(0);

  React.useEffect(() => {
    setNumberOfDays(new Date(currentYear, currentMonth + 1, 0).getDate());
    setFirstDayOfMonth(
      (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7,
    );
  }, [currentYear, currentMonth]);

  return (
    <div>
      <div className="flex items-center justify-center gap-x-4">
        <button
          type="button"
          onClick={() => {
            if (currentMonth === 0) {
              setCurrentMonth(11);
              setCurrentYear(currentYear - 1);
            } else {
              setCurrentMonth(currentMonth - 1);
            }
          }}
          disabled={currentMonth === new Date().getMonth()}
          className="disabled:cursor-not-allowed disabled:text-muted-foreground/30"
        >
          <ChevronLeft className="size-5" />
        </button>
        <p className="font-semibold text-lg">
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
        </p>
        <button
          type="button"
          disabled={!(currentMonth <= new Date().getMonth() + 2)}
          onClick={() => {
            if (currentMonth === 11) {
              setCurrentMonth(0);
              setCurrentYear(currentYear + 1);
            } else {
              setCurrentMonth(currentMonth + 1);
            }
          }}
          className="disabled:cursor-not-allowed disabled:text-muted-foreground/30"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-7 content-center items-center gap-y-3">
        {["H", "K", "Sze", "Cs", "P", "Szo", "V"].map((day) => (
          <p
            key={day}
            className="mb-2 text-center font-medium text-muted-foreground"
          >
            {day}
          </p>
        ))}
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Empty placeholder elements
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: numberOfDays }, (_, i) => i + 1).map((day) => (
          <div key={day} className="flex w-full justify-center">
            <button
              type="button"
              disabled={
                new Date(currentYear, currentMonth, day) <= new Date() ||
                (day + firstDayOfMonth + 1) % 7 === 1 ||
                (day + firstDayOfMonth + 1) % 7 === 0
              }
              className={cn(
                "flex aspect-square size-9 content-center items-center justify-center rounded-full hover:bg-primary/30 disabled:cursor-not-allowed disabled:text-muted-foreground/30 disabled:hover:bg-muted",
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
          </div>
        ))}
      </div>
    </div>
  );
}
