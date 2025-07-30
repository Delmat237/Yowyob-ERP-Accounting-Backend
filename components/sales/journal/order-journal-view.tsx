// FILE: components/sales/journal/order-journal-view.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DateRangePicker } from "@/components/date-range-picker";
import { OrderJournalEntry, OrderItem } from "@/types/sales";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Printer, Search, X, Eye, Pencil, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const mockJournalData: OrderJournalEntry[] = [
    { id: '1', blNumber: 'BL00123', clientName: 'SOCIETE ABC', amountHT: 350000, discount: 15000, tva: 64237, precompte: 7350, commission: 0, orderDate: new Date('2025-05-27'), status: 'Facturée', salesperson: 'Administrateur', items: [{ id: 'item1', code: 'P001', name: 'Produit A', quantity: 10, unitPrice: 35000, discount: 0, total: 350000 }] },
    { id: '2', blNumber: 'BL00124', clientName: 'ETS GRAND SUCCES', amountHT: 120000, discount: 0, tva: 22800, precompte: 2640, commission: 0, orderDate: new Date('2025-05-26'), status: 'Livrée', salesperson: 'Vendeur 1', items: [{ id: 'item2', code: 'P002', name: 'Produit B', quantity: 5, unitPrice: 24000, discount: 0, total: 120000 }] },
    { id: '3', blNumber: 'BL00125', clientName: 'CLIENT DIVERS', amountHT: 50000, discount: 5000, tva: 8550, precompte: 990, commission: 0, orderDate: new Date('2025-05-25'), status: 'Facturée', salesperson: 'Administrateur', items: [{ id: 'item3', code: 'P003', name: 'Produit C', quantity: 2, unitPrice: 25000, discount: 2500, total: 45000 }, { id: 'item4', code: 'P004', name: 'Service D', quantity: 1, unitPrice: 5000, discount: 0, total: 5000 }] },
];

export function OrderJournalView() {
    const form = useForm();
    const [modalState, setModalState] = useState<{ type: 'view' | 'edit' | 'delete' | null, order: OrderJournalEntry | null }>({ type: null, order: null });

    const handleOpenModal = (type: 'view' | 'edit' | 'delete', order: OrderJournalEntry) => {
        setModalState({ type, order });
    };

    const handleCloseModal = () => {
        setModalState({ type: null, order: null });
    };

    const journalColumns: ColumnDef<OrderJournalEntry>[] = [
        { accessorKey: "blNumber", header: "No BL" },
        { accessorKey: "clientName", header: "Client" },
        { accessorKey: "amountHT", header: "Montant HT", cell: ({ row }) => row.original.amountHT.toLocaleString() },
        { accessorKey: "orderDate", header: "Date CMD", cell: ({ row }) => format(row.original.orderDate, "dd-MM-yy") },
        { accessorKey: "status", header: "Etat" },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenModal('view', row.original)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenModal('edit', row.original)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenModal('delete', row.original)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
            ),
        },
    ];

    return (
        <div className=" flex gap-4">
            <Card className="w-1/3 xl:w-1/4 flex flex-col flex-shrink-0">
                <CardHeader>
                    <CardTitle className="text-base">Filtres de Recherche</CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex-grow overflow-y-auto">
                    <Form {...form}>
                        <div className="space-y-4">
                            <FormItem><FormLabel>Date</FormLabel><DateRangePicker /></FormItem>
                            <FormItem className="flex"><FormLabel>Client</FormLabel><Select><SelectTrigger className="w-full"><SelectValue placeholder="Tous les clients" /></SelectTrigger><SelectContent><SelectItem value="all">Tous</SelectItem></SelectContent></Select></FormItem>
                            <FormItem className="flex"><FormLabel>Utilisateur</FormLabel><Select defaultValue="admin"><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="admin">Administrateur</SelectItem></SelectContent></Select></FormItem>
                            <FormItem className="flex"><FormLabel>Magasin</FormLabel><Select><SelectTrigger className="w-full"><SelectValue placeholder="Tous les magasins" /></SelectTrigger><SelectContent><SelectItem value="all">Tous</SelectItem></SelectContent></Select></FormItem>
                            <FormField control={form.control} name="orderStatus" render={({ field }) => (
                                <FormItem><FormLabel>État de la Commande</FormLabel><RadioGroup onValueChange={field.onChange} defaultValue="all" className="space-y-1 mt-2">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="all" /><Label className="font-normal">Toutes</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="invoiced" /><Label className="font-normal">Facturées</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="delivered" /><Label className="font-normal">Livrées</Label></div>
                                </RadioGroup></FormItem>
                            )} />
                        </div>
                    </Form>
                    <div className="flex justify-between mt-6">
                        <Button><Search className="mr-2 h-4 w-4" />Rechercher</Button>
                        <Button variant="outline"><X className="mr-2 h-4 w-4" />Réinitialiser</Button>
                    </div>
                </CardContent>
            </Card>

            <div className="flex-grow flex flex-col gap-4 min-h-0">
                <Card className="flex-shrink-0">
                    <CardContent className="p-3 flex items-center justify-between">
                        <p className="text-base font-semibold">
                            Résultats <span className="text-muted-foreground font-normal">({mockJournalData.length} commandes trouvées)</span>
                        </p>
                        <Button variant="outline"><Printer className="mr-2 h-4 w-4" />Imprimer le journal</Button>
                    </CardContent>
                    <div className="flex-grow min-h-0 px-4">
                        <DataTable columns={journalColumns} data={mockJournalData} />
                    </div>
                </Card>
            </div>

            {modalState.order && (
                <>
                    <ViewOrderModal isOpen={modalState.type === 'view'} onClose={handleCloseModal} order={modalState.order} />
                    <EditOrderModal isOpen={modalState.type === 'edit'} onClose={handleCloseModal} order={modalState.order} />
                    <DeleteConfirmationModal isOpen={modalState.type === 'delete'} onClose={handleCloseModal} order={modalState.order} />
                </>
            )}
        </div>
    );
}

