export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex w-full grow px-6 pt-16 pb-6">{children}</div>;
}
