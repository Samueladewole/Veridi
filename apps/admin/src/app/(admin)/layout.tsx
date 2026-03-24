import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminTopBar } from "@/components/admin-topbar";

interface AdminLayoutProps {
  readonly children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex flex-1 flex-col overflow-hidden">
        <AdminTopBar title="Operations Overview" breadcrumb="Admin" />
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
