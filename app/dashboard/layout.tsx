import Navbar from "@/components/navbar/navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex grow px-6 pt-20 pb-6">{children}</div>
      <Navbar />
    </>
  );
}
