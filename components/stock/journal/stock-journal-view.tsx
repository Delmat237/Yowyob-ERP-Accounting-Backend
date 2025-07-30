"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/date-range-picker';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/ui/data-table';
import { StockMovement, Warehouse } from '@/types/stock';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Printer } from 'lucide-react';

interface StockJournalViewProps {
    initialMovements: any[];
    warehouses: Warehouse[];
}

export function StockJournalView({ initialMovements, warehouses }: StockJournalViewProps) {
    const [filters, setFilters] = useState<{ dateRange?: DateRange; type: string; warehouseId: string }>({
        type: 'all',
        warehouseId: ''
    });

    const filteredMovements = useMemo(() => {
        return initialMovements.filter(m => {
            const date = new Date(m.date);
            const dateMatch = (!filters.dateRange?.from || date >= filters.dateRange.from) && (!filters.dateRange?.to || date <= filters.dateRange.to);
            const typeMatch = filters.type === 'all' || m.type === filters.type;
            const warehouseMatch = !filters.warehouseId || m.warehouseId === filters.warehouseId;
            return dateMatch && typeMatch && warehouseMatch;
        });
    }, [initialMovements, filters]);

    const columns: ColumnDef<any>[] = [
        { accessorKey: 'date', header: 'Date', cell: ({ row }) => format(new Date(row.original.date), 'dd/MM/yyyy HH:mm') },
        { accessorKey: 'reference', header: 'Référence' },
        { accessorKey: 'type', header: 'Type', cell: ({ row }) => row.original.type === 'entry' ? 'Entrée' : 'Sortie' },
        { accessorKey: 'warehouse.name', header: 'Magasin' },
        { accessorKey: 'notes', header: 'Description' },
    ];

    return (
        <Card className='h-full flex flex-col'>
            <CardHeader>
                <div className='flex flex-wrap gap-4 items-end'>
                    <div className='flex-1 min-w-[250px]'><Label>Date entre</Label><DateRangePicker onDateChange={dateRange => setFilters(f => ({ ...f, dateRange }))} /></div>
                    <div className='flex-1'><Label>Source Mouvement</Label><RadioGroup value={filters.type} onValueChange={type => setFilters(f => ({ ...f, type }))} className="flex gap-4 pt-2"><RadioGroupItem value="all" id="r-all" /><Label htmlFor="r-all">Toute/s</Label><RadioGroupItem value="entry" id="r-entry" /><Label htmlFor="r-entry">Uniquement Entrées</Label><RadioGroupItem value="exit" id="r-exit" /><Label htmlFor="r-exit">Uniquement Sorties</Label></RadioGroup></div>
                    <div className='flex-1 min-w-[200px]'><Label>Magasin</Label><Select value={filters.warehouseId} onValueChange={warehouseId => setFilters(f => ({ ...f, warehouseId }))}><SelectTrigger><SelectValue placeholder="Tous" /></SelectTrigger><SelectContent><SelectItem value="All">Tous</SelectItem>{warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent></Select></div>
                    <Button variant="outline"><Printer className="mr-2 h-4 w-4" />Imprimer</Button>
                </div>
            </CardHeader>
            <CardContent className='flex-grow overflow-y-auto'>
                <DataTable columns={columns} data={filteredMovements} />
            </CardContent>
        </Card>
    );
}