"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Inventory, Warehouse, InventoryItem } from '@/types/stock';
import { Product } from '@/types/core';
import { createInventory, getWarehouses, updateInventory, getProducts, updateProduct, getInventories, deleteInventory } from '@/lib/api';
import { NewInventoryDialog, InventoryCreationOptions } from '@/components/stock/inventory/new-inventory-dialog';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { InventoryListView } from '@/components/stock/inventory/inventory-list-view';
import { InventoryDetailView } from '@/components/stock/inventory/inventory-detail-view';


export default function InventoryPage({ initialInventories, products }: { initialInventories: Inventory[], products: Product[] }) {
    const [inventories, setInventories] = useState<Inventory[]>([]);
    const [selectedInventoryId, setSelectedInventoryId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Inventory | null>(null);
    const [itemToValidate, setItemToValidate] = useState<Inventory | null>(null);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

    

    const getWarehousesList = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getWarehouses();
            setWarehouses(data)
        } catch (error) {
            console.error("Failed to load warehouses", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getWarehousesList()
    }, [getWarehousesList]);


    const refreshInventories = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getInventories();
            setInventories(data);
        } catch (error) {
            console.error("Failed to refresh inventories", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshInventories();
    }, [refreshInventories]);

    const handleCreateInventory = async (options: InventoryCreationOptions) => {
        const allProducts = await getProducts(); // On récupère la liste fraîche des produits
        let items: InventoryItem[] = [];

        if (options.creationMode === 're-initialize') {
            items = allProducts.map(p => ({
                productId: p.id,
                productCode: p.code,
                productName: p.name,
                theoreticalQty: p.stock,
                physicalQty: null, // Prêt pour la saisie manuelle
            }));
        } else if (options.creationMode === 'carry-over') {
             items = allProducts.map(p => ({
                productId: p.id,
                productCode: p.code,
                productName: p.name,
                theoreticalQty: p.stock,
                physicalQty: p.stock, // Stock physique = stock théorique
            }));
        }

        const newInventory: Omit<Inventory, 'id'> = {
            reference: `INV-${options.warehouseId}-${Date.now()}`,
            warehouseId: options.warehouseId,
            date: new Date().toISOString(),
            status: 'En cours',
            type: options.type,
            items: items,
        };

        try {
            const created = await createInventory(newInventory);
            await refreshInventories();
            setSelectedInventoryId(created.id); // On passe directement au détail
            setIsNewDialogOpen(false);
        } catch (error) {
            console.error("Failed to create inventory", error);
        }
    };
    
    const handleSaveItems = async (inventoryId: string, items: InventoryItem[]) => {
        try {
            const updated = await updateInventory(inventoryId, { items });
            // Optimistic update
            const updatedInventories = inventories.map(inv => inv.id === inventoryId ? updated : inv);
            setInventories(updatedInventories);
            // alert("Saisies enregistrées !");
        } catch (error) {
            console.error("Failed to save inventory items", error);
        }
    };

    const confirmValidation = async () => {
        if (!itemToValidate) return;
        try {
            const stockUpdates = itemToValidate.items
                .filter(item => item.physicalQty !== null && item.physicalQty !== item.theoreticalQty)
                .map(item => updateProduct(item.productId, { stock: item.physicalQty! }));
            
            await Promise.all(stockUpdates);
            const validated = await updateInventory(itemToValidate.id, { status: 'Validé' });
            
            await refreshInventories();
            setSelectedInventoryId(validated.id);

            // alert("Inventaire validé et stocks mis à jour !");
        } catch (error) {
            console.error("Failed to validate inventory", error);
        } finally {
            setItemToValidate(null);
        }
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await deleteInventory(itemToDelete.id);
            await refreshInventories();
            if (selectedInventoryId === itemToDelete.id) {
                setSelectedInventoryId(null);
            }
        } catch (error) {
            console.error("Failed to delete inventory:", error);
        } finally {
            setItemToDelete(null);
        }
    };

    const selectedInventory = inventories.find(inv => inv.id === selectedInventoryId);

    if (selectedInventoryId && selectedInventory) {
        return (
            <>
                <InventoryDetailView 
                    key={selectedInventory.id}
                    inventory={selectedInventory}
                    onSave={handleSaveItems}
                    onValidate={() => setItemToValidate(selectedInventory)}
                    onDelete={() => setItemToDelete(selectedInventory)}
                    onBack={() => setSelectedInventoryId(null)}
                />
                {itemToValidate && (
                    <ConfirmationDialog
                        isOpen={!!itemToValidate}
                        onClose={() => setItemToValidate(null)}
                        onConfirm={confirmValidation}
                        title={`Valider l'inventaire ${itemToValidate.reference} ?`}
                        description="Cette action mettra à jour les quantités en stock de tous les articles concernés. Cette opération est irréversible."
                    />
                )}
            </>
        );
    }
    
    return (
        <>
            <InventoryListView
                inventories={inventories}
                isLoading={isLoading}
                onSelectInventory={setSelectedInventoryId}
                onAddNew={() => setIsNewDialogOpen(true)}
                onRefresh={refreshInventories}
                onDelete={setItemToDelete}
            />
            <NewInventoryDialog 
                isOpen={isNewDialogOpen}
                onClose={() => setIsNewDialogOpen(false)}
                warehouses={warehouses}
                onSubmit={handleCreateInventory}
            />
            {itemToDelete && (
                <ConfirmationDialog
                    isOpen={!!itemToDelete}
                    onClose={() => setItemToDelete(null)}
                    onConfirm={confirmDelete}
                    title={`Supprimer l'inventaire ${itemToDelete.reference} ?`}
                    description="Cette action supprimera définitivement la fiche d'inventaire. Elle ne peut pas être annulée."
                />
            )}
        </>
    );
}