"use client";

import React from 'react';
import { Inventory } from '@/types/stock';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { RefreshCw, Edit, Trash2, PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface InventoryListViewProps {
    inventories: Inventory[];
    isLoading: boolean;
    onSelectInventory: (id: string) => void;
    onDelete: (inventory: Inventory) => void;
    onAddNew: () => void;
    onRefresh: () => void;
}

const statusVariantMap: Record<Inventory['status'], "success" | "warning" | "default"> = {
    "Validé": "success",
    "En cours": "warning",
    "Annulé": "default",
};

const RowActions = ({ inventory, onSelect, onDelete }: { inventory: Inventory, onSelect: (id: string) => void, onDelete: (inventory: Inventory) => void }) => {
    return (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onSelect(inventory.id)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Ouvrir / Saisir</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-8 w-8" disabled={inventory.status === 'Validé'} onClick={() => onDelete(inventory)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Supprimer</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export function InventoryListView({ inventories, isLoading, onSelectInventory, onDelete, onAddNew, onRefresh }: InventoryListViewProps) {
    const columns: ColumnDef<Inventory>[] = [
        {
            id: 'select',
            header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Tout sélectionner"/>,
            cell: ({ row }) => <div className="group-hover:opacity-0 transition-opacity"><Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Sélectionner la ligne" /></div>,
        },
        {
            accessorKey: 'reference',
            header: 'Référence',
            cell: ({ row }) => (
                <div className="font-medium hover:underline cursor-pointer" onClick={() => onSelectInventory(row.original.id)}>
                    {row.original.reference}
                </div>
            )
        },
        { accessorKey: 'warehouseId', header: 'Magasin' },
        { accessorKey: 'type', header: 'Type' },
        { 
            accessorKey: 'date', 
            header: 'Date',
            cell: ({ row }) => format(new Date(row.original.date), 'dd/MM/yyyy')
        },
        {
            accessorKey: 'status',
            header: 'Statut',
            cell: ({ row }) => <Badge variant={statusVariantMap[row.original.status] || 'default'}>{row.original.status}</Badge>
        },
        {
            id: 'actions',
            cell: ({ row }) => <RowActions inventory={row.original} onSelect={onSelectInventory} onDelete={onDelete} />,
        },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm h-full flex flex-col">
            <div className="p-4 border-b">
                <h1 className="text-xl font-semibold">Gestion des Inventaires</h1>
            </div>
            <div className="p-2 border-b flex items-center gap-2">
                <Checkbox />
                <Button variant="ghost" size="icon" onClick={onRefresh}><RefreshCw className="h-5 w-5" /></Button>
                <div className="flex-1" />
                <Button onClick={onAddNew} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 py-2">
                    <PenSquare className="mr-2 h-4 w-4" /> Nouvel Inventaire
                </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="p-4 space-y-4">
                        {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                    </div>
                ) : (
                    <DataTable columns={columns} data={inventories} />
                )}
            </div>
        </div>
    );
}