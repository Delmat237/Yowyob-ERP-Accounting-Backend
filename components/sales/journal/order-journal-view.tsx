"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DateRangePicker } from "@/components/date-range-picker";
import { OrderJournalEntry } from "@/types/sales";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Printer, Search, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Label } from "@radix-ui/react-label";

const mockJournalData: OrderJournalEntry[] = [
    { id: '1', blNumber: 'BL00123', clientName: 'SOCIETE ABC', amountHT: 350000, discount: 15000, tva: 64237, precompte: 7350, commission: 0, orderDate: new Date('2025-05-27'), status: 'Facturée' },
    { id: '2', blNumber: 'BL00124', clientName: 'ETS GRAND SUCCES', amountHT: 120000, discount: 0, tva: 22800, precompte: 2640, commission: 0, orderDate: new Date('2025-05-26'), status: 'Livrée' },
];

export function OrderJournalView() {
    const form = useForm();
    
    const journalColumns: ColumnDef<OrderJournalEntry>[] = [
        { accessorKey: "blNumber", header: "No BL" },
        { accessorKey: "clientName", header: "Client" },
        { accessorKey: "amountHT", header: "Montant HT" },
        { accessorKey: "orderDate", header: "Date CMD", cell: ({ row }) => format(row.original.orderDate, "dd-MM-yy") },
        { accessorKey: "status", header: "Etat" },
    ];

    return (
        <div className="h-full flex space-x-6">
            <Card className="w-1/3 xl:w-1/4 flex flex-col">
                 <CardHeader>
                    <CardTitle>Filtres de Recherche</CardTitle>
                 </CardHeader>
                 <CardContent className="flex-grow overflow-y-auto pr-2">
                     <Form {...form}>
                        <div className="space-y-6">
                            <FormItem><FormLabel>Période</FormLabel><DateRangePicker/></FormItem>
                            <FormItem><FormLabel>Client</FormLabel><Select><SelectTrigger><SelectValue placeholder="Tous les clients"/></SelectTrigger><SelectContent><SelectItem value="all">Tous</SelectItem></SelectContent></Select></FormItem>
                            <FormItem><FormLabel>Utilisateur</FormLabel><Select defaultValue="admin"><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="admin">Administrateur</SelectItem></SelectContent></Select></FormItem>
                            <FormItem><FormLabel>Magasin</FormLabel><Select><SelectTrigger><SelectValue placeholder="Tous les magasins"/></SelectTrigger><SelectContent><SelectItem value="all">Tous</SelectItem></SelectContent></Select></FormItem>
                            <FormField control={form.control} name="orderType" render={({ field }) => (
                                <FormItem><FormLabel>Type de Commande</FormLabel><RadioGroup onValueChange={field.onChange} defaultValue="all" className="space-y-1 mt-2">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="all"/><Label className="font-normal">Toutes</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="reserved"/><Label className="font-normal">Réservées</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="unreserved"/><Label className="font-normal">Non Réservées</Label></div>
                                </RadioGroup></FormItem>
                            )}/>
                            <FormField control={form.control} name="orderStatus" render={({ field }) => (
                                <FormItem><FormLabel>État de la Commande</FormLabel><RadioGroup onValueChange={field.onChange} defaultValue="all" className="space-y-1 mt-2">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="all"/><Label className="font-normal">Toutes</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="invoiced"/><Label className="font-normal">Facturées</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="delivered"/><Label className="font-normal">Livrées</Label></div>
                                </RadioGroup></FormItem>
                            )}/>
                        </div>
                     </Form>
                 </CardContent>
                 <CardContent className="border-t pt-4">
                    <div className="flex flex-col space-y-2">
                        <Button size="lg"><Search className="mr-2 h-4 w-4"/>Rechercher</Button>
                        <Button variant="outline" size="lg"><X className="mr-2 h-4 w-4"/>Réinitialiser</Button>
                    </div>
                 </CardContent>
            </Card>

            <div className="flex-grow flex flex-col space-y-4">
                 <Card className="flex-shrink-0">
                    <CardContent className="p-4 flex items-center justify-between">
                        <p className="text-lg font-semibold">
                           Résultats <span className="text-muted-foreground font-normal text-base">({mockJournalData.length} commandes trouvées)</span>
                        </p>
                        <Button variant="outline"><Printer className="mr-2 h-4 w-4"/>Imprimer le journal</Button>
                    </CardContent>
                 </Card>
                 <div className="flex-grow">
                     <DataTable columns={journalColumns} data={mockJournalData} />
                 </div>
            </div>
        </div>
    );
}