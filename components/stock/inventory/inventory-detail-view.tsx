"use client";

import React, { useEffect } from 'react';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Inventory, InventoryItem } from '@/types/stock';
import { ColumnDef } from '@tanstack/react-table';
import { Save, CheckCircle, Trash2, Printer, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

interface InventoryDetailViewProps {
    inventory: Inventory;
    onSave: (inventoryId: string, items: InventoryItem[]) => void;
    onValidate: () => void;
    onDelete: () => void;
    onBack: () => void;
}

export function InventoryDetailView({ inventory, onSave, onValidate, onDelete, onBack }: InventoryDetailViewProps) {
    const isReadOnly = inventory.status === 'Validé';
    
    const form = useForm<{ items: InventoryItem[] }>({
        defaultValues: { items: inventory.items }
    });

    const { control, handleSubmit, formState } = form;
    const { fields } = useFieldArray({ control, name: "items" });
    const watchedItems = useWatch({ control, name: "items" });

    useEffect(() => {
        form.reset({ items: inventory.items });
    }, [inventory, form]);

    const columns: ColumnDef<InventoryItem>[] = [
        { accessorKey: "productCode", header: "Code" },
        { accessorKey: "productName", header: "Libellé", cell: ({row}) => <div className='w-[250px] truncate'>{row.original.productName}</div>},
        { accessorKey: "theoreticalQty", header: () => <div className="text-center">Stock Théorique</div>, cell: ({row}) => <div className='text-center'>{row.original.theoreticalQty}</div>},
        {
            accessorKey: 'physicalQty', 
            header: () => <div className="text-center">Stock Physique</div>,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <Controller
                        control={control}
                        name={`items.${row.index}.physicalQty`}
                        render={({ field }) => (
                            <Input
                                type="number"
                                {...field}
                                value={field.value ?? ''}
                                onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                                className="w-24 text-center"
                                readOnly={isReadOnly}
                            />
                        )}
                    />
                </div>
            )
        },
        {
            id: 'discrepancy', 
            header: () => <div className="text-center">Écart</div>,
            cell: ({ row }) => {
                const physical = watchedItems[row.index]?.physicalQty;
                const theoretical = row.original.theoreticalQty;
                const discrepancy = physical !== null && physical !== undefined ? physical - theoretical : null;
                const color = discrepancy === null ? '' : discrepancy > 0 ? 'text-green-600' : discrepancy < 0 ? 'text-red-600' : '';
                return <div className={`text-center font-bold ${color}`}>{discrepancy}</div>;
            }
        }
    ];

    const onSubmit = (data: { items: InventoryItem[] }) => {
        onSave(inventory.id, data.items);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm h-full flex flex-col">
            <div className="p-2 border-b flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="ghost" size="icon" disabled={isReadOnly} onClick={onDelete}><Trash2 className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon"><Printer className="h-5 w-5" /></Button>
            </div>
            <div className="p-4 border-b">
                 <h1 className="text-2xl font-semibold">Fiche d'inventaire : {inventory.reference}</h1>
                 <p className="text-sm text-gray-500">
                    Date: {format(new Date(inventory.date), 'dd MMMM yyyy')} | Statut: <Badge>{inventory.status}</Badge>
                </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
                <div className='flex-grow overflow-y-auto p-4'>
                    <DataTable columns={columns} data={fields} />
                </div>
                {!isReadOnly && (
                    <div className="p-4 border-t flex justify-end gap-2">
                        <Button type="submit" disabled={!formState.isDirty}>
                            <Save className="mr-2 h-4 w-4" /> Enregistrer les saisies
                        </Button>
                        <Button variant="destructive" onClick={onValidate}>
                            <CheckCircle className="mr-2 h-4 w-4"/> Valider l'inventaire
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}