import { getUsers, getProfiles, getWarehouses } from "@/lib/api";
import { UserManagementView } from "@/components/personnel/users/user-management-view";

export default async function UsersPage() {
    const users = await getUsers();
    const profiles = await getProfiles();
    const warehouses = await getWarehouses();

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex-shrink-0">
                <h1 className="text-xl lg:text-2xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
                <p className="text-muted-foreground text-sm">
                    Créez des utilisateurs, assignez des profils et gérez les permissions.
                </p>
            </div>
            <div className="flex-grow min-h-0">
                <UserManagementView 
                    initialUsers={users}
                    profiles={profiles}
                    warehouses={warehouses}
                />
            </div>
        </div>
    );
}