"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { getJounalComptables, getAccounts } from '@/lib/api';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  const [journals, setJournals] = useState<{ id: string; libelle: string }[]>([]);
  const [accounts, setAccounts] = useState<{ id: string; libelle: string }[]>([]);
  const [isLoadingJournals, setIsLoadingJournals] = useState(true);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  const form = useForm<OperationComptable>({
    defaultValues: operation || {
      typeOperation: 'SALE',
      modeReglement: 'CASH',
      comptePrincipal: '',
      estCompteStatique: false,
      sensPrincipal: 'DEBIT',
      journalComptableId: '',
      typeMontant: 'HT',
      plafondClient: 0,
      actif: true,
      notes: '',
    },
    resolver: undefined, // Ajouter une validation si nécessaire (ex. zod)
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [journalResponse, accountResponse] = await Promise.all([getJounalComptables(), getAccounts()]);
        setJournals(journalResponse.data.map((j) => ({ id: j.id!, libelle: j.libelle })));
        setAccounts(accountResponse.data.map((a) => ({ id: a.id!, libelle: a.libelle })));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoadingJournals(false);
        setIsLoadingAccounts(false);
      }
    };
    fetchData();
  }, []);

  const onSubmit = (data: OperationComptable) => {
    if (!data.comptePrincipal || !data.journalComptableId) {
      form.setError('comptePrincipal', { message: 'Le compte principal est requis' });
      form.setError('journalComptableId', { message: 'Le journal comptable est requis' });
      return;
    }
    onSave(data);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="typeOperation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type d'Opération <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(operationTypeMap).map(([code, label]) => (
                        <SelectItem key={code} value={code}>{label}</SelectItem>
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
                <FormLabel>Mode de Règlement <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(paymentMethodMap).map(([code, label]) => (
                        <SelectItem key={code} value={code}>{label}</SelectItem>
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
                <FormLabel>Sens Principal <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un sens" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(accountingSenseMap).map(([code, label]) => (
                        <SelectItem key={code} value={code}>{label}</SelectItem>
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
                <FormLabel>Type de Montant <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(amountTypeMap).map(([code, label]) => (
                        <SelectItem key={code} value={code}>{label}</SelectItem>
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
                <FormLabel>Compte Principal <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value || ''} disabled={isLoadingAccounts}>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingAccounts ? "Chargement..." : "Sélectionner un compte"} />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>{account.libelle}</SelectItem>
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
            name="estCompteStatique"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
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
                <FormLabel>ID Journal Comptable <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value || ''} disabled={isLoadingJournals}>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingJournals ? "Chargement..." : "Sélectionner un journal"} />
                    </SelectTrigger>
                    <SelectContent>
                      {journals.map((journal) => (
                        <SelectItem key={journal.id} value={journal.id}>{journal.libelle}</SelectItem>
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
            name="plafondClient"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plafond Client</FormLabel>
                <FormControl>
                  <Input type="number" {...field} placeholder="0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="actif"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
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
                  <Input {...field} placeholder="Notes supplémentaires" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                    <Save className="mr-2 h-4 w-4" /> Enregistrer
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Sauvegarder les modifications</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="destructive" onClick={onDelete}>
                    <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Supprimer l&#39;opération</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={onBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Retour
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Revenir à la liste</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </form>
      </Form>
    </div>
  );
};