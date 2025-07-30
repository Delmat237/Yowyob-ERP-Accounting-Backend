import { InventoryView } from "@/components/stock/inventory/inventory-view";
import { getInventories, getProducts, getWarehouses } from "@/lib/api";

export default async function InventoryPage() {
    const initialInventories = await getInventories();
    const products = await getProducts();
    const warehouses = await getWarehouses();

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex-shrink-0">
                <h1 className="text-xl lg:text-2xl font-bold tracking-tight">Gestion des Inventaires</h1>
                <p className="text-muted-foreground text-sm">
                    Créez, saisissez, consultez et validez les fiches d'inventaire de stock.
                </p>
            </div>
            <div className="flex-grow min-h-0">
                <InventoryView 
                    initialInventories={initialInventories}
                    products={products}
                    warehouses={warehouses}
                />
            </div>
        </div>
    );
}