import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AdminSessionProvider from "@/components/AdminSessionProvider";
import AdminHeader from "@/components/AdminHeader";
import AdminNav from "@/components/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Belt-and-suspenders: middleware already protects /admin/*, but a
  // server-side check here means this layout is safe even if it's ever
  // reused somewhere not covered by the middleware matcher.
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <AdminSessionProvider username={session.sub}>
      <div className="container-page py-8">
        <AdminHeader />
        <div className="mt-4">
          <AdminNav />
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </AdminSessionProvider>
  );
}
