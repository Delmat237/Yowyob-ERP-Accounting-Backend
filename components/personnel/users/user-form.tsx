"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { User, Profile } from '@/types/personnel';
import { Warehouse } from '@/types/stock';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { format } from 'date-fns';
import { PermissionTable } from './permission-table';
import { AuthorizedOptionsTable } from './authorized-options-table';

interface UserFormProps {
    user: User;
    profiles: Profile[];
    warehouses: Warehouse[];
    onSave: (data: Partial<User>) => void;
}

const ALL_PRICES = [
    { id: 'PVD', label: 'Prix vente détail' },
    { id: 'PVDG', label: 'Prix vente demi gros' },
    { id: 'PVG', label: 'Prix vente gros' },
    { id: 'PVSG', label: 'Prix vente super gros' },
];

const ALL_PAYMENT_MODES = [
    { id: 'CC', label: 'par Chèque' },
    { id: 'CP', label: 'par Compte' },
    { id: 'CR', label: 'par Carte' },
    { id: 'CE', label: 'par Espèces' },
    { id: 'VIR', label: 'par Virement' },
];

const ALL_DISCOUNTS = [
    { id: 'Rem', label: 'Remise' },
    { id: 'RemEx', label: 'Remise Exceptionnelle' },
];

export function UserForm({ user, profiles, warehouses, onSave }: UserFormProps) {
    const form = useForm<User>({ defaultValues: user });
    const profileId = form.watch('profileId');
    const selectedProfile = profiles.find(p => p.id === profileId);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="h-full flex flex-col gap-4">
                <Card>
                    <CardContent className="pt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                        <FormField control={form.control} name="code" render={({ field }) => (<FormItem><FormLabel>Code</FormLabel><Input {...field} readOnly /></FormItem>)} />
                        <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Nom et prénom</FormLabel><Input {...field} /></FormItem>)} />
                        <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Titre</FormLabel><Input {...field} /></FormItem>)} />
                        <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>Mot de passe</FormLabel><Input type="password" {...field} placeholder="Nouveau mot de passe..." /></FormItem>)} />
                        <FormField control={form.control} name="profileId" render={({ field }) => (
                            <FormItem><FormLabel>Choisir le profil</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                                    {profiles.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                </SelectContent></Select>
                            </FormItem>
                        )} />
                        <FormItem><FormLabel>Date Création</FormLabel><Input value={format(new Date(user.creationDate), 'dd/MM/yyyy')} readOnly /></FormItem>
                    </CardContent>
                </Card>

                <Card className="flex-grow flex flex-col min-h-0">
                    <CardContent className="p-2 h-full">
                        <Tabs defaultValue="profile" className="h-full flex flex-col">
                            <TabsList className="flex-shrink-0">
                                <TabsTrigger value="profile">Détail Profil</TabsTrigger>
                                <TabsTrigger value="prices">Prix autorisés</TabsTrigger>
                                <TabsTrigger value="warehouses">Magasins autorisés</TabsTrigger>
                                <TabsTrigger value="payments">Modes règlement</TabsTrigger>
                                <TabsTrigger value="discounts">Remises autorisées</TabsTrigger>
                            </TabsList>
                            <div className="flex-grow overflow-y-auto mt-2">
                                <TabsContent value="profile"><PermissionTable permissions={selectedProfile?.permissions || {}} /></TabsContent>
                                <TabsContent value="prices"><AuthorizedOptionsTable allOptions={ALL_PRICES} authorizedIds={selectedProfile?.authorizedPrices || []} /></TabsContent>
                                <TabsContent value="warehouses"><AuthorizedOptionsTable allOptions={warehouses.map(w => ({id: w.id, label: w.name}))} authorizedIds={selectedProfile?.authorizedWarehouses || []} /></TabsContent>
                                <TabsContent value="payments"><AuthorizedOptionsTable allOptions={ALL_PAYMENT_MODES} authorizedIds={selectedProfile?.authorizedPaymentModes || []} /></TabsContent>
                                <TabsContent value="discounts"><AuthorizedOptionsTable allOptions={ALL_DISCOUNTS} authorizedIds={selectedProfile?.authorizedDiscounts || []} /></TabsContent>
                            </div>
                        </Tabs>
                    </CardContent>
                    <CardFooter className="justify-end border-t pt-4">
                        <Button type="submit">Appliquer les modifications</Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}