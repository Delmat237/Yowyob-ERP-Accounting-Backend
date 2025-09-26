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
import { PeriodeComptable } from '@/types/accounting';
import { Edit, Trash2, Plus, Lock,RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface PeriodeComptableListViewProps {
  periodes: PeriodeComptable[];
  isLoading: boolean;
  onSelectPeriode: (id: string) => void;
  onEditPeriode: (id: string) => void;
  onDeletePeriode: (periode: PeriodeComptable) => void;
  onClosePeriode: (id: string) => void;
  onAddNew: () => void;
  onRefresh: () => void;
}

const RowActions = ({ periode, onEdit, onDelete, onClose }: { 
  periode: PeriodeComptable; 
  onEdit: (id: string) => void; 
  onDelete: (periode: PeriodeComptable) => void; 
  onClose: (id: string) => void;
}) => {
  return (
    <div className="w-12 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <TooltipProvider>
        {!periode.cloturee && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onClose(periode.id!)}>
                <Lock className="h-4 w-4 text-blue-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Clôturer</p></TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(periode.id!)}>
              <Edit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Modifier</p></TooltipContent>
        </Tooltip>
        {!periode.cloturee && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(periode)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Supprimer</p></TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};

export const PeriodeComptableListView: React.FC<PeriodeComptableListViewProps> = ({
  periodes = [],
  isLoading,
  onSelectPeriode,
  onEditPeriode,
  onDeletePeriode,
  onClosePeriode,
  onAddNew,
  onRefresh,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Button onClick={onAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Période
        </Button>
    <Button onClick={onRefresh} variant="outline">
            <RefreshCw className="h-4 w-4" />
          </Button>      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Date Début</TableHead>
            <TableHead>Date Fin</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5}>Chargement...</TableCell>
            </TableRow>
          ) : periodes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>Aucune période trouvée.</TableCell>
            </TableRow>
          ) : (
            periodes.map((periode) => (
              <TableRow key={periode.id} className="group">
                <TableCell>{periode.code}</TableCell>
                <TableCell>{periode.dateDebut?.toLocaleDateString()}</TableCell>
                <TableCell>{periode.dateFin?.toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={periode.cloturee ? 'secondary' : 'default'}>
                    {periode.cloturee ? 'Clôturée' : 'Ouverte'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <RowActions
                    periode={periode}
                    onEdit={onEditPeriode}
                    onDelete={onDeletePeriode}
                    onClose={onClosePeriode}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};