"use client";

import React, { useState } from 'react';
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
import { Edit, Trash2, Plus, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';

interface OperationComptableListViewProps {
  operations: OperationComptable[];
  isLoading: boolean;
  onSelectOperation: (id: string) => void;
  onEditOperation: (id: string) => void;
  onDeleteOperation: (operation: OperationComptable) => void;
  onAddNew: () => void;
  onRefresh: () => void;
}

const RowActions = ({ operation, onEdit, onDelete }: { operation: OperationComptable, onEdit: (id: string) => void, onDelete: (operation: OperationComptable) => void }) => (
  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(operation.id!)}>
            <Edit className="h-4 w-4 text-blue-600" />
          </Button>
        </TooltipTrigger>
        <TooltipContent><p>Modifier</p></TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(operation)}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </TooltipTrigger>
        <TooltipContent><p>Supprimer</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
);

export const OperationComptableListView: React.FC<OperationComptableListViewProps> = ({
  operations = [],
  isLoading,
  onSelectOperation,
  onEditOperation,
  onDeleteOperation,
  onAddNew,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOperations = operations.filter((op) =>
    op.typeOperation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.modeReglement.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.comptePrincipal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
        <div className="flex justify-between">
          <Button onClick={onAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Nouvelle Opération
          </Button>
          <Button onClick={onRefresh} variant="outline">
            <RefreshCw className="h-4 w-4" />
          </Button>
      </div>
      <div className="flex justify-center">
         <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />  
      </div>
      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead>Type Opération</TableHead>
            <TableHead>Mode Règlement</TableHead>
            <TableHead>Compte Principal</TableHead>
            <TableHead>Sens Principal</TableHead>
            <TableHead>Type Montant</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">Chargement...</TableCell>
            </TableRow>
          ) : filteredOperations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">Aucune opération trouvée.</TableCell>
            </TableRow>
          ) : (
            filteredOperations.map((operation) => (
              <TableRow key={operation.id} className="group hover:bg-gray-50">
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