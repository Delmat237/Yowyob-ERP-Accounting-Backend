"use client";

import { MainNav } from "./main-nav";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/useSidebar";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { isCollapsed, toggle } = useSidebar();
  return (
    <aside
      className={cn(
        `hidden lg:block fixed left-0 top-0 z-20 h-screen -translate-x-full transition-[width] ease-in-out duration-300 lg:translate-x-0`,
        isCollapsed === false ? "w-[250px]" : "w-[72px]",
        className
      )}
    >
      <div
        className={cn(
          "relative h-full flex flex-col pt-14 border-r-2"
        )}
      >
        <div className="py-4">
          <MainNav isCollapsed={isCollapsed} />
        </div>
      </div>
    </aside>
  );
}