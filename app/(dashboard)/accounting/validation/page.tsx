"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  EcritureComptable,
} from '@/types/accounting';
import {
  getEcrituresComptables,
  validateEcritureComptable,
  rejectEcritureComptable,
} from '@/lib/api';
import { EcritureComptableDetailView } from '@/components/accounting/ecriture-comptable-detail-view';
import { useCompose } from '@/hooks/use-compose-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Check, X, Eye, RefreshCw, Search } from 'lucide-react';

type AccountingValidationPageProps = object

export default function AccountingValidationPage({ }: AccountingValidationPageProps) {
  const [ecritures, setEcritures] = useState<EcritureComptable[]>([]);
  const [selectedEcritureId, setSelectedEcritureId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { onOpen, onClose: closeCompose } = useCompose();

  const fetchEcritures = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getEcrituresComptables();
      setEcritures(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch ecritures:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEcritures();
  }, [fetchEcritures]);

  const handleValidate = async (id: string) => {
    try {
      await validateEcritureComptable(id);
      setEcritures((prev) =>
        prev.map((e) => (e.id === id ? { ...e, validee: true, dateValidation: new Date() } : e))
      );
      if (selectedEcritureId === id) setSelectedEcritureId(null);
    } catch (error) {
      console.error("Failed to validate ecriture:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectEcritureComptable(id);
      setEcritures((prev) => prev.filter((e) => e.id !== id));
      if (selectedEcritureId === id) setSelectedEcritureId(null);
    } catch (error) {
      console.error("Failed to reject ecriture:", error);
    }
  };

  const filteredEcritures = ecritures.filter((e) =>
    e.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.referenceExterne?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (e.periodeComptableCode || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedEcriture = selectedEcritureId
    ? ecritures.find((e) => e.id === selectedEcritureId) || null
    : null;

  const handleOpenDetail = (id: string) => {
    const ecriture = ecritures.find((e) => e.id === id) || null;
    onOpen({
      title: `Détails de l'Écriture ${ecriture?.libelle || ''}`,
      content: (
        <EcritureComptableDetailView
          ecriture={ecriture}
          onSave={() => { }}
          onDelete={() => { }}
          onValidate={() => handleValidate(id)}
          onBack={closeCompose}
        />
      ),
    });
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <Tabs defaultValue="list" className="w-full mx-auto">
        <TabsList className="grid w-full grid-cols-2 bg-white rounded-t-lg shadow">
          <TabsTrigger value="list" className="data-[state=active]:bg-blue-100">Liste des Écritures</TabsTrigger>
          <TabsTrigger value="details" className="data-[state=active]:bg-blue-100" disabled={!selectedEcritureId}>
            Détails
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="bg-white rounded-b-lg shadow p-6">
          <div className="flex justify-between items-center mb-4 gap-4">
            <div className="relative w-80">
            <Input
              placeholder="Rechercher par libellé, référence ou période..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <Button onClick={fetchEcritures} variant="outline">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead>Libellé</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Période</TableHead>
              <TableHead>Référence</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-48">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">Chargement...</TableCell>
              </TableRow>
            ) : filteredEcritures.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">Aucune écriture trouvée.</TableCell>
              </TableRow>
            ) : (
              filteredEcritures.map((ecriture) => (
                <TableRow key={ecriture.id} className="group hover:bg-gray-50">
                  <TableCell>{ecriture.libelle}</TableCell>
                  <TableCell>{new Date(ecriture.dateEcriture).toLocaleDateString()}</TableCell>
                  <TableCell>{ecriture.periodeComptableCode}</TableCell>
                  <TableCell>{ecriture.referenceExterne || '-'}</TableCell>
                  <TableCell>{ecriture.validee ? 'Validée' : 'En attente'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDetail(ecriture.id!)}>
                        <Eye className="h-4 w-4 text-blue-600" />
                      </Button>
                      {!ecriture.validee && (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => handleValidate(ecriture.id!)}>
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleReject(ecriture.id!)}>
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TabsContent>
      <TabsContent value="details" className="bg-white rounded-b-lg shadow p-6">
        {selectedEcriture ? (
          <EcritureComptableDetailView
            ecriture={selectedEcriture}
            onSave={() => { }}
            onDelete={() => { }}
            onValidate={() => handleValidate(selectedEcriture.id!)}
            onBack={() => setSelectedEcritureId(null)}
          />
        ) : (
          <div className="text-center py-4 text-gray-500">Sélectionnez une écriture pour voir les détails.</div>
        )}
      </TabsContent>
    </Tabs>
    </div >
  );
}