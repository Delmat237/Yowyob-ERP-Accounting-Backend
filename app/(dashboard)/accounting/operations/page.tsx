// app/(dashboard)/accounting/operations/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { OperationComptable } from '@/types/accounting';
import { getOperationsComptables, createOperationComptable, updateOperationComptable, deleteOperationComptable } from '@/lib/api';
import { OperationComptableListView } from '@/components/accounting/operation-comptable-list-view';
import { OperationForm } from '@/components/accounting/settings/operation-form';
import { useCompose } from '@/hooks/use-compose-store';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

export default function OperationComptablePage() {
  const [operations, setOperations] = useState<OperationComptable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOperationId, setSelectedOperationId] = useState<string | null>(null);
  const [operationToDelete, setOperationToDelete] = useState<OperationComptable | null>(null);
  
  const { onOpen, onClose: closeCompose } = useCompose();

  const fetchAndSetOperations = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getOperationsComptables();
      setOperations(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch operations:", error);
      setOperations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndSetOperations();
  }, [fetchAndSetOperations]);

  const handleSave = async (data: OperationComptable) => {
    const isNew = !data.id;
    try {
      if (isNew) {
        const created = await createOperationComptable(data);
        setOperations((prev) => [...prev, created]);
        closeCompose();
      } else {
        const updated = await updateOperationComptable(data.id!, data);
        setOperations((prev) => prev.map(op => op.id === updated.id ? updated : op));
      }
      await fetchAndSetOperations();
    } catch (error) {
      console.error("Failed to save operation:", error);
    }
  };

  const confirmDelete = async () => {
    if (!operationToDelete?.id) return;
    try {
      await deleteOperationComptable(operationToDelete.id);
      setOperations((prev) => prev.filter(op => op.id !== operationToDelete.id));
      if (selectedOperationId === operationToDelete.id) {
        setSelectedOperationId(null);
      }
    } catch (error) {
      console.error("Failed to delete operation:", error);
    } finally {
      setOperationToDelete(null);
    }
  };

  const handleOpenCompose = () => {
    onOpen({
      title: "Nouvelle Opération Comptable",
      content: <OperationForm onSave={handleSave} onCancel={() => closeCompose} initialData={null} />,
    });
  };



  const selectedOperation = selectedOperationId && Array.isArray(operations)
    ? operations.find(op => op.id === selectedOperationId) || null
    : null;

  if (selectedOperationId && selectedOperation) {
    return (
      <OperationForm
        initialData={selectedOperation}
        onSave={handleSave}
        // onDelete={() => setOperationToDelete(selectedOperation)}
        onCancel={closeCompose}
      />
    );
  }

  return (
    <>
      <OperationComptableListView
        operations={operations}
        isLoading={isLoading}
        onSelectOperation={setSelectedOperationId}
        onEditOperation={setSelectedOperationId}
        onDeleteOperation={setOperationToDelete}
        onAddNew={handleOpenCompose}
        onRefresh={fetchAndSetOperations}
      />
      {operationToDelete && (
        <ConfirmationDialog
          isOpen={!!operationToDelete}
          onClose={() => setOperationToDelete(null)}
          onConfirm={confirmDelete}
          title={`Supprimer ${operationToDelete.typeOperation} ?`}
          description="Cette action est irréversible. Toutes les données associées à cette opération seront perdues."
        />
      )}
    </>
  );
}