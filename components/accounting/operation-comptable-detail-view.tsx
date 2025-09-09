// components/accounting/operation-comptable-detail-view.tsx
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {  Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Save, Trash2, ArrowLeft } from 'lucide-react';
import { OperationComptable } from '@/types/accounting';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface OperationComptableDetailViewProps {
  operation: OperationComptable | null;
  onSave: (data: OperationComptable) => void;
  onDelete: () => void;
  onBack: () => void;
}

const operationTypeMap = {
  SALE: 'Vente',
  PURCHASE: 'Achat',
  PAYMENT: 'Paiement',
  RECEIPT: 'Reçu',
  TRANSFER: 'Transfert',
};

const paymentMethodMap = {
  CASH: 'Espèces',
  CREDIT: 'Crédit',
  BANK_TRANSFER: 'Virement Bancaire',
  CHECK: 'Chèque',
  MOBILE_MONEY: 'Mobile Money',
};

const accountingSenseMap = {
  DEBIT: 'Débit',
  CREDIT: 'Crédit',
};

const amountTypeMap = {
  HT: 'Hors Taxes',
  TTC: 'Toutes Taxes Comprises',
  TVA: 'Taxe sur la Valeur Ajoutée',
  PAU: 'Prix d\'Achat Unitaire',
};

export const OperationComptableDetailView: React.FC<OperationComptableDetailViewProps> = ({
  operation,
  onSave,
  onDelete,
  onBack,
}) => {
  const form = useForm<OperationComptable>({
    defaultValues: operation || {
      typeOperation: 'SALE',
      modeReglement: 'CASH',
      comptePrincipal: '',
      estCompteStatique: false,
      sensPrincipal: 'DEBIT',
      journalComptableId: crypto.randomUUID() as string,
      typeMontant: 'HT',
      plafondClient: 0,
      actif: true,
      notes: '',
    },
  });

  const onSubmit = (data: OperationComptable) => {
    onSave(data);
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="typeOperation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type d'Opération *</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(operationTypeMap).map(([code, label]) => (
                        <SelectItem key={code} value={code}>
                          {label}
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
            name="modeReglement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mode de Règlement *</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(paymentMethodMap).map(([code, label]) => (
                        <SelectItem key={code} value={code}>
                          {label}
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
            name="sensPrincipal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sens Principal *</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un sens" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(accountingSenseMap).map(([code, label]) => (
                        <SelectItem key={code} value={code}>
                          {label}
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
            name="typeMontant"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de Montant *</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(amountTypeMap).map(([code, label]) => (
                        <SelectItem key={code} value={code}>
                          {label}
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
            name="comptePrincipal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Compte Principal *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="estCompteStatique"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Compte Statique</FormLabel>
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
            name="plafondClient"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plafond Client</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
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