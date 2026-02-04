import { getAppointmentById } from "@/actions/appointments";
import { formatDateTime, getTimeFromDate } from "@/lib/utils";

export default async function AppointmentResult({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const appointment = await getAppointmentById(id);

  return (
    <div className="flex w-full grow justify-center">
      <div className="w-full max-w-md">
        <p className="mb-6 font-bold text-3xl">Sikeres Foglalás!</p>
        <div className="space-y-1 rounded-md bg-secondary p-3">
          <p className="mb-2 font-bold text-xl">Foglalás Részletei</p>
          <p className="">{`${appointment.name}`}</p>
          <p className="">{appointment.customer.name}</p>
          <p className="">{appointment.customer.phoneNumber}</p>
          <p className="">{appointment.customer.email}</p>
          <div className=""></div>
          <p className="mt-2 rounded bg-primary/80 p-2 font-bold">
            {formatDateTime(new Date(appointment.startDate))}
            {" - "}
            {getTimeFromDate(new Date(appointment.endDate))}
          </p>
        </div>
      </div>
    </div>
  );
}
