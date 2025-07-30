"use client";

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Lock, Unlock, CheckCircle, Eye } from 'lucide-react';
import { FiscalYear } from '@/types/settings';
import { Order } from '@/types/sales';
import { createFiscalYear, updateFiscalYear, getFiscalYears } from '@/lib/api';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { NewFiscalYearDialog } from './new-fiscal-year-dialog';
import { FiscalYearDetailModal } from './fiscal-year-detail-modal';

interface FiscalYearsViewProps {
    initialData: FiscalYear[];
    allOrders: Order[];
}

export function FiscalYearsView({ initialData, allOrders }: FiscalYearsViewProps) {
    const [years, setYears] = useState(initialData);
    const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState<FiscalYear | null>(null);
    
    const refreshData = useCallback(async () => {
        const data = await getFiscalYears();
        setYears(data);
    }, []);

    const handleCreate = async (data: Omit<FiscalYear, 'id' | 'status'>) => {
        try {
            await createFiscalYear({ ...data, status: 'Ouvert' });
            await refreshData();
            setIsNewDialogOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleStatusChange = async (year: FiscalYear, newStatus: FiscalYear['status']) => {
        if (!window.confirm(`Voulez-vous vraiment changer le statut de l'exercice "${year.name}" à "${newStatus}" ?`)) return;
        try {
            await updateFiscalYear(year.id, { status: newStatus });
            await refreshData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleViewDetails = (year: FiscalYear) => {
        setSelectedYear(year);
        setIsDetailModalOpen(true);
    };

    const columns: ColumnDef<FiscalYear>[] = [
        { accessorKey: 'name', header: 'Nom de l\'exercice' },
        { accessorKey: 'startDate', header: 'Date de début', cell: ({ row }) => format(new Date(row.original.startDate), 'dd/MM/yyyy') },
        { accessorKey: 'endDate', header: 'Date de fin', cell: ({ row }) => format(new Date(row.original.endDate), 'dd/MM/yyyy') },
        { accessorKey: 'status', header: 'Statut', cell: ({ row }) => <Badge variant={row.original.status === 'Clôturé' ? 'destructive' : row.original.status === 'En cours' ? 'success' : 'default'}>{row.original.status}</Badge> },
        { id: 'actions', header: 'Actions', cell: ({ row }) => (
            <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleViewDetails(row.original)}><Eye className="h-4 w-4 mr-2"/>Détails</Button>
                {row.original.status === 'Ouvert' && <Button size="sm" onClick={() => handleStatusChange(row.original, 'En cours')}><Unlock className="h-4 w-4 mr-2"/>Activer</Button>}
                {row.original.status === 'En cours' && <Button size="sm" variant="destructive" onClick={() => handleStatusChange(row.original, 'Clôturé')}><Lock className="h-4 w-4 mr-2"/>Clôturer</Button>}
            </div>
        )},
    ];

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Liste des Exercices Comptables</CardTitle>
                    <Button onClick={() => setIsNewDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Nouvel Exercice</Button>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={years} />
                </CardContent>
            </Card>

            <NewFiscalYearDialog
                isOpen={isNewDialogOpen}
                onClose={() => setIsNewDialogOpen(false)}
                onSubmit={handleCreate}
            />

            <FiscalYearDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                year={selectedYear}
                allOrders={allOrders}
            />
        </>
    );
}