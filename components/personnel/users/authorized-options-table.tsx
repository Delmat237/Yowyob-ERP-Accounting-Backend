import { DataTable } from '@/components/ui/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';

interface Option {
    id: string;
    label: string;
}

interface AuthorizedOptionsTableProps {
    allOptions: Option[];
    authorizedIds: string[];
}

export function AuthorizedOptionsTable({ allOptions, authorizedIds }: AuthorizedOptionsTableProps) {
    const data = allOptions.map(option => ({
        ...option,
        isAuthorized: authorizedIds.includes(option.id)
    }));
    
    const columns: ColumnDef<typeof data[0]>[] = [
        { accessorKey: 'id', header: 'Code' },
        { accessorKey: 'label', header: 'Libellé' },
        { 
            id: 'isAuthorized', 
            header: 'Autorisé?', 
            cell: ({ row }) => <Checkbox checked={row.original.isAuthorized} disabled className="mx-auto block" /> 
        },
    ];

    return <DataTable columns={columns} data={data} />;
}