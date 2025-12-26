import { ReactNode } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { SidebarProvider } from "../ui/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function DashboardLayout({
  children,
  title,
  subtitle,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
