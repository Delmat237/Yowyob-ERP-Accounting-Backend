"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { DateRangePicker } from "@/components/date-range-picker";
import { Order } from "@/types/sales";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2, Printer, Eraser } from "lucide-react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";

const mockOrders: Order[] = [
    { id: "CMD001", client: { id: 'c1', name: 'Maison DG Sarl', reference: 'C001' }, orderNumber: "CMD001", status: 'Confirmed', paymentMethod: 'Cash', orderDate: new Date(), items: [], totalHT: 150000, totalDiscount: 5000, totalNetHT: 145000, precompte: 3190, totalTVA: 27593.75, totalTTC: 172593.75, netToPay: 169403.75 },
    { id: "CMD002", client: { id: 'c2', name: 'Super U', reference: 'C002' }, orderNumber: "CMD002", status: 'Invoiced', paymentMethod: 'Check', orderDate: new Date(), items: [], totalHT: 250000, totalDiscount: 10000, totalNetHT: 240000, precompte: 5280, totalTVA: 45600, totalTTC: 285600, netToPay: 280320 },
];

export function OrderHistory() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(mockOrders[0]);
  const searchForm = useForm();

  const columns: ColumnDef<Order>[] = [
    { accessorKey: "orderNumber", header: "N° CMD" },
    { accessorKey: "client.name", header: "Client" },
    { accessorKey: "orderDate", header: "Date", cell: ({ row }) => format(row.original.orderDate, 'dd-MM-yyyy') },
    { accessorKey: "netToPay", header: "Montant", cell: ({ row }) => row.original.netToPay.toFixed(0) },
  ];

  return (
    // h-full et flex pour le conteneur principal
    <div className="h-full flex flex-col space-y-4">
        {/* Filtres de recherche fixes */}
        <Card className="flex-shrink-0">
          <CardHeader className="p-4"><CardTitle className="text-base">Critères de recherche</CardTitle></CardHeader>
          <CardContent className="p-4">
            <Form {...searchForm}>
              <form onSubmit={searchForm.handleSubmit(() => {})} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
                <FormItem><FormLabel>Date entre</FormLabel><DateRangePicker/></FormItem>
                <FormItem><FormLabel>N° CMD</FormLabel><Input /></FormItem>
                <FormItem><FormLabel>Client</FormLabel><Input /></FormItem>
                <FormItem><FormLabel>Montant</FormLabel><Input type="number" /></FormItem>
                <Button type="submit">Rechercher</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* La partie basse s'étire et est divisée en deux */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
            <Card className="lg:col-span-1 h-full flex flex-col">
                <CardHeader className="p-4 flex-shrink-0"><CardTitle className="text-base">Résultats</CardTitle></CardHeader>
                <CardContent className="p-2 flex-grow overflow-y-auto">
                    {/* Liste simple pour la sélection */}
                    <div className="space-y-1">
                        {mockOrders.map(order => (
                            <div key={order.id} onClick={() => setSelectedOrder(order)} className={`p-2 rounded-md cursor-pointer text-sm hover:bg-accent ${selectedOrder?.id === order.id ? 'bg-accent font-semibold' : ''}`}>
                               <p>{order.orderNumber} - {order.client.name}</p>
                               <p className="text-xs text-muted-foreground">{format(order.orderDate, 'dd-MM-yyyy')} - {order.netToPay.toFixed(0)} XAF</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2 h-full flex flex-col">
                 <CardHeader className="p-4 flex-shrink-0">
                    <CardTitle className="text-base">Détails et Annulation de la Commande</CardTitle>
                    {selectedOrder && <p className="text-sm text-muted-foreground">Commande N°: {selectedOrder.orderNumber}</p>}
                </CardHeader>
                {selectedOrder ? (
                    <>
                        <CardContent className="p-4 flex-grow overflow-y-auto space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div><p className="text-muted-foreground">Client</p><p className="font-medium">{selectedOrder.client.name}</p></div>
                                <div><p className="text-muted-foreground">Date</p><p className="font-medium">{format(selectedOrder.orderDate, 'dd-MM-yyyy')}</p></div>
                                <div><p className="text-muted-foreground">Statut</p><p className="font-medium">{selectedOrder.status}</p></div>
                                <div><p className="text-muted-foreground">Montant TTC</p><p className="font-medium">{selectedOrder.totalTTC.toFixed(0)}</p></div>
                            </div>
                            <FormItem><FormLabel>Motif de l'annulation</FormLabel><Textarea rows={3} /></FormItem>
                        </CardContent>
                        <CardContent className="p-4 flex-shrink-0 border-t">
                            <div className="flex items-center justify-end gap-2">
                               <Button variant="outline"><Eraser className="mr-2 h-4 w-4"/>Effacer</Button>
                               <Button variant="outline"><Printer className="mr-2 h-4 w-4"/>Imprimer</Button>
                               <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4"/>Annuler la commande</Button>
                            </div>
                        </CardContent>
                    </>
                ) : (
                    <CardContent className="flex items-center justify-center h-full text-muted-foreground">
                        <p>Sélectionnez une commande pour voir les détails.</p>
                    </CardContent>
                )}
            </Card>
        </div>
    </div>
  );
}