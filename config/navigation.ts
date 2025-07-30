import {
    ShoppingCart,
    Users,
    Truck,
    Banknote,
    UserCog,
    Settings,
    LayoutDashboard,
    PenBox,
    BookOpen,
    FileText,
    PackagePlus,
    PackageSearch,
    Warehouse,
    FileClock,
  } from "lucide-react";
  
  export type SidebarLink = {
    title: string;
    label?: string;
    icon: React.ElementType;
    href: string;
  };
  
  export type Module = {
    name: string;
    icon: React.ElementType;
    sidebarLinks: SidebarLink[];
  };
  
  // Définit les clés de nos modules pour la sécurité des types
  export const moduleKeys = ["ventes", "stock", "personnel", "parametres"] as const;
  export type ModuleKey = typeof moduleKeys[number];
  
  export const modules: Record<ModuleKey, Module> = {
    ventes: {
      name: "Ventes & Tiers",
      icon: ShoppingCart,
      sidebarLinks: [
        { title: "Tableau de Bord", icon: LayoutDashboard, href: "/" },
        { title: "Saisie Commande", icon: PenBox, href: "/sales/new-order" },
        { title: "Journal Commandes", icon: BookOpen, href: "/sales/order-journal" },
        { title: "Gestion Factures", icon: FileText, href: "/invoices" },
        { title: "Clients", icon: Users, href: "/customers" },
        { title: "Fournisseurs", icon: Truck, href: "/suppliers" }, // Placeholder
      ],
    },
    stock: {
      name: "Gestion des Stocks",
      icon: Warehouse,
      sidebarLinks: [
        { title: "État des Stocks", icon: PackageSearch, href: "/stock/status" },
        { title: "Entrées de Stock", icon: PackagePlus, href: "/stock/entries" },
        { title: "Journal des Mouvements", icon: FileClock, href: "/stock/journal" },
        { title: "Inventaire", icon: BookOpen, href: "/stock/inventory" },
        { title: "Articles & Produits", icon: ShoppingCart, href: "/products" },
      ],
    },
    personnel: {
      name: "Personnel & Accès",
      icon: UserCog,
      sidebarLinks: [
        { title: "Gestion Utilisateurs", icon: Users, href: "/settings/users" },
        { title: "Profils & Permissions", icon: UserCog, href: "/settings/roles" }, // Placeholder
      ],
    },
    parametres: {
      name: "Paramètres",
      icon: Settings,
      sidebarLinks: [
        { title: "Société", icon: Settings, href: "/settings/company" },
        { title: "Exercices", icon: BookOpen, href: "/settings/fiscal-years" },
      ],
    },
  };