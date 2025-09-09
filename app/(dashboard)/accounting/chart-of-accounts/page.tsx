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
  
  const { onOpen, onClose: closeCompose } = useCompose();

  const fetchAndSetAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAccounts();
      setAccounts(Array.isArray(data.data) ? data.data : []);
      console.log("Fetched accounts:", data.data);
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
            await createAccount(data);
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
    <>
      <AccountListView 
        accounts={accounts} 
        isLoading={isLoading}
        onSelectAccount={setSelectedAccountId}
        onEditAccount={setSelectedAccountId}
        onDeleteAccount={setAccountToDelete}
        onAddNew={handleOpenCompose}
        onRefresh={fetchAndSetAccounts}
      />
      {accountToDelete && (
        <ConfirmationDialog
            isOpen={!!accountToDelete}
            onClose={() => setAccountToDelete(null)}
            onConfirm={confirmDelete}
            title={`Supprimer ${accountToDelete.libelle} ?`}
            description="Cette action est irréversible. Toutes les données associées à ce compte seront perdues."
        />
      )}
    </>
  );
}