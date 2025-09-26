// components/accounting/journal-comptable-list-view.tsx
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
import { JournalComptable } from '@/types/accounting';
import { Edit, Trash2, Plus,RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface JournalComptableListViewProps {
  journals: JournalComptable[];
  isLoading: boolean;
  onSelectJournal: (id: string) => void;
  onEditJournal: (id: string) => void;
  onDeleteJournal: (journal: JournalComptable) => void;
  onAddNew: () => void;
  onRefresh: () => void;
}

const RowActions = ({ journal, onEdit, onDelete }: { journal: JournalComptable, onEdit: (id: string) => void, onDelete: (journal: JournalComptable) => void }) => {
  return (
    <div className="w-10 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(journal.id!)}>
              <Edit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Modifier</p></TooltipContent>
        </Tooltip>
        {!journal.ecritureComptable?.length && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(journal)}>
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

export const JournalComptableListView: React.FC<JournalComptableListViewProps> = ({
  journals = [],
  isLoading,
  onSelectJournal,
  onEditJournal,
  onDeleteJournal,
  onAddNew,
  onRefresh,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Button onClick={onAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Journal
        </Button>
<Button onClick={onRefresh} variant="outline">
            <RefreshCw className="h-4 w-4" />
          </Button>      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Libellé</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actif</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5}>Chargement...</TableCell>
            </TableRow>
          ) : journals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>Aucun journal trouvé.</TableCell>
            </TableRow>
          ) : (
            journals.map((journal) => (
              <TableRow key={journal.id} className="group">
                <TableCell>{journal.codeJournal}</TableCell>
                <TableCell>{journal.libelle}</TableCell>
                <TableCell>{journal.typeJournal}</TableCell>
                <TableCell>{journal.actif ? 'Oui' : 'Non'}</TableCell>
                <TableCell>
                  <RowActions journal={journal} onEdit={onEditJournal} onDelete={onDeleteJournal} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};