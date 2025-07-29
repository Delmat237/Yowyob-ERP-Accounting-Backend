import {
    FileText,
    LayoutDashboard,
    PenBox,
    ShoppingCart, // Icône pour produits
    Users2, // Icône pour clients
    BookOpen
  } from "lucide-react";
  
  type NavLink = {
    title: string;
    label?: string;
    icon: React.ElementType;
    variant: "default" | "ghost";
    href: string;
  };
  
  export const navLinks: NavLink[] = [
    {
      title: "Tableau de Bord",
      label: "",
      icon: LayoutDashboard,
      variant: "default",
      href: "/",
    },
    {
      title: "Saisie Commande",
      label: "",
      icon: PenBox,
      variant: "ghost",
      href: "/sales/new-order",
    },
    {
      title: "Journal des Commandes",
      label: "",
      icon: BookOpen,
      variant: "ghost",
      href: "/sales/order-journal",
    },
    {
      title: "Gestion Factures",
      label: "",
      icon: FileText,
      variant: "ghost",
      href: "/invoices",
    },
    // LIEN CLIENT MIS À JOUR
    {
      title: "Clients",
      label: "",
      icon: Users2,
      variant: "ghost",
      href: "/customers",
    },
    // LIEN PRODUIT MIS À JOUR
    {
      title: "Produits",
      label: "",
      icon: ShoppingCart,
      variant: "ghost",
      href: "/products",
    },
  ];