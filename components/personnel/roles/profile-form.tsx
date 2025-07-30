"use client";

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Profile } from '@/types/personnel';
import { Warehouse } from '@/types/stock';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

interface ProfileFormProps {
    initialData: Partial<Profile> | null;
    isCreating: boolean;
    warehouses: Warehouse[];
    onSave: (data: Profile) => void;
    onDelete: (id: string) => void;
    onCancel: () => void;
}

const ALL_PRICES = [ { id: 'PVD', label: 'Prix vente détail' }, { id: 'PVDG', label: 'Prix vente demi gros' }, { id: 'PVG', label: 'Prix vente gros' }, { id: 'PVSG', label: 'Prix vente super gros' }];
const ALL_PAYMENT_MODES = [ { id: 'CC', label: 'par Chèque' }, { id: 'CP', label: 'par Compte' }, { id: 'CR', label: 'par Carte' }, { id: 'CE', label: 'par Espèces' }, { id: 'VIR', label: 'par Virement' }];
const ALL_DISCOUNTS = [ { id: 'Rem', label: 'Remise' }, { id: 'RemEx', label: 'Remise Exceptionnelle' }];
const ALL_MENUS = [
    { id: 'stock_status', label: "État des stocks" }, { id: 'stock_journal', label: "Journal des mouvements" }, { id: 'stock_entries', label: "Entrées/Sorties de stock" }, { id: 'stock_inventory', label: "Inventaire" }, { id: 'sales_new_order', label: "Saisie Commande" }
];

export function ProfileForm({ initialData, isCreating, warehouses, onSave, onDelete, onCancel }: ProfileFormProps) {
    const form = useForm<Profile>({ defaultValues: { ...initialData, permissions: initialData?.permissions || {} } });
    
    const { fields } = useFieldArray({ control: form.control, name: "permissions" as never });

    const onSubmit = (data: Profile) => { onSave(data); };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col gap-4">
                <Card>
                    <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Nom du Profil</FormLabel><Input {...field} /></FormItem>)} />
                        <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><Input {...field} /></FormItem>)} />
                    </CardContent>
                </Card>

                <Card className="flex-grow flex flex-col min-h-0">
                    <CardContent className="p-2 h-full">
                        <Tabs defaultValue="profile" className="h-full flex flex-col">
                            <TabsList className="flex-shrink-0 flex-wrap h-auto">
                                <TabsTrigger value="profile">Détail Profil</TabsTrigger>
                                <TabsTrigger value="prices">Prix autorisés</TabsTrigger>
                                <TabsTrigger value="warehouses">Magasins autorisés</TabsTrigger>
                                <TabsTrigger value="payments">Modes règlement</TabsTrigger>
                                <TabsTrigger value="discounts">Remises autorisées</TabsTrigger>
                            </TabsList>
                            <div className="flex-grow overflow-y-auto mt-2">
                                <TabsContent value="profile"><PermissionEditor form={form} /></TabsContent>
                                <TabsContent value="prices"><CheckboxGroupEditor form={form} fieldName="authorizedPrices" options={ALL_PRICES} /></TabsContent>
                                <TabsContent value="warehouses"><CheckboxGroupEditor form={form} fieldName="authorizedWarehouses" options={warehouses.map(w => ({id: w.id, label: w.name}))} /></TabsContent>
                                <TabsContent value="payments"><CheckboxGroupEditor form={form} fieldName="authorizedPaymentModes" options={ALL_PAYMENT_MODES} /></TabsContent>
                                <TabsContent value="discounts"><CheckboxGroupEditor form={form} fieldName="authorizedDiscounts" options={ALL_DISCOUNTS} /></TabsContent>
                            </div>
                        </Tabs>
                    </CardContent>
                    <CardFooter className="justify-between border-t pt-4">
                        <Button type="button" variant="ghost" onClick={onCancel}>Annuler</Button>
                        <div>
                            {!isCreating && initialData?.id && <Button type="button" variant="destructive" className="mr-2" onClick={() => onDelete(initialData.id!)}>Supprimer</Button>}
                            <Button type="submit">Enregistrer</Button>
                        </div>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}

function PermissionEditor({ form }: { form: any }) {
    const columns: ColumnDef<any>[] = [
        { accessorKey: 'label', header: 'Menu' },
        ...(['read', 'create', 'update', 'delete'] as const).map(action => ({
            id: action,
            header: action.charAt(0).toUpperCase() + action.slice(1),
            cell: ({ row }: any) => {
                const fieldName = `permissions.${row.original.id}.${action}`;
                return <FormField control={form.control} name={fieldName} render={({ field }) => (
                    <FormItem className='flex justify-center'><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                )} />;
            }
        }))
    ];
    return <DataTable columns={columns} data={ALL_MENUS} />;
}

function CheckboxGroupEditor({ form, fieldName, options }: { form: any, fieldName: keyof Profile, options: {id: string, label: string}[] }) {
    return (
        <div className="space-y-2 p-4">
            {options.map(option => (
                <FormField
                    key={option.id}
                    control={form.control}
                    name={fieldName}
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0 p-2 border rounded-md">
                             <FormControl>
                                <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                        return checked
                                            ? field.onChange([...field.value, option.id])
                                            : field.onChange(field.value?.filter((value: string) => value !== option.id))
                                    }}
                                />
                            </FormControl>
                            <FormLabel className="font-normal">{option.label}</FormLabel>
                        </FormItem>
                    )}
                />
            ))}
        </div>
    );
}