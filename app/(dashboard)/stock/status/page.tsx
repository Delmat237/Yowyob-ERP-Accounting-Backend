import { getProducts, getWarehouses } from "@/lib/api";
import { StockStatusView } from "@/components/stock/status/stock-status-view";

export default async function StockStatusPage() {
  const products = await getProducts();
  const warehouses = await getWarehouses();

  const productFamilies = [...new Set(products.map(p => p.family).filter(Boolean))] as string[];

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-shrink-0">
        <h1 className="text-xl lg:text-2xl font-bold tracking-tight">Consultation de l'état de stock</h1>
        <p className="text-muted-foreground text-sm">
          Analysez les quantités et valorisations de vos articles en stock.
        </p>
      </div>
      <div className="flex-grow min-h-0">
        <StockStatusView 
            products={products}
            warehouses={warehouses}
            productFamilies={productFamilies}
        />
      </div>
    </div>
  );
}