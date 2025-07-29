// FILE: components/invoices/invoice-management-view.tsx
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { DateRangePicker } from "@/components/date-range-picker";
import { Invoice, InvoiceStatus } from "@/types/sales";
import { Badge } from "@/components/ui/badge";
import { InvoiceDetailPanel } from "./invoice-detail-panel";

const mockInvoices: Invoice[] = [
    { id: 'inv1', invoiceNumber: '119MSVM025CE000', client: { id: 'c1', name: 'MOSES', reference: "c1" }, orderDate: new Date(), dueDate: new Date(), status: 'NP', items: [{ id: '1', code: 'D160008', name: 'DILLIANT ABRO 4.5L', quantity: 2, unitPrice: 7500, discount: 0, total: 15000 }], payments: [], totalHT: 15000, totalDiscount: 0, totalNetHT: 15000, precompte: 0, totalTVA: 0, totalTTC: 15000, totalPaid: 0, balanceDue: 15000 },
    { id: 'inv2', invoiceNumber: '119MSVM025CE001', client: { id: 'c2', name: 'CLIENT DIVERS', reference: "c2" }, orderDate: new Date(), dueDate: new Date(), status: 'P', items: [], payments: [], totalHT: 12000, totalDiscount: 0, totalNetHT: 12000, precompte: 0, totalTVA: 0, totalTTC: 12000, totalPaid: 12000, balanceDue: 0 },
    { id: 'inv3', invoiceNumber: '119MSVM025CE002', client: { id: 'c1', name: 'MOSES', reference: "c1" }, orderDate: new Date(), dueDate: new Date(), status: 'PP', items: [], payments: [], totalHT: 1500, totalDiscount: 0, totalNetHT: 1500, precompte: 0, totalTVA: 0, totalTTC: 1500, totalPaid: 500, balanceDue: 1000 },
    { id: 'inv4', invoiceNumber: '119MSVM025CE003', client: { id: 'c3', name: 'A2-CONSTRUCTION', reference: "c3" }, orderDate: new Date(), dueDate: new Date(), status: 'Annulée', items: [], payments: [], totalHT: 2696.44, totalDiscount: 0, totalNetHT: 2696.44, precompte: 0, totalTVA: 403.56, totalTTC: 2696.44, totalPaid: 0, balanceDue: 0 },
];

const statusVariantMap: Record<InvoiceStatus, "success" | "warning" | "destructive" | "default"> = {
  "Payée": "success",
  "Partiellement payée": "warning",
  "Non payée": "default",
  "Annulée": "destructive",
};

export function InvoiceManagementView() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(mockInvoices[0]);
  const searchForm = useForm();

  return (
    <div className="h-full flex gap-6">
      <div className="w-1/3 xl:w-1/4 h-full flex flex-col gap-4">
        <Card className="flex-shrink-0">
          <CardHeader>
            <CardTitle className="text-base">Rechercher une facture</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Form {...searchForm}>
              <form className="space-y-3">
                <FormItem><FormLabel>Période</FormLabel><DateRangePicker /></FormItem>
                <FormItem><FormLabel>Nom du client</FormLabel><Input placeholder="Nom client..." /></FormItem>
                <Button className="w-full">Rechercher</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card className="flex-grow flex flex-col min-h-0">
          <CardHeader className="flex-shrink-0"><CardTitle className="text-base">Factures trouvées</CardTitle></CardHeader>
          <CardContent className="p-2 flex-grow overflow-y-auto">
            <div className="space-y-2">
              {mockInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  onClick={() => setSelectedInvoice(invoice)}
                  className={`p-3 rounded-lg cursor-pointer border ${
                    selectedInvoice?.id === invoice.id
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-accent"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-semibold">{invoice.invoiceNumber}</p>
                    <Badge variant={statusVariantMap[invoice.status]}>
                      {invoice.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{invoice.client.name}</p>
                  <p className="text-sm font-bold mt-1">
                    {invoice.totalTTC.toLocaleString()} XAF
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex-grow h-full">
        {selectedInvoice ? (
          <InvoiceDetailPanel invoice={selectedInvoice} />
        ) : (
          <Card className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">
              Sélectionnez une facture pour voir les détails.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}