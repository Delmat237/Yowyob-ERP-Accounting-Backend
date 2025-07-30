import { getStockMovements, getWarehouses } from "@/lib/api";
import { StockJournalView } from "@/components/stock/journal/stock-journal-view";

export default async function StockJournalPage() {
  const movements = await getStockMovements();
  const warehouses = await getWarehouses();

  return (
     <div className="h-full flex flex-col gap-6">
      <div className="flex-shrink-0">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
          Journal des Mouvements de Stock
        </h1>
        <p className="text-muted-foreground mt-1">
          Consultez l'historique des entrées et sorties de stock.
        </p>
      </div>
      <div className="flex-grow min-h-0">
        <StockJournalView initialMovements={movements} warehouses={warehouses} />
      </div>
    </div>
  );
}