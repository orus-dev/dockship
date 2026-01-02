"use client";

import {
  LayoutGrid,
  Box,
  Server,
  Rocket,
  FileText,
  Settings,
  Activity,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { version } from "../../../package.json";

const navigation = [
  { name: "Overview", href: "/overview", icon: LayoutGrid },
  { name: "Applications", href: "/applications", icon: Box },
  { name: "Deployments", href: "/deployments", icon: Rocket },
  { name: "Nodes", href: "/nodes", icon: Server },
  { name: "Logs", href: "/logs", icon: FileText },
  { name: "Environment", href: "/environment", icon: Settings },
  { name: "Monitoring", href: "/monitoring", icon: Activity },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-primary-foreground">
                  <Image
                    src="/dockship.svg"
                    alt="Dockship"
                    width={24}
                    height={24}
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">DOCKSHIP</span>
                  <span className="text-xs text-muted-foreground">
                    v{version}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem
                  key={item.name}
                  className={cn(
                    "border-l-2",
                    item.href === pathname
                      ? "border-primary"
                      : "border-transparent"
                  )}
                >
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.name}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter></SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