const ViewOrderModal = ({ isOpen, onClose, order }: { isOpen: boolean, onClose: () => void, order: OrderJournalEntry | null }) => {
    if (!order) return null;

    const itemColumns: ColumnDef<OrderItem>[] = [
        { accessorKey: "code", header: "Code" },
        { accessorKey: "name", header: "Libellé" },
        { accessorKey: "quantity", header: "Qté" },
        { accessorKey: "unitPrice", header: "P.U.", cell: ({ row }) => row.original.unitPrice.toLocaleString() },
        { accessorKey: "total", header: "Total", cell: ({ row }) => row.original.total.toLocaleString() },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Détail de la Commande: {order.blNumber}</DialogTitle>
                    <DialogDescription>Client: {order.clientName}</DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto">
                    <DataTable columns={itemColumns} data={order.items} />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Fermer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const EditOrderModal = ({ isOpen, onClose, order }: { isOpen: boolean, onClose: () => void, order: OrderJournalEntry | null }) => {
    const form = useForm<OrderJournalEntry>();

    useEffect(() => {
        if (order) {
            form.reset(order);
        }
    }, [order, form]);

    if (!order) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier la Commande: {order.blNumber}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-4">
                        <FormField name="clientName" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Client</FormLabel><Input {...field} /></FormItem>
                        )} />
                        <FormField name="status" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Statut</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Livrée">Livrée</SelectItem>
                                    <SelectItem value="Facturée">Facturée</SelectItem>
                                    <SelectItem value="Annulée">Annulée</SelectItem>
                                </SelectContent>
                            </Select></FormItem>
                        )} />
                        <FormField name="salesperson" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Commercial</FormLabel><Input {...field} /></FormItem>
                        )} />
                    </form>
                </Form>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Annuler</Button>
                    <Button>Enregistrer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const DeleteConfirmationModal = ({ isOpen, onClose, order }: { isOpen: boolean, onClose: () => void, order: OrderJournalEntry | null }) => {
    if (!order) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmer la suppression</DialogTitle>
                    <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer la commande N° <span className="font-semibold text-foreground">{order.blNumber}</span> ? Cette action est irréversible.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Annuler</Button>
                    <Button variant="destructive">Supprimer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};