import Link from "next/link";

export default function Navbar() {
  return (
    <div className="fixed inset-x-0 top-0 h-14 border-b bg-background">
      <div className="flex h-full w-full items-center justify-between px-6">
        <Link href={"/dashboard"} className="font-semibold text-lg">
          Booking for Bogi
        </Link>
        <div className="">
          <Link
            href={"/dashboard/services"}
            className="rounded px-2.5 py-1.5 font-medium text-sm hover:bg-secondary"
          >
            Szolgáltatások
          </Link>
          <Link
            href={"/dashboard/services"}
            className="rounded px-2.5 py-1.5 font-medium text-sm hover:bg-secondary"
          >
            Szolgáltatás Kategóriák
          </Link>
        </div>
      </div>
    </div>
  );
}
