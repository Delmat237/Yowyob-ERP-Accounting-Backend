// FILE: components/products/product-form.tsx
import { Product } from '@/types/core';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, Trash2 } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ProductFormProps {
    initialData: Product | null;
}

export function ProductForm({ initialData }: ProductFormProps) {
    const form = useForm<Product>({ defaultValues: initialData || { isActive: true, isDiscountable: true, isPerishable: false } });
    const isNew = !initialData;
    
    return (
        <Form {...form}>
            <form className="h-full flex flex-col gap-4">
                <Card className="flex-grow flex flex-col min-h-0">
                    <CardHeader className="p-4 flex-shrink-0 border-b">
                        <CardTitle className="text-lg">{isNew ? "Nouvel Article / Produit" : "Modifier l'Article"}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow overflow-y-auto space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <FormField name="name" render={({ field }) => (<FormItem className="col-span-2"><FormLabel>Libellé*</FormLabel><Input {...field} /></FormItem>)} />
                           <FormField name="code" render={({ field }) => (<FormItem><FormLabel>Code Vente (Réf. Vente)*</FormLabel><Input {...field} /></FormItem>)} />
                           <FormField name="supplierRef" render={({ field }) => (<FormItem><FormLabel>Réf. Art. Fournisseur</FormLabel><Input {...field} /></FormItem>)} />
                           <FormField name="family" render={({ field }) => (
                               <FormItem><FormLabel>Famille / Catégorie</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionner..."/></SelectTrigger></FormControl><SelectContent><SelectItem value="AVARIE GENERALE">AVARIE GENERALE</SelectItem></SelectContent></Select></FormItem>
                           )}/>
                           <FormField name="mainSupplier" render={({ field }) => (
                               <FormItem><FormLabel>Fournisseur Principal</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionner..."/></SelectTrigger></FormControl><SelectContent><SelectItem value="FOURNISSEURS DIVERS">FOURNISSEURS DIVERS</SelectItem></SelectContent></Select></FormItem>
                           )}/>
                           <FormField name="purchaseUnit" render={({ field }) => (<FormItem><FormLabel>Conditionnement Achat</FormLabel><Input {...field} placeholder="Ex: Carton de 12"/></FormItem>)} />
                           <FormField name="saleUnit" render={({ field }) => (<FormItem><FormLabel>Conditionnement Vente</FormLabel><Input {...field} placeholder="Ex: Pièce"/></FormItem>)} />
                           <FormField name="billingStation" render={({ field }) => (
                               <FormItem><FormLabel>Poste Facturation</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionner..."/></SelectTrigger></FormControl><SelectContent><SelectItem value="boutique">Boutique</SelectItem><SelectItem value="magasin">Magasin</SelectItem></SelectContent></Select></FormItem>
                           )}/>
                        </div>
                        <FormField name="notes" render={({ field }) => (<FormItem><FormLabel>Notes</FormLabel><Textarea rows={3} {...field} /></FormItem>)} />
                        <div className="flex items-center space-x-6 pt-2">
                           <FormField name="isPerishable" render={({ field }) => (<FormItem className="flex items-center space-x-2"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl><FormLabel className="!mt-0">Produit Périssable ?</FormLabel></FormItem>)} />
                           <FormField name="isDiscountable" render={({ field }) => (<FormItem className="flex items-center space-x-2"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl><FormLabel className="!mt-0">Remise Autorisée ?</FormLabel></FormItem>)} />
                        </div>
                    </CardContent>
                </Card>
                
                <div className="flex-shrink-0 flex justify-between items-center pt-3 border-t">
                     <FormField name="isActive" render={({ field }) => (<FormItem className="flex items-center space-x-2"><Switch checked={field.value} onCheckedChange={field.onChange}/><FormLabel>{field.value ? "Article Actif" : "Article Inactif"}</FormLabel></FormItem>)} />
                    <div className="space-x-2">
                        {!isNew && <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4 mr-2"/>Supprimer</Button>}
                        <Button size="sm"><Save className="h-4 w-4 mr-2"/>{isNew ? "Enregistrer l'article" : "Mettre à jour"}</Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}