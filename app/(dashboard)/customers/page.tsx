// FILE: app/(dashboard)/customers/page.tsx
import { CustomerManagementView } from "@/components/customers/customer-management-view";

export default function CustomersPage() {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-shrink-0">
        <h1 className="text-xl lg:text-2xl font-bold tracking-tight">Gestion des Clients</h1>
        <p className="text-muted-foreground text-sm">
          Créez, recherchez et modifiez les fiches de vos clients.
        </p>
      </div>
      <div className="flex-grow min-h-0">
        <CustomerManagementView />
      </div>
    </div>
  );
}