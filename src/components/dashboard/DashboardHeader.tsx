import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "../ui/sidebar";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const sidebar = useSidebar();

  return (
    <header
      className="h-14 border-b border-border flex items-center justify-between px-6 bg-background"
      onClick={() => sidebar.setOpenMobile(true)}
    >
      <div>
        <h1 className="text-sm font-medium text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Search className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Bell className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-2" />
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <User className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
