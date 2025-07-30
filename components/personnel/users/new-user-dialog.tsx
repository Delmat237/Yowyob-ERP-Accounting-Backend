"use client";

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Profile } from '@/types/personnel';

interface NewUserDialogProps {
    isOpen: boolean;
    onClose: () => void;
    profiles: Profile[];
    onSubmit: (data: Omit<User, 'id' | 'creationDate'>) => void;
}

type NewUserFormData = Omit<User, 'id' | 'creationDate'> & { confirmPassword?: string };

export function NewUserDialog({ isOpen, onClose, profiles, onSubmit }: NewUserDialogProps) {
    const form = useForm<NewUserFormData>({
        defaultValues: {
            code: '',
            name: '',
            title: '',
            password: '',
            confirmPassword: '',
            profileId: '',
        }
    });

    const handleFormSubmit = (data: NewUserFormData) => {
        if (data.password !== data.confirmPassword) {
            form.setError("confirmPassword", {
                type: "manual",
                message: "Les mots de passe ne correspondent pas.",
            });
            return;
        }
        const { confirmPassword, ...userData } = data;
        onSubmit(userData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
                    <DialogDescription>
                        Remplissez les informations ci-dessous et assignez un profil.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-2">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Nom et prénom</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="code" render={({ field }) => (
                            <FormItem><FormLabel>Code (identifiant)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Titre / Fonction</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="profileId" render={({ field }) => (
                            <FormItem><FormLabel>Profil</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Choisir un profil..."/></SelectTrigger></FormControl><SelectContent>
                                    {profiles.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                </SelectContent></Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem><FormLabel>Mot de passe</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                            <FormItem><FormLabel>Confirmer le mot de passe</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
                            <Button type="submit">Créer l'utilisateur</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}