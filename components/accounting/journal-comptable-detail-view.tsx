// components/accounting/journal-comptable-detail-view.tsx
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import {Button } from '@/components/ui/button';
import {  Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Save, Trash2, ArrowLeft } from 'lucide-react';
import { JournalComptable } from '@/types/accounting';

interface JournalComptableDetailViewProps {
  journal: JournalComptable | null;
  onSave: (data: JournalComptable) => void;
  onDelete: () => void;
  onBack: () => void;
}

export const JournalComptableDetailView: React.FC<JournalComptableDetailViewProps> = ({
  journal,
  onSave,
  onDelete,
  onBack,
}) => {
  const form = useForm<JournalComptable>({
    defaultValues: journal || {
      codeJournal: '',
      libelle: '',
      typeJournal: '',
      notes: '',
      actif: true,
    },
  });

  const onSubmit = (data: JournalComptable) => {
    onSave(data);
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="codeJournal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code Journal *</FormLabel>
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
                <FormLabel>Libellé *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="typeJournal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type Journal *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
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
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="actif"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Actif</FormLabel>
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
            {!journal?.ecritureComptable?.length && (
              <Button variant="destructive" onClick={onDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            )}
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