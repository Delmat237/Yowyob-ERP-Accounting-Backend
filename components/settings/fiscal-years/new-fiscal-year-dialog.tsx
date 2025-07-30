"use client";

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { FiscalYear } from '@/types/settings';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface NewFiscalYearDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<FiscalYear, 'id' | 'status'>) => void;
}

export function NewFiscalYearDialog({ isOpen, onClose, onSubmit }: NewFiscalYearDialogProps) {
    const form = useForm<Omit<FiscalYear, 'id' | 'status'>>({
        defaultValues: {
            name: `Exercice ${new Date().getFullYear() + 1}`,
            startDate: undefined,
            endDate: undefined,
        }
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Créer un nouvel exercice</DialogTitle>
                    <DialogDescription>
                        Définissez les dates de début et de fin du nouvel exercice comptable.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Nom de l'exercice</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="startDate" render={({ field }) => (
                            <FormItem className="flex flex-col"><FormLabel>Date de début</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                                <Button variant="outline" className="font-normal"><CalendarIcon className="mr-2 h-4 w-4"/>{field.value ? format(field.value, 'dd/MM/yyyy') : <span>Choisir une date</span>}</Button>
                            </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value as Date} onSelect={field.onChange} initialFocus /></PopoverContent></Popover></FormItem>
                        )} />
                        <FormField control={form.control} name="endDate" render={({ field }) => (
                            <FormItem className="flex flex-col"><FormLabel>Date de fin</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                                <Button variant="outline" className="font-normal"><CalendarIcon className="mr-2 h-4 w-4"/>{field.value ? format(field.value, 'dd/MM/yyyy') : <span>Choisir une date</span>}</Button>
                            </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value as Date} onSelect={field.onChange} initialFocus /></PopoverContent></Popover></FormItem>
                        )} />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
                            <Button type="submit">Créer l'exercice</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}