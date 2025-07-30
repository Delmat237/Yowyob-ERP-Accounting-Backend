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
  { id: "1", code: "A2034", name: "AVARIE TUYAU PVC DE 32", quantity: 10, unitPrice: 1500, discount: 0, total: 15000 },
  { id: "2", code: "D16008", name: "DILLIANT ABRO 4.5L", quantity: 2, unitPrice: 7500, discount: 0, total: 15000 },
];

export function NewOrderForm() {
  const form = useForm({
    defaultValues: {
      client: "client-comptant",
      date: new Date(),
      items: fakeOrderItems,
      motif: "",
      applyTVA: false,
      precompte: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const itemColumns: ColumnDef<OrderItem>[] = [
    { accessorKey: "code", header: "Code" },
    {
      accessorKey: "name",
      header: "Libellé",
      cell: ({ row }) => <div className="w-[200px] truncate">{row.original.name}</div>,
    },
    { accessorKey: "quantity", header: "Qté" },
    { accessorKey: "unitPrice", header: "P.U." },
    { accessorKey: "total", header: "Total" },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" onClick={() => remove(row.index)}>
          <XCircle className="h-4 w-4 text-destructive" />
        </Button>
      ),
    },
  ];

  return (
    <Form {...form}>
      <form className="h-full flex flex-col gap-6">
        {/* Section haute : 3 cartes côte à côte */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Ajouter un article */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-base">Ajouter un Article</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-6">
              <FormItem className="flex">
                <FormLabel>Réf. article</FormLabel>
                <Input placeholder="Scanner ou rechercher..." />
              </FormItem>
              <FormItem className="flex">
                <FormLabel>Quantité</FormLabel>
                <Input type="number" defaultValue={1} />
              </FormItem>
              <div className="flex justify-end">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Infos client */}
          <Card className="flex-[2]">
            <CardHeader>
              <CardTitle className="text-base">Informations Client</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6">
              <FormField
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="client-comptant">CLIENT COMPTANT MOKOLO</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                name="salesperson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Affaire suivie par</FormLabel>
                    <Select>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Administrateur</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className="w-full text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "dd MMM yyyy") : <span>Choisir</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                name="motif"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motif</FormLabel>
                    <Input {...field} placeholder="Ex: Commande urgente..." />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Options + boutons */}
          <Card className="w-[280px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-base">Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4">
              <FormField
                control={form.control}
                name="applyTVA"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} 
                      className="border-2 border-gray-400 data-[state=checked]:border-blue-600 w-5 h-5" />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">Appliquer TVA (19.25%)</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="precompte"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} 
                      className="border-2 border-gray-400 data-[state=checked]:border-blue-600 w-5 h-5"/>
                    </FormControl>
                    <FormLabel className="text-sm font-normal">Appliquer Précompte (2.2%)</FormLabel>
                  </FormItem>
                )}
              />
              <div className="pt-4 flex justify-between gap-2">
                <Button variant="outline" className="w-1/2 text-sm">
                  <Eraser className="mr-1 h-4 w-4" />
                  Effacer
                </Button>
                <Button className="w-1/2 text-sm">
                  <Save className="mr-1 h-4 w-4" />
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section détail commande */}
        <Card className="flex-grow flex flex-col min-h-0">
          <CardHeader>
            <CardTitle className="text-base">
              Détail de la Commande ({fields.length} articles)
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0 flex-grow overflow-y-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2  pt-0 pb-4">
              <StatCard title="Total HT" value="30,000" />
              <StatCard title="Remise" value="0" />
              <StatCard title="TVA" value="5,775" />
              <StatCard title="Net À Payer" value="35,775" variant="primary" />
            </div>
            <DataTable columns={itemColumns} data={fields} />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}