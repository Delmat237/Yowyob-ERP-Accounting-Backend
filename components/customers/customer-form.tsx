// FILE: components/customers/customer-form.tsx
import { Client } from '@/types/core';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Trash2 } from 'lucide-react';
import { StatCard } from '../ui/stat-card';
import { Switch } from '../ui/switch';

interface CustomerFormProps {
    initialData: Client | null;
}

export function CustomerForm({ initialData }: CustomerFormProps) {
    const form = useForm<Client>({ defaultValues: initialData || { isActive: true, isTaxable: true, pricingLevels: ['detail'] } });
    const isNew = !initialData;
    
    return (
        <Form {...form}>
            <form className="h-full flex flex-col gap-4">
                <Card className="flex-shrink-0">
                    <CardHeader className="flex flex-row items-center justify-between p-4">
                        <CardTitle className="text-lg">{isNew ? "Nouveau Client" : "Modifier le Client"}</CardTitle>
                        <StatCard title="Solde" value={initialData?.balance?.toLocaleString() || 0} variant={initialData && initialData.balance < 0 ? "destructive" : "default"} className="w-40 text-right" />
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 pt-0">
                        <FormField name="companyName" render={({ field }) => (<FormItem><FormLabel>Raison sociale*</FormLabel><Input {...field} /></FormItem>)} />
                        <FormField name="code" render={({ field }) => (<FormItem><FormLabel>Code*</FormLabel><Input {...field} /></FormItem>)} />
                        <FormField name="contactPerson" render={({ field }) => (<FormItem><FormLabel>Contact</FormLabel><Input {...field} /></FormItem>)} />
                    </CardContent>
                </Card>
                
                <Tabs defaultValue="main" className="flex-grow flex flex-col min-h-0">
                    <TabsList className="flex-shrink-0">
                        <TabsTrigger value="main">Infos Principales</TabsTrigger>
                        <TabsTrigger value="accounting">Infos Comptables</TabsTrigger>
                        <TabsTrigger value="products">Produits</TabsTrigger>
                    </TabsList>
                    <TabsContent value="main" className="flex-grow mt-2 overflow-y-auto pr-2">
                       <Card><CardContent className="p-4 space-y-4">
                           <CardTitle className="text-base font-semibold">Conditions Commerciales</CardTitle>
                           <div className="flex items-center space-x-6">
                              <FormField name="isTaxable" render={({ field }) => (<FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="!mt-0">Assujeti à la TVA</FormLabel></FormItem>)} />
                               <div>
                                 <FormLabel>Prix à appliquer</FormLabel>
                                 <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                                    <FormField name="pricingLevels" render={() => (<FormItem className="flex items-center space-x-2"><Checkbox/><FormLabel className="!mt-0 font-normal">Détail</FormLabel></FormItem>)}/>
                                    <FormField name="pricingLevels" render={() => (<FormItem className="flex items-center space-x-2"><Checkbox/><FormLabel className="!mt-0 font-normal">Demi-gros</FormLabel></FormItem>)}/>
                                    <FormField name="pricingLevels" render={() => (<FormItem className="flex items-center space-x-2"><Checkbox/><FormLabel className="!mt-0 font-normal">Gros</FormLabel></FormItem>)}/>
                                    <FormField name="pricingLevels" render={() => (<FormItem className="flex items-center space-x-2"><Checkbox/><FormLabel className="!mt-0 font-normal">Super Gros</FormLabel></FormItem>)}/>
                                 </div>
                               </div>
                           </div>
                           <CardTitle className="text-base font-semibold pt-4">Coordonnées</CardTitle>
                           <div className="grid grid-cols-2 gap-4">
                               <FormField name="address" render={({ field }) => (<FormItem className="col-span-2"><FormLabel>Adresse</FormLabel><Input {...field} /></FormItem>)} />
                               <FormField name="phone" render={({ field }) => (<FormItem><FormLabel>Téléphone</FormLabel><Input {...field} /></FormItem>)} />
                               <FormField name="fax" render={({ field }) => (<FormItem><FormLabel>Fax</FormLabel><Input {...field} /></FormItem>)} />
                               <FormField name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><Input type="email" {...field} /></FormItem>)} />
                               <FormField name="website" render={({ field }) => (<FormItem><FormLabel>Site Web</FormLabel><Input {...field} /></FormItem>)} />
                               <FormField name="notes" render={({ field }) => (<FormItem className="col-span-2"><FormLabel>Notes</FormLabel><Textarea rows={2} {...field} /></FormItem>)} />
                           </div>
                       </CardContent></Card>
                    </TabsContent>
                    <TabsContent value="accounting" className="flex-grow p-1 overflow-y-auto"><Card><CardContent className="p-4">Informations comptables du client...</CardContent></Card></TabsContent>
                    <TabsContent value="products" className="flex-grow p-1 overflow-y-auto"><Card><CardContent className="p-4">Liste des produits achetés par le client...</CardContent></Card></TabsContent>
                </Tabs>

                <div className="flex-shrink-0 flex justify-between items-center pt-3 mt-1 border-t">
                     <FormField name="isActive" render={({ field }) => (<FormItem className="flex items-center space-x-2"><Switch checked={field.value} onCheckedChange={field.onChange}/><FormLabel>{field.value ? "Client Actif" : "Client Inactif"}</FormLabel></FormItem>)} />
                    <div className="space-x-2">
                        {!isNew && <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4 mr-2"/>Supprimer</Button>}
                        <Button size="sm"><Save className="h-4 w-4 mr-2"/>{isNew ? "Enregistrer" : "Mettre à jour"}</Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}