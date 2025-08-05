import { WarehouseTransferForm } from "@/components/stock/transfer/warehouse-transfer-form";
import { getProducts, getWarehouses } from "@/lib/api";

export default async function WarehouseTransferPage() {
  const products = await getProducts();
  const warehouses = await getWarehouses();

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-shrink-0">
        <h1 className="text-xl lg:text-2xl font-bold tracking-tight">Transfert de Stock entre Magasins</h1>
        <p className="text-muted-foreground text-sm">
          Déplacez des articles d'un magasin source vers un magasin de destination.
        </p>
      </div>
      <div className="flex-grow min-h-0">
        <WarehouseTransferForm products={products} warehouses={warehouses} />
      </div>
    </div>
  );
}