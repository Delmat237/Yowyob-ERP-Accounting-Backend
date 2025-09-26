"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Trash2, ArrowLeft, Lock } from 'lucide-react';
import { PeriodeComptable } from '@/types/accounting';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PeriodeComptableDetailViewProps {
  periode: PeriodeComptable | null;
  onSave: (data: PeriodeComptable) => void;
  onClose: () => void;
  onDelete: () => void;
  onBack: () => void;
}

export const PeriodeComptableDetailView: React.FC<PeriodeComptableDetailViewProps> = ({
  periode,
  onSave,
  onClose,
  onDelete,
  onBack,
}) => {
  const form = useForm<PeriodeComptable>({
    defaultValues: periode || {
      code: '',
      dateDebut: new Date().toISOString().split('T')[0], // Use string format for input type="date"
      dateFin: new Date().toISOString().split('T')[0],   // Use string format for input type="date"
      cloturee: false,
      notes: '',
    },
  });

  const onSubmit = (data: PeriodeComptable) => {
    onSave(data);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          
        </div>
       
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code (YYYY-MM) <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="2025-09" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dateDebut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de début <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input type="date" value={field.value.toISOString().split('T')[0]} onChange={(e) => field.onChange(new Date(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateFin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de fin <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input type="date" value={field.value.toISOString().split('T')[0]} onChange={(e) => field.onChange(new Date(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="cloturee"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Clôturée</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
              {!periode?.cloturee && (
                <Button variant="outline" onClick={handleClose}>
                  <Lock className="mr-2 h-4 w-4" />
                  Clôturer
                </Button>
              )}
              {!periode?.cloturee && (
                <Button variant="destructive" onClick={onDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};