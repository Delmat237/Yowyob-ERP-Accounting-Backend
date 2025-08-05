"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DateRangePicker } from '@/components/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/ui/data-table';
import { Warehouse } from '@/types/stock';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Printer, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { UnifiedMovement } from '@/app/(dashboard)/stock/journal/page';
import { Skeleton } from '@/components/ui/skeleton';

interface StockJournalViewProps {
    movements: UnifiedMovement[];
    warehouses: Warehouse[];
    isLoading: boolean;
    onSelectMovement: (id: string) => void;
    onRefresh: () => void;
}

const typeVariantMap: Record<UnifiedMovement['type'], "success" | "destructive" | "default" | "secondary"> = {
    "Entrée": "success",
    "Sortie": "destructive",
    "Transfert": "default",
    "Transformation": "secondary"
};

export function StockJournalView({ movements, warehouses, isLoading, onSelectMovement, onRefresh }: StockJournalViewProps) {
    const [filters, setFilters] = useState<{ dateRange?: DateRange; type: string; warehouseId: string }>({
        type: 'all',
        warehouseId: 'all'
    });

    const filteredMovements = useMemo(() => {
        return movements.filter(m => {
            const dateMatch = (!filters.dateRange?.from || m.date >= filters.dateRange.from) && (!filters.dateRange?.to || m.date <= filters.dateRange.to);
            const typeMatch = filters.type === 'all' || m.type === filters.type;
            const warehouseMatch = filters.warehouseId === 'all' || m.warehouseId === filters.warehouseId;
            return dateMatch && typeMatch && warehouseMatch;
        });
    }, [movements, filters]);

    const columns: ColumnDef<UnifiedMovement>[] = [
        { accessorKey: 'date', header: 'Date', cell: ({ row }) => format(row.original.date, 'dd/MM/yyyy HH:mm') },
        { accessorKey: 'type', header: 'Type', cell: ({ row }) => <Badge variant={typeVariantMap[row.original.type]}>{row.original.type}</Badge> },
        {
            accessorKey: 'reference',
            header: 'Référence',
            cell: ({ row }) => (
                <div className="font-medium hover:underline cursor-pointer" onClick={() => onSelectMovement(row.original.id)}>
                    {row.original.reference}
                </div>
            )
        },
        { accessorKey: 'warehouseName', header: 'Magasin' },
        { accessorKey: 'description', header: 'Description', cell: ({row}) => <div className="w-[300px] truncate">{row.original.description}</div>},
    ];

    return (
        <Card className='h-full flex flex-col bg-white rounded-2xl shadow-sm'>
             <CardHeader className="p-4 border-b">
                <div className='flex flex-wrap gap-4 items-end'>
                    <div className='flex-1 min-w-[250px]'><Label>Période</Label><DateRangePicker onDateChange={dateRange => setFilters(f => ({ ...f, dateRange }))} /></div>
                    <div className='flex-1 min-w-[200px]'><Label>Type de Mouvement</Label><Select value={filters.type} onValueChange={type => setFilters(f => ({ ...f, type }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tous</SelectItem><SelectItem value="Entrée">Entrée</SelectItem><SelectItem value="Sortie">Sortie</SelectItem><SelectItem value="Transfert">Transfert</SelectItem><SelectItem value="Transformation">Transformation</SelectItem></SelectContent></Select></div>
                    <div className='flex-1 min-w-[200px]'><Label>Magasin</Label><Select value={filters.warehouseId} onValueChange={warehouseId => setFilters(f => ({ ...f, warehouseId }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tous</SelectItem>{warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent></Select></div>
                    <Button variant="ghost" size="icon" onClick={onRefresh}><RefreshCw className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon"><Printer className="h-5 w-5" /></Button>
                </div>
            </CardHeader>
            <CardContent className='flex-grow overflow-y-auto p-0'>
                {isLoading ? (
                    <div className="p-4 space-y-2">
                        {Array.from({ length: 15 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                    </div>
                ) : (
                    <DataTable columns={columns} data={filteredMovements} />
                )}
            </CardContent>
        </Card>
    );
}