"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Save, Trash2, ArrowLeft } from 'lucide-react';
import { Account ,UUID} from '@/types/accounting';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Define form-specific defaults that align with Account type
const defaultAccountValues: Partial<Account> = {
  noCompte: '',
  libelle: '',
  type: '',
  allowEntry: false,
  view: 'Vue',
  isStatic: false,
  journalType: 'Journal des ventes',
  amountType: 'Montant TTC',
};

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
  // Explicitly type the useForm with Account and provide a resolver if needed
  const form = useForm<Account>({
    defaultValues: account || defaultAccountValues as Account,
    // Optionally add a resolver like yup if validation is complex
    // resolver: yupResolver(schema), // Uncomment and define schema if needed
  });

  const onSubmit = (data: Account) => {
    // Ensure all required fields are present before saving
    const validatedData: Account = {
      ...data,
      id: data.id || crypto.randomUUID() as UUID, // Generate ID if not present
      noCompte: data.noCompte || '', // Ensure noCompte is set
      libelle: data.libelle || '', // Ensure libelle is set
    };
    onSave(validatedData);
  };

  // Predefined options for journalType and amountType
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
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="noCompte"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Type <span className="text-red-500">*</span></FormLabel>
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
                <FormLabel>Autoriser l&#39;écriture</FormLabel>
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type de journal" />
                    </SelectTrigger>
                    <SelectContent>
                      {journalTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
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
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type de montant" />
                    </SelectTrigger>
                    <SelectContent>
                      {amountTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
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