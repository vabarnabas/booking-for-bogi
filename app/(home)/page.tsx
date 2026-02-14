import { getServices } from "@/actions/service";
import BookingForm from "@/components/form/booking-form";

export default async function Page() {
  const services = await getServices();

  return (
    <div className="flex w-full grow justify-center">
      {services ? <BookingForm services={services} /> : null}
    </div>
  );
}
