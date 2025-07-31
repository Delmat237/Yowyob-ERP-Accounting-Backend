"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SidebarLink } from "@/config/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface MainNavProps {
  links: SidebarLink[];
}

export function MainNav({ links }: MainNavProps) {
  const pathname = usePathname();

  return (
    <nav className="grid gap-1 p-2">
      {links.map((link, index) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={index}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-r-full rounded-l-none px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200/50",
              isActive ? "bg-blue-100 text-blue-800 font-semibold hover:bg-blue-100" : "hover:bg-gray-200"
            )}
          >
            <link.icon className={cn("h-5 w-5", isActive ? "text-blue-700" : "text-gray-600")} />
            {link.title}
          </Link>
        );
      })}
    </nav>
  );
}