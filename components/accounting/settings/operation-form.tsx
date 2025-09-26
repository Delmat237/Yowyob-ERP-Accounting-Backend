// components/accounting/operation-form.tsx
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Save, PlusCircle, Trash2, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { OperationComptable } from '@/types/accounting';

interface OperationFormProps {
  initialData: Partial<OperationComptable> | null;
  onSave: (data: OperationComptable) => void;
  onCancel: () => void;
}

export const OperationForm: React.FC<OperationFormProps> = ({ initialData, onSave, onCancel }) => {
  const form = useForm<OperationComptable>({
    defaultValues: initialData || {
      typeOperation: 'VENTE',
      modeReglement: 'CCE',
      sensPrincipal: 'DEBIT',
      comptePrincipal: '',
      estCompteStatique: true,
      typeMontant: 'TTC',
      journalComptableId: 'VENTES',
      counterpartyDetails: [{ account: '', isTiers: false, amountType: 'TTC', journalType: 'VENTES', debitOrCredit: 'DEBIT' }],
    },
  });

  const onSubmit = (data: OperationComptable) => {
    onSave(data);
  };

  const addCounterparty = () => {
    const currentCounterparties = form.getValues('counterpartyDetails') || [];
    form.setValue('counterpartyDetails', [
      ...currentCounterparties,
      { account: '', isTiers: false, amountType: 'TTC', journalType: 'VENTES', debitOrCredit: 'DEBIT' },
    ]);
  };

  const removeCounterparty = (index: number) => {
    const newCounterparties = [...form.getValues('counterpartyDetails')];
    newCounterparties.splice(index, 1);
    form.setValue('counterpartyDetails', newCounterparties);
  };

  const counterpartyDetails = form.watch('counterpartyDetails');

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg" >
      <CardHeader className="bg-gray-50 py-4">
        <CardDescription>
          Paramétrez une nouvelle opération comptable en définissant les comptes et les règles associées.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-auto rounded-none p-0">
                <TabsTrigger
                  value="general"
                  className="rounded-none data-[state=active]:bg-gray-100 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                >
                  GÉNÉRAL
                </TabsTrigger>
                <TabsTrigger
                  value="comptes"
                  className="rounded-none data-[state=active]:bg-gray-100 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                >
                  COMPTES
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="typeOperation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quand on :  *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || 'VENTE'}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="VENTE">Vend à un client</SelectItem>
                            <SelectItem value="ACHAT">Achète à un fournisseur</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="modeReglement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mode de règlement *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || 'CCE'}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un mode" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CCE">au comptant par espèces</SelectItem>
                            <SelectItem value="CCB">au comptant par chèque bancaire</SelectItem>
                            <SelectItem value="CCP">au comptant par chèque postal</SelectItem>
                            <SelectItem value="CREDIT">par credit</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="sensPrincipal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>On doit  *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || 'DEBIT'}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="DEBIT">Débiter</SelectItem>
                            <SelectItem value="CREDIT">Créditer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="journalComptableId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>dans le  journal *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || 'VENTES'}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un journal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="VENTES">Journal des ventes</SelectItem>
                            <SelectItem value="ACHATS">Journal des achats</SelectItem>
                            <SelectItem value="DIVERS">Journal des opérations diverses</SelectItem>
                            <SelectItem value="TRESORERIE">Journal de trésorerie</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="comptePrincipal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compte principal *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="ex. 57xxxx" />
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
                        <FormControl>
                          <Input {...field} placeholder="Compte Social" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="typeMontant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de montant *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || 'TTC'}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="TTC">Montant Toutes Taxes Comprises</SelectItem>
                            <SelectItem value="HT">Montant Hors Taxe</SelectItem>
                            <SelectItem value="TVA">Montant Taxe sur la Valeur Ajoutée</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="estCompteStatique"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Compte statique</FormLabel>
                          <FormDescription>
                            Cochez pour un compte qui ne varie pas (ex: caisse).
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="comptes" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Choix des comptes à mouvementer avec leur nature</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addCounterparty}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter
                  </Button>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto p-2">
                  {counterpartyDetails?.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Aucune contrepartie ajoutée.</p>
                  ) : (
                    counterpartyDetails?.map((counterparty, index) => (
                      <Collapsible key={index} defaultOpen className="rounded-lg border bg-white shadow-sm">
                        <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 font-medium">
                          <h4 className="text-sm text-gray-700">
                            Compte contrepartie : <span className="font-bold">{counterparty.account || "Non défini"}</span>
                          </h4>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-white hover:bg-red-500"
                              onClick={(e) => { e.stopPropagation(); removeCounterparty(index); }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 ui-open:rotate-180" />
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-4 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                          <div className="border-t p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name={`counterpartyDetails.${index}.account`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Compte contrepartie</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="ex. 411xxxx" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`counterpartyDetails.${index}.isTiers`}
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50">
                                    <div className="space-y-0.5">
                                      <FormLabel>Compte tiers</FormLabel>
                                      <FormDescription>
                                        Cochez pour un compte tiers (client ou fournisseur).
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name={`counterpartyDetails.${index}.amountType`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Type de montant</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || 'TTC'}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Sélectionner un type" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="TTC">Montant Toutes Taxes Comprises</SelectItem>
                                        <SelectItem value="HT">Montant Hors Taxe</SelectItem>
                                        <SelectItem value="TVA">Montant Taxe sur la Valeur Ajoutée</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`counterpartyDetails.${index}.journalType`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Dans le journal</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || 'VENTES'}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Sélectionner un journal" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="VENTES">Journal des ventes</SelectItem>
                                        <SelectItem value="ACHATS">Journal des achats</SelectItem>
                                        <SelectItem value="DIVERS">Journal des opérations diverses</SelectItem>
                                        <SelectItem value="TRESORERIE">Journal de trésorerie</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={form.control}
                              name={`counterpartyDetails.${index}.debitOrCredit`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nature</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value || 'DEBIT'}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un sens" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="DEBIT">Débiter</SelectItem>
                                      <SelectItem value="CREDIT">Créditer</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex justify-end gap-2 p-6 border-t bg-gray-50">
              <Button type="button" variant="outline" onClick={onCancel}>
                ANNULER
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                ENREGISTRER
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};