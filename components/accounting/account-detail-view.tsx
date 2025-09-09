"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import {  Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Save, Trash2, ArrowLeft } from 'lucide-react';
import { Account } from '@/types/accounting';

interface AccountDetailViewProps {
  account: Account | null;
  onSave: (data: Account) => void;
  onDelete: () => void;
  onBack: () => void;
}

export const AccountDetailView: React.FC<AccountDetailViewProps> = ({
  account,
  onSave,
  onDelete,
  onBack,
}) => {
  const form = useForm<Account>({
    defaultValues: account || {
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

  const onSubmit = (data: Account) => {
    onSave(data);
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          <div className="flex gap-2">
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
            <Button onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};