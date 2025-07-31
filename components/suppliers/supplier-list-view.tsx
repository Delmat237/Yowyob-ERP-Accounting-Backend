"use client";

import React from 'react';
import { Supplier } from '@/types/core';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { RefreshCw, Archive, Edit, Trash2, PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Badge } from '../ui/badge';

interface SupplierListViewProps {
    suppliers: Supplier[];
    isLoading: boolean;
    onSelectSupplier: (id: string) => void;
    onEditSupplier: (id: string) => void;
    onDeleteSupplier: (supplier: Supplier) => void;
    onAddNew: () => void;
    onRefresh: () => void;
}

const RowActions = ({ supplier, onEdit, onDelete }: { supplier: Supplier, onEdit: (id: string) => void, onDelete: (supplier: Supplier) => void }) => {
    return (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(supplier.id)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Modifier</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(supplier)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Supprimer</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export function SupplierListView({ suppliers, isLoading, onSelectSupplier, onEditSupplier, onDeleteSupplier, onAddNew, onRefresh }: SupplierListViewProps) {

    const columns: ColumnDef<Supplier>[] = [
        {
            id: 'select',
            header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Tout sélectionner"/>,
            cell: ({ row }) => <div className="group-hover:opacity-0 transition-opacity"><Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Sélectionner la ligne" /></div>,
        },
        {
            accessorKey: 'companyName',
            header: 'Fournisseur',
            cell: ({ row }) => (
                <div className="font-medium hover:underline cursor-pointer" onClick={() => onSelectSupplier(row.original.id)}>
                    {row.original.companyName}
                </div>
            )
        },
        { accessorKey: 'code', header: 'Code' },
        { accessorKey: 'contactPerson', header: 'Contact' },
        { accessorKey: 'phone', header: 'Téléphone' },
        { 
            accessorKey: 'balance', 
            header: () => <div className="text-right">Solde</div>,
            cell: ({ row }) => <div className="text-right"><span className={row.original.balance >= 0 ? '' : 'text-red-600'}>{row.original.balance.toLocaleString('fr-FR')}</span></div>,
        },
        {
            accessorKey: 'isActive',
            header: 'Statut',
            cell: ({ row }) => <Badge variant={row.original.isActive ? 'success' : 'secondary'}>{row.original.isActive ? 'Actif' : 'Inactif'}</Badge>
        },
        {
            id: 'actions',
            cell: ({ row }) => <RowActions supplier={row.original} onEdit={onEditSupplier} onDelete={onDeleteSupplier} />,
        },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm h-full flex flex-col">
            <div className="p-4 border-b">
                <h1 className="text-xl font-semibold">Fournisseurs</h1>
            </div>
            <div className="p-2 border-b flex items-center gap-2">
                <Checkbox />
                <Button variant="ghost" size="icon" onClick={onRefresh}><RefreshCw className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon"><Archive className="h-5 w-5" /></Button>
                <div className="flex-1" />
                <Button onClick={onAddNew} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 py-2">
                    <PenSquare className="mr-2 h-4 w-4" /> Nouveau Fournisseur
                </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="p-4 space-y-4">
                        {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                    </div>
                ) : (
                    <DataTable columns={columns} data={suppliers} />
                )}
            </div>
        </div>
    );
}