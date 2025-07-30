import { getFiscalYears, getOrders } from "@/lib/api";
import { FiscalYearsView } from "@/components/settings/fiscal-years/fiscal-years-view";

export default async function FiscalYearsPage() {
    const fiscalYears = await getFiscalYears();
    const allOrders = await getOrders();

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex-shrink-0">
                <h1 className="text-xl lg:text-2xl font-bold tracking-tight">Gestion des Exercices</h1>
                <p className="text-muted-foreground text-sm">
                    Créez, consultez, activez et clôturez les exercices comptables de votre société.
                </p>
            </div>
            <div className="flex-grow min-h-0">
                <FiscalYearsView 
                    initialData={fiscalYears} 
                    allOrders={allOrders} 
                />
            </div>
        </div>
    );
}