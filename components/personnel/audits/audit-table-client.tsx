"use client";

import { SystemAudit } from '@/types/personnel';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

interface AuditTableClientProps {
    data: SystemAudit[];
}

export function AuditTableClient({ data }: AuditTableClientProps) {
    const columns: ColumnDef<SystemAudit>[] = [
        { header: 'Utilisateur', accessorKey: 'user' },
        { header: 'Action', accessorKey: 'action', cell: ({row}) => <div className="w-[350px] truncate">{row.original.action}</div> },
        { header: 'Date', accessorKey: 'date', cell: ({row}) => format(new Date(row.original.date), 'dd/MM/yyyy') },
        { header: 'Heure', accessorKey: 'date', cell: ({row}) => format(new Date(row.original.date), 'HH:mm:ss') },
        { header: 'Remarques', accessorKey: 'remarks' },
    ];

    return <DataTable columns={columns} data={data} />;
}