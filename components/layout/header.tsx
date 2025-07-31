"use client";

import { UserNav } from "./user-nav";
import { Button } from "../ui/button";
import { Menu, Search, Settings, HelpCircle, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Input } from "../ui/input";
import { useSidebar } from "@/hooks/useSidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import Link from "next/link";

export function Header() {
  const { isCollapsed, toggle } = useSidebar();

  return (
    <header className="flex-shrink-0 h-16 flex items-center px-4 md:px-6 bg-transparent">
      <Button variant="ghost" size="icon" className="mr-2" onClick={toggle}>
        <Menu className="h-5 w-5 text-gray-600" />
      </Button>
      <div className="font-semibold text-lg tracking-tight text-gray-700 mr-6">
        KSM
      </div>

      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Rechercher..."
            className="w-full bg-[#eaf1fb] rounded-full pl-10 pr-4 py-2 h-12 border-transparent focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Centre d'aide</DropdownMenuItem>
            <DropdownMenuItem>Formation</DropdownMenuItem>
            <DropdownMenuItem>Nouveautés</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Envoyer des commentaires</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Paramètres rapides</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/settings/company">Voir tous les paramètres</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Densité</DropdownMenuItem>
            <DropdownMenuItem>Thème</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <UserNav />
      </div>
    </header>
  );
}