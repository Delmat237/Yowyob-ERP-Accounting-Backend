// FILE: components/sales/new-order/new-order-form.tsx
"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { OrderItem } from "@/types/sales";
import { Calendar as CalendarIcon, PlusCircle, Save, Eraser, XCircle } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { StatCard } from "@/components/ui/stat-card";

const fakeOrderItems: OrderItem[] = [
    { id: '1', code: 'A2034', name: 'AVARIE TUYAU PVC DE 32', quantity: 10, unitPrice: 1500, discount: 0, total: 15000 },
    { id: '2', code: 'D16008', name: 'DILLIANT ABRO 4.5L', quantity: 2, unitPrice: 7500, discount: 0, total: 15000 },
];

export function NewOrderForm() {
  const form = useForm({
    defaultValues: { client: "client-comptant", date: new Date(), items: fakeOrderItems, motif: '' },
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });

  const itemColumns: ColumnDef<OrderItem>[] = [
    { accessorKey: "code", header: "Code" },
    { accessorKey: "name", header: "Libellé", cell: ({ row }) => <div className="w-[200px] truncate">{row.original.name}</div> },
    { accessorKey: "quantity", header: "Qté" },
    { accessorKey: "unitPrice", header: "P.U." },
    { accessorKey: "total", header: "Total" },
    { id: "actions", cell: ({ row }) => <Button variant="ghost" size="icon" onClick={() => remove(row.index)}><XCircle className="h-4 w-4 text-destructive" /></Button> },
  ];
  
  return (
    <Form {...form}>
      <form className="h-full flex flex-col gap-4">
        <Card className="flex-shrink-0">
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField name="client" render={({ field }) => (
                  <FormItem><FormLabel>Client*</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="client-comptant">CLIENT COMPTANT MOKOLO</SelectItem></SelectContent></Select></FormItem>
              )}/>
              <FormField name="salesperson" render={({ field }) => (
                  <FormItem><FormLabel>Affaire suivi par</FormLabel><Select><FormControl><SelectTrigger><SelectValue placeholder="Sélectionner..."/></SelectTrigger></FormControl><SelectContent><SelectItem value="admin">Administrateur</SelectItem></SelectContent></Select></FormItem>
              )}/>
              <FormField name="date" render={({ field }) => (
                  <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className="font-normal text-left"><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "dd MMM yyyy") : <span>Choisir</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover></FormItem>
              )}/>
              <FormField name="motif" render={({ field }) => (
                <FormItem><FormLabel>Motif</FormLabel><Input {...field} placeholder="Ex: Commande urgente..." /></FormItem>
              )}/>
            </CardContent>
        </Card>

        <div className="flex-grow grid grid-cols-12 gap-4 min-h-0">
          <div className="col-span-12 lg:col-span-4 h-full flex flex-col gap-4">
            <Card>
              <CardHeader className="p-3 border-b"><CardTitle className="text-base">Ajouter un Article</CardTitle></CardHeader>
              <CardContent className="p-3 space-y-3">
                <FormItem><FormLabel>Réf. article</FormLabel><Input placeholder="Scanner ou rechercher..."/></FormItem>
                <FormItem><FormLabel>Quantité</FormLabel><Input type="number" defaultValue={1}/></FormItem>
                <div className="flex items-center justify-end">
                    <Button><PlusCircle className="mr-2 h-4 w-4"/>Ajouter</Button>
                </div>
              </CardContent>
            </Card>
            <Card className="flex-grow flex flex-col">
              <CardHeader className="p-3 border-b"><CardTitle className="text-base">Options</CardTitle></CardHeader>
              <CardContent className="p-3 space-y-2">
                <FormField control={form.control} name="applyTVA" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-2"><FormLabel>Appliquer TVA (19.25%)</FormLabel><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="precompte" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-2"><FormLabel>Appliquer Précompte (2.2%)</FormLabel><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
              </CardContent>
            </Card>
          </div>
          <Card className="col-span-12 lg:col-span-8 h-full flex flex-col min-h-0">
            <CardHeader className="p-3 flex-shrink-0 border-b"><CardTitle className="text-base">Détail de la Commande ({fields.length} articles)</CardTitle></CardHeader>
            <CardContent className="p-0 flex-grow overflow-y-auto">
                <DataTable columns={itemColumns} data={fields} />
            </CardContent>
          </Card>
        </div>

        <div className="flex-shrink-0 grid grid-cols-12 gap-4 items-center pt-3 border-t">
            <div className="col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-2">
                <StatCard title="Total HT" value="30,000" />
                <StatCard title="Remise" value="0" />
                <StatCard title="TVA" value="5,775" />
                <StatCard title="Montant NAP" value="35,775" variant="primary" />
            </div>
            <div className="col-span-12 lg:col-span-4 flex justify-end items-center gap-2">
                <Button variant="outline"><Eraser className="mr-2 h-4 w-4"/>Effacer</Button>
                <Button><Save className="mr-2 h-4 w-4"/>Enregistrer</Button>
            </div>
        </div>
      </form>
    </Form>
  );
}