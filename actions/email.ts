"use server";
import { Resend } from "resend";
import { OwnerAppointmentConfirmationEmail } from "@/emails/owner-appointment-confirmation-email";
import type { CreateAppointment } from "@/types/appointment.types";

export async function sendEmail(dto: CreateAppointment) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: "Booking for Bogi <no-reply@emails.barnicloud.cc>",
      to: ["vabarnabas@gmail.com"],
      subject: "Foglalás",
      react: OwnerAppointmentConfirmationEmail(dto),
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error("Error sending email");
    }

    console.log("Email sent successfully:", data);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
}
