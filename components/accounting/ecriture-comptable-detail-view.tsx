// components/accounting/ecriture-comptable-detail-view.tsx
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import {  Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {Button} from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Trash2, ArrowLeft, Check } from 'lucide-react';
import { EcritureComptable,UUID } from '@/types/accounting';

interface EcritureComptableDetailViewProps {
  ecriture: EcritureComptable | null;
  onSave: (data: EcritureComptable) => void;
  onDelete: () => void;
  onValidate: () => void;
  onBack: () => void;
}

export const EcritureComptableDetailView: React.FC<EcritureComptableDetailViewProps> = ({
  ecriture,
  onSave,
  onDelete,
  onValidate,
  onBack,
}) => {
  const form = useForm<EcritureComptable>({
    defaultValues: ecriture || {
      libelle: '',
      dateEcriture: new Date(),
      journalComptableId: crypto.randomUUID() as UUID,
      periodeComptableId: crypto.randomUUID() as UUID,
      montantTotalDebit: 0,
      montantTotalCredit: 0,
      validee: false,
      referenceExterne: '',
      notes: '',
      detailsEcriture: [{ compteId: crypto.randomUUID() as UUID, libelle: '', montantDebit: 0, montantCredit: 0 }],
    },
  });

  const onSubmit = (data: EcritureComptable) => {
    onSave(data);
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            name="dateEcriture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Écriture *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value.toISOString().split('T')[0]} onChange={(e) => field.onChange(new Date(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="journalComptableId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Journal Comptable *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="periodeComptableId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Période Comptable *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="montantTotalDebit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Montant Débit *</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="montantTotalCredit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Montant Crédit *</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="referenceExterne"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Référence Externe</FormLabel>
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
            {!ecriture?.validee && (
              <Button variant="destructive" onClick={onDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            )}
            <Button onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            {!ecriture?.validee && (
              <Button onClick={onValidate}>
                <Check className="mr-2 h-4 w-4 text-green-600" />
                Valider
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};