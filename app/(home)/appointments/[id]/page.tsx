import Link from "next/link";
import { getAppointmentById } from "@/actions/appointments";
import CustomMap from "@/components/map/map";
import { Separator } from "@/components/ui/separator";
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
      <div className="w-full max-w-lg space-y-2">
        <p className="mb-6 font-bold text-3xl">Sikeres Foglalás!</p>
        <div className="overflow-clip rounded-md border">
          <div className="border-b bg-secondary p-4">
            <p className="font-bold text-xl">Foglalás Részletei</p>
          </div>
          <div className="p-4">
            <p className="font-semibold text-lg">{`${appointment.name}`}</p>
            <Separator className="my-2" />
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
        <div className="overflow-clip rounded-md border">
          <div className="border-b bg-secondary p-4">
            <p className="font-semibold text-xl">Szolgáltatás Helyszíne</p>
          </div>
          <div className="">
            <CustomMap />
            <div className="mt-2 px-4 pb-4">
              <Link
                href="https://maps.app.goo.gl/tsgkRuBGRkVxTWbr6"
                target="_blank"
                className="text-lg underline hover:text-primary"
              >
                9064 Vámosszabadi Dália utca 2.
              </Link>
            </div>
          </div>
        </div>
        <div className="overflow-clip rounded-md border">
          <div className="border-b bg-secondary p-4">
            <p className="font-semibold text-xl">Elérhetőségek</p>
          </div>
          <div className="space-y-2 p-4">
            <p className="font-semibold">
              Telefonszám: <span className="font-normal">+36703133819</span>
            </p>
            <p className="font-semibold">
              Facebook Oldal:{" "}
              <Link
                href="https://www.facebook.com/profile.php?id=61570092973159"
                target="_blank"
                className="font-normal underline hover:text-primary"
              >
                Link
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
