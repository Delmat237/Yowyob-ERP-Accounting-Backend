"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/ui/data-table';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';
import { Product } from '@/types/core';
import { Warehouse, StockMovementItem } from '@/types/stock';
import { createStockMovement, updateProduct } from '@/lib/api';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Plus, Trash2, Save } from 'lucide-react';

interface StockMovementFormProps {
    products: Product[];
    warehouses: Warehouse[];
}

type FormValues = {
    type: 'entry' | 'exit';
    warehouseId: string;
    reference: string;
    date: Date;
    notes: string;
    items: (StockMovementItem & { code: string; name: string, stock: number })[];
};

export function StockMovementForm({ products, warehouses }: StockMovementFormProps) {
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState(1);
    
    const form = useForm<FormValues>({
        defaultValues: { type: 'entry', warehouseId: '', reference: '', date: new Date(), notes: '', items: [] }
    });
    const { control, handleSubmit, setValue, getValues, reset } = form;
    const { fields, append, remove } = useFieldArray({ control, name: "items" });

    const movementType = form.watch('type');
    const productOptions: ComboboxOption[] = useMemo(() => products.map(p => ({ value: p.id, label: `${p.code} - ${p.name}`})), [products]);
    const selectedProduct = useMemo(() => products.find(p => p.id === selectedProductId), [products, selectedProductId]);

    const handleAddItem = useCallback(() => {
        if (!selectedProduct) return;
        const existingItemIndex = fields.findIndex(item => item.productId === selectedProduct.id);
        if (existingItemIndex > -1) {
            // TODO: Update quantity if item already in list
            return;
        }
        append({
            productId: selectedProduct.id,
            code: selectedProduct.code,
            name: selectedProduct.name,
            quantity: quantity,
            costPrice: selectedProduct.costPrice,
            stock: selectedProduct.stock
        });
        setSelectedProductId('');
        setQuantity(1);
    }, [selectedProduct, quantity, append, fields]);

    const onSubmit = async (data: FormValues) => {
        if (data.items.length === 0) {
            alert("Veuillez ajouter au moins un article.");
            return;
        }
        
        const newMovement = {
            type: data.type,
            reference: data.reference || `${data.type.toUpperCase()}-${Date.now()}`,
            date: data.date.toISOString(),
            warehouseId: data.warehouseId,
            notes: data.notes,
            items: data.items.map(({ productId, quantity, costPrice }) => ({ productId, quantity, costPrice }))
        };

        try {
            await createStockMovement(newMovement);
            
            const stockUpdates = data.items.map(item => {
                const newStock = data.type === 'entry' ? item.stock + item.quantity : item.stock - item.quantity;
                return updateProduct(item.productId, { stock: newStock });
            });
            await Promise.all(stockUpdates);

            alert("Mouvement de stock enregistré avec succès !");
            reset();
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'enregistrement du mouvement.");
        }
    };

    const columns: ColumnDef<any>[] = [
        { accessorKey: "code", header: "Code" },
        { accessorKey: "name", header: "Libellé", cell: ({ row }) => <div className='w-[250px] truncate'>{row.original.name}</div> },
        { accessorKey: "quantity", header: "Qté" },
        { accessorKey: "costPrice", header: "P.U.", cell: ({ row }) => row.original.costPrice.toLocaleString() },
        { id: 'total', header: 'Total', cell: ({ row }) => (row.original.quantity * row.original.costPrice).toLocaleString() },
        { id: 'actions', cell: ({ row }) => <Button variant="ghost" size="icon" onClick={() => remove(row.index)}><Trash2 className="h-4 w-4 text-destructive"/></Button> }
    ];

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="h-full flex gap-4">
                <div className="flex flex-col h-full gap-4">
                    <Card>
                        <CardHeader><CardTitle>En-tête Gestion Stock</CardTitle></CardHeader>
                        <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <FormField control={control} name="type" render={({field}) => (<FormItem><FormLabel>Source mouvement</FormLabel><RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4 pt-2"><RadioGroupItem value="entry" id="t-entry"/><Label htmlFor="t-entry">Entrée</Label><RadioGroupItem value="exit" id="t-exit"/><Label htmlFor="t-exit">Sortie</Label></RadioGroup></FormItem>)}/>
                            <FormField control={control} name="warehouseId" render={({field}) => (<FormItem><FormLabel>Magasin *</FormLabel><Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Choisir un magasin..."/></SelectTrigger><SelectContent>{warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent></Select></FormItem>)}/>
                            <FormField control={control} name="reference" render={({field}) => (<FormItem><FormLabel>Nos références</FormLabel><Input {...field} /></FormItem>)}/>
                            <FormField control={control} name="notes" render={({field}) => (<FormItem ><FormLabel>Description / Notes</FormLabel><Textarea {...field} /></FormItem>)}/>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Critères de choix d'un article</CardTitle></CardHeader>
                        <CardContent className='grid grid-cols-2 gap-6'>
                            <div className='flex-grow'><Label>Code</Label><Combobox options={productOptions} value={selectedProductId} onChange={setSelectedProductId} placeholder="Rechercher un article..."/></div>
                            <div><Label>En stock</Label><Input value={selectedProduct?.stock ?? 0} readOnly className="w-24 bg-muted" /></div>
                            <div className='w-full'><Label>Quantité</Label><Input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-24" /></div>
                            <div><Label>P.U.</Label><Input value={selectedProduct?.costPrice.toLocaleString() ?? 0} readOnly className="w-32 bg-muted" /></div>
                            <Button type="button" onClick={handleAddItem} disabled={!selectedProduct}><Plus className="mr-2 h-4 w-4"/>Ajouter</Button>
                        </CardContent>
                    </Card>
                </div>

                <Card className="flex-grow flex flex-col min-h-0">
                    <CardHeader><CardTitle>Détail</CardTitle></CardHeader>
                    <CardContent className='flex-grow overflow-y-auto'>
                        <DataTable columns={columns} data={fields} />
                    </CardContent>
                    <CardContent className="border-t pt-4 flex justify-end">
                        <Button type="submit"><Save className="mr-2 h-4 w-4" />Enregistrer</Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}