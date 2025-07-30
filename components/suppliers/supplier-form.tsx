"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Supplier } from '@/types/core';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface SupplierFormProps {
    initialData: Partial<Supplier> | null;
    onSave: (data: Supplier) => void;
    onDelete?: (id: string) => void;
    onCancel: () => void;
}

export function SupplierForm({ initialData, onSave, onDelete, onCancel }: SupplierFormProps) {
    const form = useForm<Supplier>({
        defaultValues: { ...initialData, isActive: initialData?.isActive ?? true, balance: initialData?.balance ?? 0 },
    });
    const isNew = !initialData?.id;

    useEffect(() => {
        form.reset({ ...initialData, isActive: initialData?.isActive ?? true, balance: initialData?.balance ?? 0 });
    }, [initialData, form]);
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave as any)} className="h-full flex flex-col">
                <Card className="h-full flex flex-col">
                    <CardHeader>
                        <CardTitle>{isNew ? "Nouveau Fournisseur" : "Profil Fournisseur"}</CardTitle>
                        {initialData?.companyName && (
                            <p className="text-sm text-gray-600 mt-1">
                                Solde: <span className={initialData.balance! >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    {initialData.balance!.toLocaleString('fr-FR')} FCFA
                                </span>
                            </p>
                        )}
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4 overflow-y-auto">
                        <FormField control={form.control} name="companyName" render={({ field }) => (
                            <FormItem><FormLabel>Raison sociale *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="code" render={({ field }) => (
                                <FormItem><FormLabel>Code *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="contactPerson" render={({ field }) => (
                                <FormItem><FormLabel>Contact</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                            )} />
                            <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem><FormLabel>Téléphone</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="notes" render={({ field }) => (
                            <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="isActive" render={({ field }) => (
                            <FormItem className="flex items-center gap-2 pt-4"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Fournisseur Actif</FormLabel></FormItem>
                        )} />
                    </CardContent>
                    <CardFooter className="justify-between border-t pt-4">
                        <Button type="button" variant="ghost" onClick={onCancel}>{isNew ? "Annuler" : "Fermer"}</Button>
                        <div className="flex gap-2">
                             {!isNew && onDelete && initialData?.id && (
                                <Button type="button" variant="destructive" onClick={() => onDelete(initialData.id!)}>
                                    <Trash2 size={16} className="mr-2" />Supprimer
                                </Button>
                            )}
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                <Save size={16} className="mr-2" />
                                {form.formState.isSubmitting ? "Enregistrement..." : (isNew ? "Enregistrer" : "Mettre à jour")}
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}