"use client";

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Warehouse, Inventory } from '@/types/stock';

interface NewInventoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    warehouses: Warehouse[];
    onSubmit: (data: { warehouseId: string; type: Inventory['type'] }) => void;
}

export function NewInventoryDialog({ isOpen, onClose, warehouses, onSubmit }: NewInventoryDialogProps) {
    const form = useForm<{ warehouseId: string, type: Inventory['type'] }>({
        defaultValues: { warehouseId: '', type: 'Spontané' }
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Lancer un nouvel inventaire</DialogTitle>
                    <DialogDescription>
                        Attention : L'opération d'inventaire ré-initialise le stock à cette date.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField control={form.control} name="warehouseId" render={({ field }) => (
                            <FormItem><FormLabel>Magasin</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Choisir un magasin..." /></SelectTrigger></FormControl><SelectContent>
                                    {warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                                </SelectContent></Select>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="type" render={({ field }) => (
                             <FormItem><FormLabel>Type d'inventaire</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>
                                    <SelectItem value="Spontané">Spontané</SelectItem>
                                    <SelectItem value="Tournant">Tournant</SelectItem>
                                    <SelectItem value="Annuel">Annuel</SelectItem>
                                </SelectContent></Select>
                            </FormItem>
                        )} />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
                            <Button type="submit" disabled={!form.watch('warehouseId')}>Créer la fiche</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}