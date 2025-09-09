// app/(dashboard)/accounting/journals/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { JournalComptable } from '@/types/accounting';
import {
  getJounalComptables,
  createJournalComptable,
  updateJournalComptable,
  deleteJournalComptable,
} from '@/lib/api';
import { JournalComptableListView } from '@/components/accounting/journal-comptable-list-view';
import { JournalComptableDetailView } from '@/components/accounting/journal-comptable-detail-view';
import { useCompose } from '@/hooks/use-compose-store';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

export default function JournalComptablePage() {
  const [journals, setJournals] = useState<JournalComptable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(null);
  const [journalToDelete, setJournalToDelete] = useState<JournalComptable | null>(null);
  
  const { onOpen, onClose: closeCompose } = useCompose();

  const fetchAndSetJournals = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getJounalComptables();
      setJournals(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch journals:", error);
      setJournals([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndSetJournals();
  }, [fetchAndSetJournals]);

  const handleSave = async (data: JournalComptable) => {
    const isNew = !data.id;
    try {
      if (isNew) {
        const created = await createJournalComptable(data);
        setJournals((prev) => [...prev, created]);
        closeCompose();
      } else {
        const updated = await updateJournalComptable(data.id!, data);
        setJournals((prev) => prev.map(j => j.id === updated.id ? updated : j));
      }
      await fetchAndSetJournals();
    } catch (error) {
      console.error("Failed to save journal:", error);
    }
  };

  const confirmDelete = async () => {
    if (!journalToDelete?.id) return;
    try {
      await deleteJournalComptable(journalToDelete.id);
      setJournals((prev) => prev.filter(j => j.id !== journalToDelete.id));
      if (selectedJournalId === journalToDelete.id) {
        setSelectedJournalId(null);
      }
    } catch (error) {
      console.error("Failed to delete journal:", error);
    } finally {
      setJournalToDelete(null);
    }
  };

  const handleOpenCompose = () => {
    onOpen({
      title: "Nouveau Journal Comptable",
      content: <JournalComptableDetailView onSave={handleSave} onDelete={() => {}} onBack={() => {}} journal={null} />,
    });
  };

  const handleBackToList = () => {
    setSelectedJournalId(null);
  };

  const selectedJournal = selectedJournalId && Array.isArray(journals)
    ? journals.find(j => j.id === selectedJournalId) || null
    : null;

  if (selectedJournalId && selectedJournal) {
    return (
      <JournalComptableDetailView
        journal={selectedJournal}
        onSave={handleSave}
        onDelete={() => setJournalToDelete(selectedJournal)}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <>
      <JournalComptableListView
        journals={journals}
        isLoading={isLoading}
        onSelectJournal={setSelectedJournalId}
        onEditJournal={setSelectedJournalId}
        onDeleteJournal={setJournalToDelete}
        onAddNew={handleOpenCompose}
        onRefresh={fetchAndSetJournals}
      />
      {journalToDelete && (
        <ConfirmationDialog
          isOpen={!!journalToDelete}
          onClose={() => setJournalToDelete(null)}
          onConfirm={confirmDelete}
          title={`Supprimer ${journalToDelete.libelle} ?`}
          description="Cette action est irréversible. Le journal sera supprimé s'il n'a pas d'écritures associées."
        />
      )}
    </>
  );
}