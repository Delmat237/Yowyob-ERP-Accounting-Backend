"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Account } from '@/types/accounting';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AccountingFormProps {
  initialData: Partial<Account> | null;
  onSave: (data: Account) => void;
}

export function AccountingForm({ initialData, onSave }: AccountingFormProps) {
  const form = useForm<Account>({
    defaultValues: initialData || {
      id: '',
      noCompte: '',
      libelle: '',
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
      noCompte: '',
      libelle: '',
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

  const journalTypeOptions = [
    'Journal des ventes',
    'Journal des achats',
    'Journal des opérations diverses',
    'Journal de trésorerie',
  ];

  const amountTypeOptions = [
    'Montant TTC',
    'Montant HT',
    'Montant TVA',
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col rounded-lg shadow-lg bg-white overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
         

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="noCompte"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: 411000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="libelle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du compte <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Clients" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: ACTIF" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="journalType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de journal</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type de journal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {journalTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de montant</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type de montant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {amountTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <FormField
              control={form.control}
              name="allowEntry"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Autoriser l&#39;écriture</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isStatic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Compte statique</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} placeholder="Informations supplémentaires..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="p-4 border-t flex justify-end bg-gray-50 rounded-b-lg">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            <Save size={16} className="mr-2" />
            <span>{form.formState.isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}