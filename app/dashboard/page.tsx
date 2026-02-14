import { Calendar, UserIcon } from "lucide-react";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAppointments } from "@/actions/appointments";
import AppointmentStatusSelector from "@/components/appointment-status-selector/appointment-status-selector";
import EmptyState from "@/components/empty-state/empty-state";
import { Separator } from "@/components/ui/separator";
import { cn, formatDateTime } from "@/lib/utils";

export default async function Dashboard() {
  const appointments = await getAppointments();

  return (
    <div className="flex w-full grow flex-col">
      <p className="mb-6 font-bold text-3xl">Foglalások</p>
      {appointments.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="Nincsenek Foglalások"
          subtitle="Úgy néz ki nincsenek még elérhető foglalások."
        />
      ) : null}
      {appointments.length !== 0 ? (
        <div className="w-full space-y-4">
          {appointments
            .sort(
              (a, b) =>
                new Date(a.startDate).getTime() -
                new Date(b.startDate).getTime(),
            )
            .map((appointment) => (
              <div
                key={appointment.id}
                className="w-full overflow-clip rounded-md border"
              >
                <div className="border-b bg-secondary p-4">
                  <div className="flex w-full flex-wrap items-center justify-between gap-4">
                    <div
                      className={cn(
                        appointment.status === "canceled" &&
                          "text-muted-foreground",
                      )}
                    >
                      <p className="font-bold text-2xl">{appointment.name}</p>
                      <p className="">
                        {formatDateTime(appointment.startDate)}
                      </p>
                    </div>

                    <AppointmentStatusSelector
                      defaultValue={appointment.status}
                      appointmentId={appointment.id}
                    />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-x-1.5">
                    <div className="w-full space-y-2">
                      <Markdown
                        components={{
                          ul: ({ node, ...props }) => (
                            <ul
                              style={{
                                height: "fit-content",
                                listStyleType: "disc",
                                paddingLeft: "2em",
                              }}
                              {...props}
                            />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol
                              style={{
                                listStyleType: "decimal",
                                paddingLeft: "2em",
                              }}
                              {...props}
                            />
                          ),
                          hr: ({ node, ...props }) => (
                            <hr
                              style={{
                                margin: "1em 0",
                              }}
                              {...props}
                            />
                          ),
                        }}
                        remarkPlugins={[remarkGfm]}
                      >
                        {appointment.notes}
                      </Markdown>
                    </div>
                  </div>
                  <Separator className="my-6" />
                  <div className="flex w-full flex-wrap items-center justify-between gap-4">
                    <Link
                      href={`/dashboard/customers/${appointment.customer.id}`}
                      className="flex items-center gap-x-1.5 underline hover:text-primary"
                    >
                      <UserIcon className="size-5" />
                      {appointment.customer.name}
                    </Link>
                    <Link
                      href={`${process.env.CALENDAR_URL}/${appointment.eventId}`}
                      target="_blank"
                      className="rounded-md bg-primary px-3 py-1 hover:bg-primary/80"
                    >
                      Esemény Megtekintése
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : null}
    </div>
  );
}
