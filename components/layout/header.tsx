"use client";

import { cn } from "@/lib/utils";
import { UserNav } from "./user-nav";
import { MobileSidebar } from "./mobile-sidebar";
import { useNavigationStore } from "@/hooks/use-navigation-store";
import { modules } from "@/config/navigation";
import { Button } from "../ui/button";

export function Header() {
  const { activeModule, setActiveModule } = useNavigationStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex h-14 items-center justify-between px-4">
        {/* Module switcher pour les grands écrans */}
        <div className="hidden lg:flex items-center space-x-2">
          {Object.entries(modules).map(([key, module]) => {
            const Icon = module.icon;
            return (
              <Button
                key={key}
                variant={activeModule === key ? "secondary" : "ghost"}
                className="font-semibold"
                onClick={() => setActiveModule(key as any)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {module.name}
              </Button>
            );
          })}
        </div>

        {/* Menu mobile */}
        <div className={cn("block lg:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <UserNav />
        </div>
      </nav>
    </header>
  );
}