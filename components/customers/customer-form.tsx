import { Client } from '@/types/core';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, Trash2, X } from 'lucide-react';
import { Switch } from '../ui/switch';
import React, { useEffect } from 'react';

interface CustomerFormProps {
    initialData: Client | null;
    onSave: (data: Client) => void;
    onDelete?: (id: string) => void;
    onCancel: () => void;
}

export function CustomerForm({ initialData, onSave, onDelete, onCancel }: CustomerFormProps) {
    const form = useForm<Client>({
        defaultValues: initialData || { isActive: true, isTaxable: true, balance: 0 },
    });
    const isNew = !initialData?.id;

    useEffect(() => {
        if (initialData) {
            form.reset(initialData);
        } else {
            form.reset({ companyName: '', code: '', contactPerson: '', phone: '', email: '', isActive: true, isTaxable: true, balance: 0 });
        }
    }, [initialData, form]);
    
    const onSubmit = (data: Client) => {
        onSave(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col bg-white">
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {isNew ? "Nouveau Client" : "Profil Client"}
                        </h2>
                        {isNew && (
                            <Button variant="ghost" size="icon" type="button" onClick={onCancel}>
                                <X size={20} />
                            </Button>
                        )}
                    </div>
                    {initialData && (
                        <p className="text-sm text-gray-600 mt-1">
                            Solde: <span className={initialData.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {initialData.balance.toLocaleString('fr-FR')} FCFA
                            </span>
                        </p>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
                     <div className="flex items-center space-x-8 pt-4">
                        <FormField control={form.control} name="isTaxable" render={({ field }) => (
                            <FormItem className="flex items-center gap-2 space-y-0"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Assujeti à la TVA</FormLabel></FormItem>
                        )} />
                        <FormField control={form.control} name="isActive" render={({ field }) => (
                            <FormItem className="flex items-center gap-2 space-y-0"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Client Actif</FormLabel></FormItem>
                        )} />
                    </div>
                </div>

                <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                    {!isNew && onDelete && (
                         <Button type="button" variant="destructive" onClick={() => onDelete(initialData.id)}>
                            <Trash2 size={16} />
                            <span>Supprimer</span>
                        </Button>
                    )}
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        <Save size={16} />
                        <span>{form.formState.isSubmitting ? "Enregistrement..." : (isNew ? "Enregistrer" : "Mettre à jour")}</span>
                    </Button>
                </div>
            </form>
        </Form>
    );
}