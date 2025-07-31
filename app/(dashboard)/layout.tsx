"use client";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";
import React from "react";
import { ComposeWindow } from "@/components/ui/compose-window";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#f6f8fc]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 pt-2">
          {children}
        </main>
      </div>
      <ComposeWindow />
    </div>
  );
}