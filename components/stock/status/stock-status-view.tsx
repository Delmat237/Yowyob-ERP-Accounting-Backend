"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Product } from "@/types/core";
import { Warehouse } from "@/types/stock";
import { ColumnDef } from "@tanstack/react-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";

interface StockStatusViewProps {
  products: Product[];
  warehouses: Warehouse[];
  productFamilies: string[];
}

export function StockStatusView({ products, warehouses, productFamilies }: StockStatusViewProps) {
  const [filters, setFilters] = useState({ family: '', productId: '', warehouseId: '' });

  const productOptions: ComboboxOption[] = useMemo(() => 
    products.map(p => ({ value: p.id, label: `${p.code} - ${p.name}` })), [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const familyMatch = !filters.family || p.family === filters.family;
      const productMatch = !filters.productId || p.id === filters.productId;
      return familyMatch && productMatch;
    });
  }, [products, filters]);

  const columns: ColumnDef<Product>[] = [
    { accessorKey: "code", header: "Code" },
    { accessorKey: "name", header: "Libellé", cell: ({row}) => <div className="w-[300px] truncate">{row.original.name}</div> },
    { accessorKey: "stock", header: "En Stock", cell: ({row}) => <div className="text-center font-bold">{row.original.stock}</div> },
    { accessorKey: "costPrice", header: "CPUP", cell: ({row}) => row.original.costPrice },
    { id: 'stockValue', header: "Val Stock", cell: ({row}) => (row.original.stock * row.original.costPrice) },
    { accessorKey: "salePrice", header: "Prix", cell: ({row}) => row.original.salePrice },
    { accessorKey: "wholesalePrice", header: "Val Gros", cell: ({row}) => row.original.wholesalePrice },
    { accessorKey: "semiWholesalePrice", header: "Val Demi", cell: ({row}) => row.original.semiWholesalePrice },
  ];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]"><label className="text-sm font-medium">Catégorie produit</label><Select value={filters.family} onValueChange={value => setFilters(f => ({...f, family: value }))}><SelectTrigger><SelectValue placeholder="Toutes"/></SelectTrigger><SelectContent><SelectItem value="All">Toutes</SelectItem>{productFamilies.map(fam => <SelectItem key={fam} value={fam}>{fam}</SelectItem>)}</SelectContent></Select></div>
            <div className="flex-1 min-w-[300px]"><label className="text-sm font-medium">Article/Produit</label><Combobox options={productOptions} value={filters.productId} onChange={value => setFilters(f => ({...f, productId: value}))} placeholder="Tous les articles"/></div>
            <div className="flex-1 min-w-[200px]"><label className="text-sm font-medium">Magasin</label><Select value={filters.warehouseId} onValueChange={value => setFilters(f => ({...f, warehouseId: value }))}><SelectTrigger><SelectValue placeholder="Tous"/></SelectTrigger><SelectContent><SelectItem value="All">Tous</SelectItem>{warehouses.map(wh => <SelectItem key={wh.id} value={wh.id}>{wh.name}</SelectItem>)}</SelectContent></Select></div>
            <Button>Imprimer</Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        <DataTable columns={columns} data={filteredProducts} />
      </CardContent>
    </Card>
  );
}