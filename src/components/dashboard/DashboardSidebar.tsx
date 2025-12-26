import { useState } from "react";
import {
  LayoutGrid,
  Box,
  Server,
  Rocket,
  FileText,
  Settings,
  Activity,
  ChevronLeft,
  ChevronRight,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navigation = [
  { name: "Overview", href: "/overview", icon: LayoutGrid },
  { name: "Applications", href: "/applications", icon: Box },
  { name: "Containers", href: "/containers", icon: Terminal },
  { name: "Nodes", href: "/nodes", icon: Server },
  { name: "Deployments", href: "/deployments", icon: Rocket },
  { name: "Logs", href: "/logs", icon: FileText },
  { name: "Environment", href: "/environment", icon: Settings },
  { name: "Monitoring", href: "/monitoring", icon: Activity },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-14" : "w-56"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">D</span>
          </div>
          {!collapsed && (
            <span className="font-mono font-semibold text-foreground tracking-tight">
              DOCKSHIP
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary -ml-[2px]"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex justify-center"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}
