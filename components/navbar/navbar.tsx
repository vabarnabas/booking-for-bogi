import Link from "next/link";

export default function Navbar() {
  return (
    <div className="fixed inset-x-0 top-0 h-14 border-b bg-background">
      <div className="flex h-full w-full items-center px-6">
        <Link href={"/dashboard"} className="font-semibold text-lg">
          Booking for Bogi
        </Link>
      </div>
    </div>
  );
}
