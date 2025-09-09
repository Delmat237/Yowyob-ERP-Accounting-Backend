// app/(dashboard)/accounting/entries/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { EcritureComptable } from '@/types/accounting';
import {
  getEcrituresComptables,
  createEcritureComptable,
  validateEcritureComptable,
  deleteEcritureComptable,
} from '@/lib/api';
import { EcritureComptableListView } from '@/components/accounting/ecriture-comptable-list-view';
import { EcritureComptableDetailView } from '@/components/accounting/ecriture-comptable-detail-view';
import { useCompose } from '@/hooks/use-compose-store';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

export default function EcritureComptablePage() {
  const [ecritures, setEcritures] = useState<EcritureComptable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEcritureId, setSelectedEcritureId] = useState<string | null>(null);
  const [ecritureToDelete, setEcritureToDelete] = useState<EcritureComptable | null>(null);
  
  const { onOpen, onClose: closeCompose } = useCompose();

  const fetchAndSetEcritures = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getEcrituresComptables();
      setEcritures(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch ecritures:", error);
      setEcritures([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndSetEcritures();
  }, [fetchAndSetEcritures]);

  const handleSave = async (data: EcritureComptable) => {
    const isNew = !data.id;
    try {
      if (isNew) {
        const created = await createEcritureComptable(data);
        setEcritures((prev) => [...prev, created]);
        closeCompose();
      } else {
        const updated = await createEcritureComptable(data); // Use POST for update as per controller
        setEcritures((prev) => prev.map(ec => ec.id === updated.id ? updated : ec));
      }
      await fetchAndSetEcritures();
    } catch (error) {
      console.error("Failed to save ecriture:", error);
    }
  };

  const handleValidate = async (id: string) => {
    try {
      const validated = await validateEcritureComptable(id);
      setEcritures((prev) => prev.map(ec => ec.id === validated.id ? validated : ec));
    } catch (error) {
      console.error("Failed to validate ecriture:", error);
    }
  };

  const confirmDelete = async () => {
    if (!ecritureToDelete?.id) return;
    try {
      await deleteEcritureComptable(ecritureToDelete.id);
      setEcritures((prev) => prev.filter(ec => ec.id !== ecritureToDelete.id));
      if (selectedEcritureId === ecritureToDelete.id) {
        setSelectedEcritureId(null);
      }
    } catch (error) {
      console.error("Failed to delete ecriture:", error);
    } finally {
      setEcritureToDelete(null);
    }
  };

  const handleOpenCompose = () => {
    onOpen({
      title: "Nouvelle Écriture Comptable",
      content: <EcritureComptableDetailView onSave={handleSave} onDelete={() => {}} onValidate={() => {}} onBack={() => {}} ecriture={null} />,
    });
  };

  const handleBackToList = () => {
    setSelectedEcritureId(null);
  };

  const selectedEcriture = selectedEcritureId && Array.isArray(ecritures)
    ? ecritures.find(ec => ec.id === selectedEcritureId) || null
    : null;

  if (selectedEcritureId && selectedEcriture) {
    return (
      <EcritureComptableDetailView
        ecriture={selectedEcriture}
        onSave={handleSave}
        onDelete={() => setEcritureToDelete(selectedEcriture)}
        onValidate={() => handleValidate(selectedEcriture.id!)}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <>
      <EcritureComptableListView
        ecritures={ecritures}
        isLoading={isLoading}
        onSelectEcriture={setSelectedEcritureId}
        onEditEcriture={setSelectedEcritureId}
        onDeleteEcriture={setEcritureToDelete}
        onValidateEcriture={handleValidate}
        onAddNew={handleOpenCompose}
        onRefresh={fetchAndSetEcritures}
      />
      {ecritureToDelete && (
        <ConfirmationDialog
          isOpen={!!ecritureToDelete}
          onClose={() => setEcritureToDelete(null)}
          onConfirm={confirmDelete}
          title={`Supprimer ${ecritureToDelete.libelle} ?`}
          description="Cette action est irréversible. L'écriture sera supprimée si elle n'est pas validée."
        />
      )}
    </>
  );
}