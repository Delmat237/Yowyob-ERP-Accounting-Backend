import { getSuppliers } from "@/lib/api";
import { SupplierManagementView } from "@/components/suppliers/supplier-management-view";

export default async function SuppliersPage() {
    const suppliers = await getSuppliers();

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex-shrink-0">
                <h1 className="text-xl lg:text-2xl font-bold tracking-tight">Gestion des Fournisseurs</h1>
                <p className="text-muted-foreground text-sm">
                    Créez, recherchez et modifiez les fiches de vos fournisseurs.
                </p>
            </div>
            <div className="flex-grow min-h-0">
                <SupplierManagementView initialSuppliers={suppliers} />
            </div>
        </div>
    );
}