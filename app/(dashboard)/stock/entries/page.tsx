import { StockMovementForm } from "@/components/stock/entries/stock-movement-form";
import { getProducts, getWarehouses } from "@/lib/api";

export default async function StockEntriesPage() {
  const products = await getProducts();
  const warehouses = await getWarehouses();

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-shrink-0">
        <h1 className="text-xl lg:text-2xl font-bold tracking-tight">Gestion des Entrées / Sorties de Stock</h1>
        <p className="text-muted-foreground text-sm">
          Enregistrez les entrées (achats, retours) et les sorties (ventes, pertes) de marchandises.
        </p>
      </div>
      <div className="flex-grow min-h-0">
        <StockMovementForm products={products} warehouses={warehouses} />
      </div>
    </div>
  );
}