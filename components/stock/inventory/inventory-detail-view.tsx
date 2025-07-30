"use client";

import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Inventory, InventoryItem } from '@/types/stock';
import { ColumnDef } from '@tanstack/react-table';
import { Save, CheckCircle, Edit, Printer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface InventoryDetailViewProps {
    inventory: Inventory;
    onSave: (inventoryId: string, items: InventoryItem[]) => void;
    onValidate: (inventory: Inventory) => void;
}

export function InventoryDetailView({ inventory, onSave, onValidate }: InventoryDetailViewProps) {
    const isReadOnly = inventory.status === 'Validé';
    const form = useForm<{ items: InventoryItem[] }>({
        defaultValues: { items: inventory.items }
    });
    const { control, handleSubmit } = form;
    const { fields } = useFieldArray({ control, name: "items" });

    const columns: ColumnDef<InventoryItem>[] = [
        { accessorKey: "productCode", header: "Code" },
        { accessorKey: "productName", header: "Libellé", cell: ({row}) => <div className='w-[250px] truncate'>{row.original.productName}</div>},
        { accessorKey: "theoreticalQty", header: "Stock Mach.", cell: ({row}) => <div className='text-center'>{row.original.theoreticalQty}</div>},
        {
            accessorKey: 'physicalQty', header: 'Stock Phys.', cell: ({ row, table }) => (
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
            )
        },
        {
            id: 'discrepancy', header: 'Écart', cell: ({ row }) => {
                const physical = row.original.physicalQty;
                const theoretical = row.original.theoreticalQty;
                const discrepancy = physical !== null ? physical - theoretical : null;
                const color = discrepancy === null ? '' : discrepancy > 0 ? 'text-green-600' : discrepancy < 0 ? 'text-red-600' : '';
                return <div className={`text-center font-bold ${color}`}>{discrepancy}</div>;
            }
        }
    ];

    const onSubmit = (data: { items: InventoryItem[] }) => {
        onSave(inventory.id, data.items);
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <div className='flex justify-between items-start'>
                    <div>
                        <CardTitle>Détail de l'Inventaire : {inventory.reference}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Date: {format(new Date(inventory.date), 'dd/MM/yyyy')} | Statut: <Badge>{inventory.status}</Badge>
                        </p>
                    </div>
                    {inventory.status === 'En cours' && <Button onClick={() => onValidate(inventory)}><CheckCircle className="mr-2 h-4 w-4"/>Valider l'inventaire</Button>}
                </div>
            </CardHeader>
            <CardContent className='flex-grow overflow-y-auto'>
                <form id={`inventory-form-${inventory.id}`} onSubmit={handleSubmit(onSubmit)}>
                    <DataTable columns={columns} data={fields} />
                </form>
            </CardContent>
            <CardFooter className="justify-end gap-2">
                <Button variant="outline"><Printer className="mr-2 h-4 w-4" /> Imprimer</Button>
                {!isReadOnly && <Button type="submit" form={`inventory-form-${inventory.id}`}><Save className="mr-2 h-4 w-4" /> Enregistrer les saisies</Button>}
            </CardFooter>
        </Card>
    );
}