import Navbar from "@/components/navbar/navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex grow px-6 pt-18">{children}</div>
      <Navbar />
    </>
  );
}
