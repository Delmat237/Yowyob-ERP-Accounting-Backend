"use client";

import { MainNav } from "./main-nav";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/useSidebar";
import { useNavigationStore } from "@/hooks/use-navigation-store";
import { modules } from "@/config/navigation";
import { Button } from "../ui/button";
import { ChevronsLeft } from "lucide-react";

export function Sidebar({ className }: SidebarProps) {
  const { isCollapsed, toggle } = useSidebar();
  const { activeModule } = useNavigationStore();

  // Récupère les liens de la sidebar pour le module actif
  const currentLinks = modules[activeModule]?.sidebarLinks || [];
  const currentModule = modules[activeModule];

  return (
    <aside
      className={cn(
        `hidden lg:block fixed left-0 top-14 z-20 h-[calc(100vh-3.5rem)] -translate-x-full transition-[width] ease-in-out duration-300 lg:translate-x-0 border-r`,
        isCollapsed === false ? "w-[250px]" : "w-[72px]",
        className
      )}
    >
      <div className="relative h-full flex flex-col">
        {/* Bouton pour réduire/agrandir */}
        <div className="absolute -right-5 top-4">
           <Button variant="outline" size="icon" className="rounded-full h-8 w-8" onClick={toggle}>
               <ChevronsLeft className={cn("h-4 w-4 transition-transform", !isCollapsed && "rotate-180")}/>
           </Button>
        </div>
        
        <div className="py-4">
          <MainNav isCollapsed={isCollapsed} links={currentLinks} />
        </div>
      </div>
    </aside>
  );
}