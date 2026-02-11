import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getCustomerById } from "@/actions/customers";
import AppointmentStatusSelector from "@/components/appointment-status-selector/appointment-status-selector";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { cn, formatDateTime } from "@/lib/utils";

export default async function CustomerById({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    return <div>Ez a vendég nem található</div>;
  }

  return (
    <div className="w-full">
      <p className="mb-6 font-bold text-3xl">{customer.name}</p>
      <div className="mb-6 overflow-clip rounded-md border">
        <div className="border-b bg-secondary p-4">
          <p className="font-semibold text-2xl">Személyes Adatok</p>
        </div>
        <div className="p-4">
          <p className="">{customer.phoneNumber}</p>
          <p className="">{customer.email}</p>
        </div>
      </div>
      <p className="mb-4 font-semibold text-2xl">
        Foglalások{" "}
        <span className="text-lg">({customer.appointments.length})</span>
      </p>
      <div className="space-y-2">
        {customer.appointments
          .sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
          )
          .map((appointment) => (
            <div
              key={appointment.id}
              className="w-full overflow-clip rounded-md border"
            >
              <div className="border-b bg-secondary p-3">
                <div className="flex w-full flex-wrap items-center justify-between gap-4">
                  <div
                    className={cn(
                      appointment.status === "canceled" &&
                        "text-muted-foreground",
                    )}
                  >
                    <p className="font-bold text-xl">{appointment.name}</p>
                    <p className="text-sm">
                      {formatDateTime(appointment.startDate)}
                    </p>
                  </div>

                  <AppointmentStatusSelector
                    defaultValue={appointment.status}
                    appointmentId={appointment.id}
                  />
                </div>
              </div>
              <div className="p-3">
                <Accordion>
                  <AccordionItem value="markdown">
                    <AccordionTrigger className="items-center text-base">
                      Részletek Megtekintése
                    </AccordionTrigger>
                    <AccordionContent>
                      <Separator className="mt-2 mb-4" />
                      <div className="w-full space-y-2 text-base">
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
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
