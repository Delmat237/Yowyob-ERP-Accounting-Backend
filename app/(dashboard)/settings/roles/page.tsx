import { getProfiles, getWarehouses } from "@/lib/api";
import { RolesManagementView } from "@/components/personnel/roles/roles-management-view";

export default async function RolesPage() {
    const profiles = await getProfiles();
    const warehouses = await getWarehouses();

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex-shrink-0">
                <h1 className="text-xl lg:text-2xl font-bold tracking-tight">Profils & Permissions</h1>
                <p className="text-muted-foreground text-sm">
                    Définissez des rôles et configurez leurs droits d'accès au système.
                </p>
            </div>
            <div className="flex-grow min-h-0">
                <RolesManagementView
                    initialProfiles={profiles}
                    warehouses={warehouses}
                />
            </div>
        </div>
    );
}