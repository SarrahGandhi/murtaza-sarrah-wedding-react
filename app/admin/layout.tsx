export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The `id` is the portal target for viewport-fixed admin overlays (e.g. the
  // guests FAB) — this shell is opaque and paints above anything portalled
  // straight to <body>.
  return (
    <div
      id="admin-shell"
      className="fixed inset-0 z-[100] bg-background overflow-y-auto"
    >
      {children}
    </div>
  );
}
