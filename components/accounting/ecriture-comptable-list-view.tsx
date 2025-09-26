// components/accounting/ecriture-comptable-list-view.tsx
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
import { EcritureComptable } from '@/types/accounting';
import { Edit, Trash2, Plus, Check,RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EcritureComptableListViewProps {
  ecritures: EcritureComptable[];
  isLoading: boolean;
  onSelectEcriture: (id: string) => void;
  onEditEcriture: (id: string) => void;
  onDeleteEcriture: (ecriture: EcritureComptable) => void;
  onValidateEcriture: (id: string) => void;
  onAddNew: () => void;
  onRefresh: () => void;
}

const RowActions = ({ ecriture, onEdit, onDelete, onValidate }: { ecriture: EcritureComptable, onEdit: (id: string) => void, onDelete: (ecriture: EcritureComptable) => void, onValidate: (id: string) => void }) => {
  return (
    <div className="w-12 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <TooltipProvider>
        {!ecriture.validee && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onValidate(ecriture.id!)}>
                <Check className="h-4 w-4 text-green-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Valider</p></TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(ecriture.id!)}>
              <Edit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Modifier</p></TooltipContent>
        </Tooltip>
        {!ecriture.validee && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(ecriture)}>
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

export const EcritureComptableListView: React.FC<EcritureComptableListViewProps> = ({
  ecritures = [],
  isLoading,
  onSelectEcriture,
  onEditEcriture,
  onDeleteEcriture,
  onValidateEcriture,
  onAddNew,
  onRefresh,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Button onClick={onAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Écriture
        </Button>
<Button onClick={onRefresh} variant="outline">
            <RefreshCw className="h-4 w-4" />
          </Button>      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Libellé</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Journal</TableHead>
            <TableHead>Montant Débit</TableHead>
            <TableHead>Montant Crédit</TableHead>
            <TableHead>Validée</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7}>Chargement...</TableCell>
            </TableRow>
          ) : ecritures.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7}>Aucune écriture trouvée.</TableCell>
            </TableRow>
          ) : (
            ecritures.map((ecriture) => (
              <TableRow key={ecriture.id} className="group">
                <TableCell>{ecriture.libelle}</TableCell>
                <TableCell>{ecriture.dateEcriture.toLocaleDateString()}</TableCell>
                <TableCell>{ecriture.journalComptableLibelle || ecriture.journalComptableId}</TableCell>
                <TableCell>{ecriture.montantTotalDebit.toLocaleString('fr-FR')}</TableCell>
                <TableCell>{ecriture.montantTotalCredit.toLocaleString('fr-FR')}</TableCell>
                <TableCell>{ecriture.validee ? 'Oui' : 'Non'}</TableCell>
                <TableCell>
                  <RowActions
                    ecriture={ecriture}
                    onEdit={onEditEcriture}
                    onDelete={onDeleteEcriture}
                    onValidate={onValidateEcriture}
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