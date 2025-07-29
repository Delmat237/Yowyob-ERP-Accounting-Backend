// FILE: components/customers/customer-management-view.tsx
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Client } from "@/types/core";
import { PlusCircle, Search } from "lucide-react";
import { CustomerForm } from "./customer-form";

const mockClients: Client[] = Array.from({ length: 25 }, (_, i) => ({
    id: `${i + 1}`,
    code: `CL1000${650 + i}`,
    companyName: `Client Exemplaire N°${i + 1}`,
    balance: (i % 3 === 0) ? -Math.random() * 50000 : Math.random() * 150000,
    isActive: i % 10 !== 0,
    isTaxable: true,
    pricingLevels: ['detail']
}));


export function CustomerManagementView() {
    const [selectedClient, setSelectedClient] = useState<Client | null>(mockClients[0]);
    const [isCreating, setIsCreating] = useState(false);

    const handleSelectClient = (client: Client) => {
        setSelectedClient(client);
        setIsCreating(false);
    }
    
    const handleAddNew = () => {
        setSelectedClient(null);
        setIsCreating(true);
    }

    return (
        <div className="h-full flex gap-4">
            <div className="w-1/3 xl:w-1/4 h-full flex flex-col gap-4">
                 <div className="flex-shrink-0 flex gap-2">
                    <div className="relative flex-grow">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Rechercher..." className="pl-8 w-full h-9"/>
                    </div>
                    <Button onClick={handleAddNew} className="h-9"><PlusCircle className="h-4 w-4 mr-2"/>Nouveau</Button>
                </div>
                <Card className="flex-grow flex flex-col min-h-0">
                    <CardContent className="p-2 flex-grow overflow-y-auto">
                        <div className="space-y-1">
                        {mockClients.map(client => (
                            <div key={client.id} onClick={() => handleSelectClient(client)}
                                className={`p-2 rounded-md cursor-pointer border ${selectedClient?.id === client.id ? 'bg-muted border-primary' : 'hover:bg-muted/50'}`}>
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-sm truncate">{client.companyName}</p>
                                    {!client.isActive && <span className="text-xs text-destructive shrink-0 ml-2">Inactif</span>}
                                </div>
                                <p className="text-xs text-muted-foreground">{client.code}</p>
                            </div>
                        ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex-grow h-full">
                {selectedClient || isCreating ? (
                    <CustomerForm 
                        key={selectedClient?.id || 'new'} 
                        initialData={selectedClient} 
                    />
                ) : (
                    <Card className="h-full flex items-center justify-center bg-muted/40 border-dashed">
                        <div className="text-center text-sm">
                            <p className="text-muted-foreground">Sélectionnez un client pour voir les détails</p>
                            <p className="text-muted-foreground text-xs">ou</p>
                            <Button variant="link" onClick={handleAddNew} className="text-sm">Créez un nouveau client</Button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}