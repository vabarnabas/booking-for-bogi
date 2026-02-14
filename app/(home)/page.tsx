import { ServerCrash } from "lucide-react";
import { getServices } from "@/actions/service";
import EmptyState from "@/components/empty-state/empty-state";
import BookingForm from "@/components/form/booking-form";

export default async function Page() {
  const services = await getServices();

  return (
    <div className="flex w-full grow justify-center">
      {services ? (
        <BookingForm services={services} />
      ) : (
        <EmptyState
          icon={ServerCrash}
          title="Hiba történt!"
          subtitle="Úgy tűnik, hogy valami hiba történt a szolgáltatások betöltése közben. Kérlek próbáld meg újra később."
        />
      )}
    </div>
  );
}
