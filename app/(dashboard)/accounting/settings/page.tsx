"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  PeriodeComptable,
  OperationComptable,
  LedgerSettings,
  GeneralSettings,
} from '@/types/accounting';
import {
  getPeriodeComptables,
  createPeriodeComptable,
  updatePeriodeComptable,
  closePeriodeComptable,
  deletePeriodeComptable,
  getOperationsComptables,
  createOperationComptable,
  updateOperationComptable,
  deleteOperationComptable,
  getLedgerSettings,
  updateLedgerSettings,
  getGeneralSettings,
  updateGeneralSettings,
} from '@/lib/api';
import { PeriodeComptableListView } from '@/components/accounting/periode-comptable-list-view';
import { OperationComptableListView } from '@/components/accounting/operation-comptable-list-view';
import { PeriodeComptableDetailView } from '@/components/accounting/periode-comptable-detail-view';
import { OperationForm } from '@/components/accounting/settings/operation-form';
import { useCompose } from '@/hooks/use-compose-store';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AccountingSettingsPage() {
  const [periodes, setPeriodes] = useState<PeriodeComptable[]>([]);
  const [operations, setOperations] = useState<OperationComptable[]>([]);
  const [ledgerSettings, setLedgerSettings] = useState<LedgerSettings | null>(null);
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [periodeToDelete, setPeriodeToDelete] = useState<PeriodeComptable | null>(null);
  const [operationToDelete, setOperationToDelete] = useState<OperationComptable | null>(null);
  const { onOpen, onClose: closeCompose } = useCompose();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [periodeResponse, operationResponse, ledgerResponse, generalResponse] = await Promise.all([
        getPeriodeComptables(),
        getOperationsComptables(),
        getLedgerSettings(),
        getGeneralSettings(),
      ]);
      setPeriodes(Array.isArray(periodeResponse.data) ? periodeResponse.data : []);
      setOperations(Array.isArray(operationResponse.data) ? operationResponse.data : []);
      setLedgerSettings(ledgerResponse.data || null);
      setGeneralSettings(generalResponse.data || null);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async <T extends { id?: string }>(
    data: T,
    createFn: (data: Omit<T, 'id'>) => Promise<{ data: T }>,
    updateFn: (id: string, data: T) => Promise<{ data: T }>,
    setState: React.Dispatch<React.SetStateAction<T[]>>,
    refresh = true
  ) => {
    try {
      const isNew = !data.id;
      const response = await (isNew ? createFn(data as Omit<T, 'id'>) : updateFn(data.id!, data));
      setState((prev) => (isNew ? [...prev, response.data] : prev.map((item) => (item.id === response.data.id ? response.data : item))));
      if (refresh) await fetchData();
      closeCompose();
    } catch (error) {
      console.error(`Failed to save ${isNew ? 'new' : 'updated'} item:`, error);
    }
  };

  const handleDelete = async <T extends { id: string }>(
    item: T | null,
    deleteFn: (id: string) => Promise<void>,
    setState: React.Dispatch<React.SetStateAction<T[]>>,
    setItemToDelete: React.Dispatch<React.SetStateAction<T | null>>
  ) => {
    if (!item?.id) return;
    try {
      await deleteFn(item.id);
      setState((prev) => prev.filter((i) => i.id !== item.id));
      setItemToDelete(null);
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const handleClosePeriode = async (id: string) => {
    try {
      const response = await closePeriodeComptable(id);
      setPeriodes((prev) => prev.map((p) => (p.id === response.id ? response : p)));
    } catch (error) {
      console.error("Failed to close period:", error);
    }
  };

  const handleSaveLedgerSettings = async (data: Partial<LedgerSettings>) => {
    try {
      const updated = await updateLedgerSettings(data);
      setLedgerSettings(updated);
    } catch (error) {
      console.error("Failed to save ledger settings:", error);
    }
  };

  const handleSaveGeneralSettings = async (data: Partial<GeneralSettings>) => {
    try {
      const updated = await updateGeneralSettings(data);
      setGeneralSettings(updated);
    } catch (error) {
      console.error("Failed to save general settings:", error);
    }
  };

  const handleOpenPeriodeCompose = (periode?: PeriodeComptable) =>
    onOpen({
      title: periode ? "Modifier la Période Comptable" : "Nouvelle Période Comptable",
      content: <PeriodeComptableDetailView
        periode={periode || null}
        onSave={(data) => handleSave(data, createPeriodeComptable, updatePeriodeComptable, setPeriodes)}
        onClose={() => {}}
        onDelete={() => {}}
        onBack={closeCompose}
      />,
    });

  const handleOpenOperationCompose = (operation?: OperationComptable) =>
    onOpen({
      title: operation ? "Modifier l'Opération Comptable" : "Nouvelle Opération Comptable",
      content: <OperationForm
        initialData={operation || null}
        onSave={(data) => handleSave(data, createOperationComptable, updateOperationComptable, setOperations)}
        onCancel={closeCompose}
      />,
    });

  const handleDeletePeriode = () => handleDelete(periodeToDelete, deletePeriodeComptable, setPeriodes, setPeriodeToDelete);
  const handleDeleteOperation = () => handleDelete(operationToDelete, deleteOperationComptable, setOperations, setOperationToDelete);

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <Tabs defaultValue="periodes" className="w-full max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 bg-white rounded-t-lg shadow">
          <TabsTrigger value="periodes" className="data-[state=active]:bg-blue-100">Périodes Comptables</TabsTrigger>
          <TabsTrigger value="operations" className="data-[state=active]:bg-blue-100">Opérations Comptables</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-blue-100">Paramètres Généraux</TabsTrigger>
        </TabsList>
        <TabsContent value="periodes" className="bg-white rounded-b-lg shadow p-6">
          <PeriodeComptableListView
            periodes={periodes}
            isLoading={isLoading}
            onselectPeriode={(id) => handleOpenPeriodeCompose(periodes.find((p) => p.id === id))}
            onEditPeriode={(id) => handleOpenPeriodeCompose(periodes.find((p) => p.id === id))}
            onDeletePeriode={setPeriodeToDelete}
            onClosePeriode={handleClosePeriode}
            onAddNew={() => handleOpenPeriodeCompose()}
            onRefresh={fetchData}
          />
        </TabsContent>
        <TabsContent value="operations" className="bg-white rounded-b-lg shadow p-6">
          <OperationComptableListView
            operations={operations}
            isLoading={isLoading}
            onSelectOperation={(id) => handleOpenOperationCompose(operations.find((o) => o.id === id))}
            onEditOperation={(id) => handleOpenOperationCompose(operations.find((o) => o.id === id))}
            onDeleteOperation={setOperationToDelete}
            onAddNew={() => handleOpenOperationCompose()}
            onRefresh={fetchData}
          />
        </TabsContent>
        <TabsContent value="settings" className="bg-white rounded-b-lg shadow p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Paramètres du Grand Livre</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveLedgerSettings({
                  accountRangeStart: (e.target as any).accountRangeStart.value,
                  accountRangeEnd: (e.target as any).accountRangeEnd.value,
                  reportFormat: (e.target as any).reportFormat.value,
                  includeDetails: (e.target as any).includeDetails.checked,
                });
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Plage de comptes (Début)</label>
                  <Input name="accountRangeStart" defaultValue={ledgerSettings?.accountRangeStart || '10000'} className="mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Plage de comptes (Fin)</label>
                  <Input name="accountRangeEnd" defaultValue={ledgerSettings?.accountRangeEnd || '99999'} className="mt-1" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Format du rapport</label>
                <select name="reportFormat" defaultValue={ledgerSettings?.reportFormat || 'PDF'} className="w-full p-2 mt-1 border border-gray-300 rounded-lg">
                  <option value="PDF">PDF</option>
                  <option value="EXCEL">Excel</option>
                  <option value="CSV">CSV</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Input type="checkbox" name="includeDetails" defaultChecked={ledgerSettings?.includeDetails || false} className="h-4 w-4" />
                <label className="text-sm text-gray-700">Inclure les détails</label>
              </div>
              <Button type="submit" className="w-full md:w-auto">Enregistrer</Button>
            </form>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Paramètres Généraux</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveGeneralSettings({
                  defaultCurrency: (e.target as any).defaultCurrency.value,
                  defaultFiscalYear: (e.target as any).defaultFiscalYear.value,
                  entryMode: (e.target as any).entryMode.value as 'AUTOMATIC' | 'SEMI_AUTOMATIC' | 'MANUAL',
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Devise par défaut</label>
                <Input name="defaultCurrency" defaultValue={generalSettings?.defaultCurrency || 'XAF'} className="mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Année fiscale par défaut</label>
                <Input name="defaultFiscalYear" defaultValue={generalSettings?.defaultFiscalYear || '2025'} className="mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mode de saisie des écritures</label>
                <select
                  name="entryMode"
                  defaultValue={generalSettings?.entryMode || 'MANUAL'}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                >
                  <option value="MANUAL">Manuel</option>
                  <option value="SEMI_AUTOMATIC">Semi-automatique</option>
                  <option value="AUTOMATIC">Automatique</option>
                </select>
              </div>
              <Button type="submit" className="w-full md:w-auto">Enregistrer</Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
      {periodeToDelete && (
        <ConfirmationDialog
          isOpen={!!periodeToDelete}
          onClose={() => setPeriodeToDelete(null)}
          onConfirm={handleDeletePeriode}
          title={`Supprimer ${periodeToDelete.code} ?`}
          description="Cette action est irréversible. La période sera supprimée si elle n'est pas clôturée."
        />
      )}
      {operationToDelete && (
        <ConfirmationDialog
          isOpen={!!operationToDelete}
          onClose={() => setOperationToDelete(null)}
          onConfirm={handleDeleteOperation}
          title={`Supprimer ${operationToDelete.typeOperation} (${operationToDelete.modeReglement}) ?`}
          description="Cette action est irréversible. L'opération sera supprimée."
        />
      )}
    </div>
  );
}