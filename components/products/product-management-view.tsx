// FILE: components/products/product-management-view.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/core';
import { PlusCircle, Search } from 'lucide-react';
import { ProductForm } from './product-form';

const mockProducts: Product[] = Array.from({ length: 30 }, (_, i) => ({
    id: `${i + 1}`,
    code: `A${2000 + i}`,
    name: `PRODUIT DE TEST #${i + 1} AVEC UN NOM POTENTIELLEMENT TRES LONG`,
    family: i % 2 === 0 ? 'AVARIE GENERALE' : 'PRODUITS CHIMIQUES',
    mainSupplier: 'FOURNISSEURS DIVERS',
    isActive: i % 15 !== 0,
    isPerishable: i % 5 === 0,
    isDiscountable: true
}));

export function ProductManagementView() {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(mockProducts[0]);
    const [isCreating, setIsCreating] = useState(false);

    const handleSelectProduct = (product: Product) => {
        setSelectedProduct(product);
        setIsCreating(false);
    }
    
    const handleAddNew = () => {
        setSelectedProduct(null);
        setIsCreating(true);
    }

    return (
        <div className="h-full flex gap-4">
            <div className="w-2/5 xl:w-1/3 h-full flex flex-col gap-4">
                 <div className="flex-shrink-0 flex gap-2">
                    <div className="relative flex-grow">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Rechercher par libellé ou code..." className="pl-8 w-full h-9"/>
                    </div>
                    <Button onClick={handleAddNew} className="h-9"><PlusCircle className="h-4 w-4 mr-2"/>Nouveau</Button>
                </div>
                <Card className="flex-grow flex flex-col min-h-0">
                    <CardHeader className="p-3 flex-shrink-0 border-b">
                        <CardTitle className="text-base">Liste des Articles</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 flex-grow overflow-y-auto">
                        <div className="space-y-1">
                        {mockProducts.map(product => (
                            <div key={product.id} onClick={() => handleSelectProduct(product)}
                                className={`p-2 rounded-md cursor-pointer border ${selectedProduct?.id === product.id ? 'bg-muted border-primary' : 'hover:bg-muted/50'}`}>
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-sm truncate">{product.name}</p>
                                    {!product.isActive && <span className="text-xs text-destructive font-semibold shrink-0 ml-2">INACTIF</span>}
                                </div>
                                <p className="text-xs text-muted-foreground">{product.code} - {product.family}</p>
                            </div>
                        ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex-grow h-full">
                {selectedProduct || isCreating ? (
                    <ProductForm 
                        key={selectedProduct?.id || 'new'} 
                        initialData={selectedProduct} 
                    />
                ) : (
                    <Card className="h-full flex items-center justify-center bg-muted/40 border-dashed">
                        <div className="text-center text-sm">
                            <p className="text-muted-foreground">Sélectionnez un article pour voir les détails</p>
                            <p className="text-muted-foreground text-xs">ou</p>
                            <Button variant="link" onClick={handleAddNew} className="text-sm">Créez un nouvel article</Button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}