// FILE: app/(dashboard)/products/page.tsx
import { ProductManagementView } from "@/components/products/product-management-view";

export default function ProductsPage() {
  return (
     <div className="h-full flex flex-col gap-4">
      <div className="flex-shrink-0">
        <h1 className="text-xl lg:text-2xl font-bold tracking-tight">Gestion des Articles / Produits</h1>
        <p className="text-muted-foreground text-sm">
          Créez, recherchez et modifiez les articles de votre catalogue.
        </p>
      </div>
      <div className="flex-grow min-h-0">
        <ProductManagementView />
      </div>
    </div>
  );
}