import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

// Defense in depth: middleware.js already redirects unauthenticated
// requests away from /admin/*, but this server-side check verifies the
// actual signed session (not just cookie presence) before rendering.
export default function AdminAppLayout({ children }) {
  const session = getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-void-900">
      <AdminSidebar admin={session} />
      <main className="flex-1 px-6 py-8 sm:px-10">{children}</main>
    </div>
  );
}
