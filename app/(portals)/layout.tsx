export default function PortalsGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[var(--paper)]">{children}</div>;
}
