// FILE: app/(dashboard)/layout.tsx
"use client";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebar();

  return (
    <>
      <Header />
      <Sidebar />
      <main
        className={cn(
          "h-screen bg-muted/40 pt-14 transition-[margin-left] ease-in-out duration-300",
          isCollapsed === false ? "lg:ml-[250px]" : "lg:ml-[72px]"
        )}
      >
        <div className="h-full w-full p-4">
          {children}
        </div>
      </main>
    </>
  );
}