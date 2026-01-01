"use client";

import { ReactNode, useEffect, useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { SidebarProvider } from "../ui/sidebar";
import Cookies from "js-cookie";

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
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // document.title = `DOCKSHIP | ${title}`;

  useEffect(() => {
    setSidebarOpen(Cookies.get("sidebar_state") !== "false");
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
