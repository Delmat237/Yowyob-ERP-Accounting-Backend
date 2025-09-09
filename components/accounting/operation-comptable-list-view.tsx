// components/accounting/operation-comptable-list-view.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { OperationComptable } from '@/types/accounting';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface OperationComptableListViewProps {
  operations: OperationComptable[];
  isLoading: boolean;
  onSelectOperation: (id: string) => void;
  onEditOperation: (id: string) => void;
  onDeleteOperation: (operation: OperationComptable) => void;
  onAddNew: () => void;
  onRefresh: () => void;
}

const RowActions = ({ operation, onEdit, onDelete }: { operation: OperationComptable, onEdit: (id: string) => void, onDelete: (operation: OperationComptable) => void }) => {
  return (
    <div className="w-10 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(operation.id!)}>
              <Edit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Modifier</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(operation)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Supprimer</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export const OperationComptableListView: React.FC<OperationComptableListViewProps> = ({
  operations = [],
  isLoading,
  onSelectOperation,
  onEditOperation,
  onDeleteOperation,
  onAddNew,
  onRefresh,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Button onClick={onAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Opération
        </Button>
        <Button onClick={onRefresh}>Rafraîchir</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type Opération</TableHead>
            <TableHead>Mode Règlement</TableHead>
            <TableHead>Compte Principal</TableHead>
            <TableHead>Sens Principal</TableHead>
            <TableHead>Type Montant</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6}>Chargement...</TableCell>
            </TableRow>
          ) : operations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>Aucune opération trouvée.</TableCell>
            </TableRow>
          ) : (
            operations.map((operation) => (
              <TableRow key={operation.id} className="group">
                <TableCell>{operation.typeOperation}</TableCell>
                <TableCell>{operation.modeReglement}</TableCell>
                <TableCell>{operation.comptePrincipal}</TableCell>
                <TableCell>{operation.sensPrincipal}</TableCell>
                <TableCell>{operation.typeMontant}</TableCell>
                <TableCell>
                  <RowActions operation={operation} onEdit={onEditOperation} onDelete={onDeleteOperation} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};