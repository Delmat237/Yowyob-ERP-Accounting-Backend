"use client";

import { Product } from '@/types/core';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, Trash2, X } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';

interface ProductFormProps {
    initialData: Product | null;
    onCancel: () => void;
}

export function ProductForm({ initialData, onCancel }: ProductFormProps) {
    const form = useForm<Product>({ defaultValues: initialData || { isActive: true, isDiscountable: true, isPerishable: false } });
    const isNew = !initialData;
    
    return (
        <Form {...form}>
            <form className="h-full flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {isNew ? "Créer un nouvel article" : "Modifier l'article"}
                        </h2>
                        {isNew && (
                            <Button variant="ghost" size="icon" onClick={onCancel}>
                                <X className="h-5 w-5" />
                            </Button>
                        )}
                    </div>
                     <p className="text-gray-600 mt-1">
                        {isNew ? "Remplissez les informations ci-dessous." : `Modification de ${initialData?.name}`}
                    </p>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <FormField name="name" render={({ field }) => (<FormItem className="col-span-2"><FormLabel>Libellé de l'article</FormLabel><Input {...field} /></FormItem>)} />
                        <FormField name="code" render={({ field }) => (<FormItem><FormLabel>Code Vente</FormLabel><Input {...field} /></FormItem>)} />
                        <FormField name="supplierRef" render={({ field }) => (<FormItem><FormLabel>Réf. Fournisseur</FormLabel><Input {...field} /></FormItem>)} />
                        
                        <FormField name="family" render={({ field }) => (
                            <FormItem><FormLabel>Famille</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionner..."/></SelectTrigger></FormControl><SelectContent><SelectItem value="Visserie">Visserie</SelectItem><SelectItem value="Peinture">Peinture</SelectItem></SelectContent></Select></FormItem>
                        )}/>
                        <FormField name="mainSupplier" render={({ field }) => (
                            <FormItem><FormLabel>Fournisseur Principal</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionner..."/></SelectTrigger></FormControl><SelectContent><SelectItem value="Fournisseur Principal SA">Fournisseur Principal SA</SelectItem></SelectContent></Select></FormItem>
                        )}/>
                    </div>
                    
                    <Separator />

                    <div>
                        <h4 className="font-medium text-gray-800 mb-3">Options</h4>
                        <div className="space-y-4">
                            <FormField name="isDiscountable" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><FormLabel>Remise Autorisée ?</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl></FormItem>)} />
                            <FormField name="isPerishable" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><FormLabel>Produit Périssable ?</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl></FormItem>)} />
                            <FormField name="isActive" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><FormLabel>Article Actif ?</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl></FormItem>)} />
                        </div>
                    </div>
                </div>
                
                <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
                    {!isNew && <Button type="button" variant="destructive"><Trash2 className="h-4 w-4 mr-2"/>Supprimer</Button>}
                    <Button type="submit"><Save className="h-4 w-4 mr-2"/>{isNew ? "Enregistrer l'article" : "Mettre à jour"}</Button>
                </div>
            </form>
        </Form>
    );
}