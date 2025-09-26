"use client";

import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Search } from 'lucide-react';
import { getPeriodeComptables } from '@/lib/api';
import { PeriodeComptable } from '@/types/accounting';

interface CashFlowData {
  code: string;
  description: string;
  amount: number;
  category: 'operationnel' | 'investissement' | 'financement';
}

const staticCashFlowData: CashFlowData[] = [
  // Activités opérationnelles
  { code: 'A1', description: 'Résultat net', amount: 620000, category: 'operationnel' },
  { code: 'A2', description: 'Ajustements non monétaires', amount: 150000, category: 'operationnel' },
  { code: 'A3', description: 'Variation du BFR', amount: -200000, category: 'operationnel' },
  // Activités d'investissement
  { code: 'B1', description: 'Achat d\'immobilisations', amount: -300000, category: 'investissement' },
  { code: 'B2', description: 'Vente d\'actifs', amount: 100000, category: 'investissement' },
  // Activités de financement
  { code: 'C1', description: 'Emprunts obtenus', amount: 400000, category: 'financement' },
  { code: 'C2', description: 'Remboursement d\'emprunts', amount: -150000, category: 'financement' },
  { code: 'C3', description: 'Dividendes versés', amount: -100000, category: 'financement' },
];

export default function CashFlowPage() {
  const [periodes, setPeriodes] = useState<PeriodeComptable[]>([]);
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPeriodes = async () => {
      try {
        const response = await getPeriodeComptables();
        if (Array.isArray(response.data)) {
          setPeriodes(response.data);
          if (response.data.length > 0) setSelectedPeriodeId(response.data[0].id);
        } else {
          setPeriodes([]);
          setError('Données de périodes invalides reçues du serveur.');
        }
      } catch (error) {
        console.error('Error fetching periods:', error);
        setPeriodes([]);
        setError('Le serveur est temporairement indisponible. Veuillez réessayer plus tard.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPeriodes();
  }, []);

  const handleGeneratePDF = () => {
    const pdfContent = `
      Tableau des Flux de Trésorerie - ${new Date().toLocaleDateString('fr-FR')}
      ${staticCashFlowData.map(item => `${item.code} - ${item.description}: ${item.amount.toLocaleString()} XAF`).join('\n')}
      Flux Net: ${totalFluxNet.toLocaleString()} XAF
    `;
    console.log('PDF Content:', pdfContent);
    alert('PDF généré - Contenu dans la console');
  };

  const handleGenerateXLSX = () => {
    const xlsxContent = staticCashFlowData.map(item => ({
      Code: item.code,
      Description: item.description,
      Montant: item.amount.toLocaleString(),
    }));
    console.log('XLSX Content:', xlsxContent);
    alert('XLSX généré - Contenu dans la console');
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setPeriodes([]);
  };

  if (isLoading) return <div className="text-center py-10 text-gray-500">Chargement...</div>;

  const operationnel = staticCashFlowData.filter(item => item.category === 'operationnel');
  const investissement = staticCashFlowData.filter(item => item.category === 'investissement');
  const financement = staticCashFlowData.filter(item => item.category === 'financement');

  const totalOperationnel = operationnel.reduce((sum, item) => sum + item.amount, 0);
  const totalInvestissement = investissement.reduce((sum, item) => sum + item.amount, 0);
  const totalFinancement = financement.reduce((sum, item) => sum + item.amount, 0);
  const totalFluxNet = totalOperationnel + totalInvestissement + totalFinancement;

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Tableau des Flux de Trésorerie</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleGeneratePDF}>
              <Download className="h-4 w-4 mr-2" /> PDF
            </Button>
            <Button variant="outline" onClick={handleGenerateXLSX}>
              <Download className="h-4 w-4 mr-2" /> XLSX
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="text-center py-4 bg-red-100 text-red-700 rounded-md">
              {error}
              <Button variant="link" onClick={handleRetry} className="ml-2 text-blue-600">Réessayer</Button>
            </div>
          )}
          <div className="flex gap-4 items-center">
            <Select value={selectedPeriodeId || ''} onValueChange={setSelectedPeriodeId} disabled={!!error}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent>
                {periodes.map((periode) => (
                  <SelectItem key={periode.id} value={periode.id!}>
                    {periode.code} - {periode.cloturee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative w-64">
              <Input
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                disabled={!!error}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Tableau des Flux de Trésorerie - Période 2025</span>
                <span className="text-sm text-gray-500">
                  {selectedPeriodeId ? `Période: ${periodes.find(p => p.id === selectedPeriodeId)?.code}` : 'Aucune période sélectionnée'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Activités opérationnelles */}
                <div>
                  <h2 className="text-xl font-semibold text-green-600 border-b-2 border-green-200 pb-2">Activités Opérationnelles (Total: {totalOperationnel.toLocaleString()} XAF)</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 mt-2">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Intitulé</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Montant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {operationnel.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-mono">{item.code}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                            <td className={`border border-gray-300 px-4 py-2 text-right font-bold ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                              {item.amount.toLocaleString()} XAF
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-200 font-bold">
                          <td colSpan={2} className="border border-gray-300 px-4 py-2 text-right">Sous-Total Opérationnel</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{totalOperationnel.toLocaleString()} XAF</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Activités d'investissement */}
                <div>
                  <h2 className="text-xl font-semibold text-red-600 border-b-2 border-red-200 pb-2">Activités d&#39;Investissement (Total: {totalInvestissement.toLocaleString()} XAF)</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 mt-2">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Intitulé</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Montant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {investissement.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-mono">{item.code}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                            <td className={`border border-gray-300 px-4 py-2 text-right font-bold ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                              {item.amount.toLocaleString()} XAF
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-200 font-bold">
                          <td colSpan={2} className="border border-gray-300 px-4 py-2 text-right">Sous-Total Investissement</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{totalInvestissement.toLocaleString()} XAF</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Activités de financement */}
                <div>
                  <h2 className="text-xl font-semibold text-purple-600 border-b-2 border-purple-200 pb-2">Activités de Financement (Total: {totalFinancement.toLocaleString()} XAF)</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 mt-2">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Intitulé</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Montant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {financement.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-mono">{item.code}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                            <td className={`border border-gray-300 px-4 py-2 text-right font-bold ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                              {item.amount.toLocaleString()} XAF
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-200 font-bold">
                          <td colSpan={2} className="border border-gray-300 px-4 py-2 text-right">Sous-Total Financement</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{totalFinancement.toLocaleString()} XAF</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Résumé */}
                <div className="mt-4 text-right text-lg font-bold">
                  <p>Opérationnel: {totalOperationnel.toLocaleString()} XAF</p>
                  <p>Investissement: {totalInvestissement.toLocaleString()} XAF</p>
                  <p>Financement: {totalFinancement.toLocaleString()} XAF</p>
                  <p className="text-purple-600">Flux Net: {totalFluxNet.toLocaleString()} XAF</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}