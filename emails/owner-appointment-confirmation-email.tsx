import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Markdown,
  Tailwind,
} from "@react-email/components";
import { generateBaseAppointmentNotes } from "@/lib/utils";
import type { CreateAppointment } from "@/types/appointment.types";

export function OwnerAppointmentConfirmationEmail(dto: CreateAppointment) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-[#fafbfb]">
          <Container className="rounded-md bg-white p-4">
            <Heading as="h1">Új Foglalás Érkezett</Heading>
            <Markdown>
              {generateBaseAppointmentNotes({
                service: dto.service,
                bookingName: dto.name,
                bookingPhoneNumber: dto.phoneNumber,
                totalTime: dto.timeFrame,
                totalCost: dto.details.totalCost,
                selectedServiceNames: dto.details.serviceOptions,
                bookingEmail: dto.email,
                ...(dto.details.paymentMethod === "transfer"
                  ? {
                      paymentMethod: "transfer",
                      city: dto.details.city,
                      postCode: dto.details.postCode,
                      street: dto.details.street,
                      houseNumber: dto.details.houseNumber,
                    }
                  : { paymentMethod: "cash" }),
              })}
            </Markdown>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
