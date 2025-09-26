"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Account } from '@/types/accounting';
import { getAccounts, createAccount, updateAccount, deleteAccount } from '@/lib/api';
import { AccountListView } from '@/components/accounting/account-list-view';
import { AccountDetailView } from '@/components/accounting/account-detail-view';
import { useCompose } from '@/hooks/use-compose-store';
import { AccountingForm } from '@/components/accounting/account-form';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

export default function ChartOfAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [filters, setFilters] = useState({ class: '', nom: '' });

  const { onOpen, onClose: closeCompose } = useCompose();

  const fetchAndSetAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAccounts();
      setAccounts(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
      setAccounts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndSetAccounts();
  }, [fetchAndSetAccounts]);

  const handleSave = async (data: Account) => {
    const isNew = !data.id;
    try {
      if (isNew) {
        // Set default creation date to current date (September 09, 2025, 04:05 PM WAT)
        const defaultDate = new Date('2025-09-09T16:05:00+01:00');
        await createAccount({ ...data, createdAt: data.createdAt || defaultDate });
        closeCompose();
      } else {
        await updateAccount(data.id, data);
      }
      await fetchAndSetAccounts();
    } catch (error) {
      console.error("Failed to save account", error);
    }
  };

  const confirmDelete = async () => {
    if (!accountToDelete) return;
    try {
      await deleteAccount(accountToDelete.id);
      await fetchAndSetAccounts();
      if (selectedAccountId === accountToDelete.id) {
        setSelectedAccountId(null);
      }
    } catch (error) {
      console.error("Failed to delete account:", error);
    } finally {
      setAccountToDelete(null);
    }
  };

  const handleOpenCompose = () => {
    onOpen({
      title: "Nouveau Compte",
      content: <AccountingForm onSave={handleSave} initialData={null} />
    });
  };

  const handleBackToList = () => {
    setSelectedAccountId(null);
  };

// Apply sorting by noCompte and filtering with null checks
const filteredAndSortedAccounts = [...accounts]
  .sort((a, b) => a.noCompte.localeCompare(b.noCompte))
  .filter(account => {
    return (
      String(account.classe || '').includes(String(filters.class)) &&
      (account.libelle || '').toLowerCase().includes(filters.nom.toLowerCase())
    );
  });

  // Safely determine selectedAccount only if accounts is an array
  const selectedAccount = selectedAccountId && Array.isArray(accounts)
    ? accounts.find(a => a.id === selectedAccountId) || null
    : null;

  if (selectedAccountId && selectedAccount) {
    console.log("Selected account:", selectedAccount);
    return (
      <AccountDetailView
        account={selectedAccount}
        onSave={handleSave}
        onDelete={() => setAccountToDelete(selectedAccount)}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gray-100">
      <div className="w-full  bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Filtres</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="filter-class" className="block text-sm font-medium text-gray-600 mb-1">Classe</label>
              <input
                id="filter-class"
                type="text"
                placeholder="Filtrer par classe"
                value={filters.class}
                onChange={(e) => setFilters({ ...filters, class: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="filter-nom" className="block text-sm font-medium text-gray-600 mb-1">Nom</label>
              <input
                id="filter-nom"
                type="text"
                placeholder="Filtrer par nom"
                value={filters.nom}
                onChange={(e) => setFilters({ ...filters, nom: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        <AccountListView
          accounts={filteredAndSortedAccounts}
          isLoading={isLoading}
          onSelectAccount={setSelectedAccountId}
          onEditAccount={setSelectedAccountId}
          onDeleteAccount={setAccountToDelete}
          onAddNew={handleOpenCompose}
          onRefresh={fetchAndSetAccounts}
        />
      </div>
      {accountToDelete && (
        <ConfirmationDialog
          isOpen={!!accountToDelete}
          onClose={() => setAccountToDelete(null)}
          onConfirm={confirmDelete}
          title={`Supprimer ${accountToDelete.libelle} ?`}
          description="Cette action est irréversible. Toutes les données associées à ce compte seront perdues."
        />
      )}
    </div>
  );
}