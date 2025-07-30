import { DataTable } from '@/components/ui/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { PermissionSet } from '@/types/personnel';
import { ColumnDef } from '@tanstack/react-table';

interface PermissionTableProps {
    permissions: Record<string, PermissionSet>;
}

interface PermissionRow extends PermissionSet {
    menu: string;
}

const MENU_LABELS: Record<string, string> = {
    stock_status: "État des stocks",
    stock_journal: "Journal des mouvements",
    stock_entries: "Entrées/Sorties de stock",
    stock_inventory: "Inventaire",
    sales_new_order: "Saisie Commande",
};

export function PermissionTable({ permissions }: PermissionTableProps) {
    const data: PermissionRow[] = Object.entries(permissions).map(([key, value]) => ({
        menu: MENU_LABELS[key] || key,
        ...value
    }));

    const columns: ColumnDef<PermissionRow>[] = [
        { accessorKey: 'menu', header: 'Menu' },
        { id: 'read', header: 'Accessible', cell: ({ row }) => <Checkbox checked={row.original.read} disabled className="mx-auto block" /> },
        { id: 'create', header: 'Créer', cell: ({ row }) => <Checkbox checked={row.original.create} disabled className="mx-auto block" /> },
        { id: 'update', header: 'Modifier', cell: ({ row }) => <Checkbox checked={row.original.update} disabled className="mx-auto block" /> },
        { id: 'delete', header: 'Suppr.', cell: ({ row }) => <Checkbox checked={row.original.delete} disabled className="mx-auto block" /> },
    ];
    
    return <DataTable columns={columns} data={data} />;
}