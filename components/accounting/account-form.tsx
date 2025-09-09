import { Account } from '@/types/accounting';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { Switch } from '../ui/switch';
import React, { useEffect } from 'react';

interface AccountingFormProps {
    initialData: Partial<Account> | null;
    onSave: (data: Account) => void;
}

export function AccountingForm({ initialData, onSave }: AccountingFormProps) {
    const form = useForm<Account>({
        defaultValues: initialData || {
            id: '',
            code: '',
            name: '',
            type: '',
            allowEntry: false,
            view: 'Vue',
            isStatic: false,
            journalType: 'Journal des ventes',
            amountType: 'Montant TTC',
        },
    });

    useEffect(() => {
        form.reset(initialData || {
            id: '',
            code: '',
            name: '',
            type: '',
            allowEntry: false,
            view: 'Vue',
            isStatic: false,
            journalType: 'Journal des ventes',
            amountType: 'Montant TTC',
        });
    }, [initialData, form]);

    const onSubmit = (data: Account) => {
        onSave(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Code *</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom du compte *</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type *</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="allowEntry"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-2 space-y-0">
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel>Autoriser l'écriture</FormLabel>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isStatic"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-2 space-y-0">
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel>Compte statique</FormLabel>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="journalType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type de journal</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="amountType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type de montant</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Notes</FormLabel>
                                <FormControl>
                                    <Textarea {...field} rows={3} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="p-4 border-t bg-gray-50 flex justify-end">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        <Save size={16} className="mr-2" />
                        <span>{form.formState.isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}</span>
                    </Button>
                </div>
            </form>
        </Form>
    );
}