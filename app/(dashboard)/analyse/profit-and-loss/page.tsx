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

interface ResultatData {
  code: string;
  description: string;
  debit: number;
  credit: number;
  solde: number;
  category: 'produits' | 'charges' | 'resultat';
}

const staticResultatData: ResultatData[] = [
  // Produits
  { code: '70', description: 'Ventes de produits finis', debit: 0, credit: 1200000, solde: 1200000, category: 'produits' },
  { code: '701', description: 'Ventes de marchandises', debit: 0, credit: 800000, solde: 800000, category: 'produits' },
  { code: '71', description: 'Production stockée', debit: 0, credit: 150000, solde: 150000, category: 'produits' },
  { code: '72', description: 'Production immobilisée', debit: 0, credit: 100000, solde: 100000, category: 'produits' },
  { code: '74', description: 'Reprises sur provisions', debit: 0, credit: 50000, solde: 50000, category: 'produits' },
  { code: '75', description: 'Autres produits', debit: 0, credit: 30000, solde: 30000, category: 'produits' },
  // Charges
  { code: '60', description: 'Achats de marchandises', debit: 400000, credit: 0, solde: -400000, category: 'charges' },
  { code: '61', description: 'Achats de matières premières', debit: 250000, credit: 0, solde: -250000, category: 'charges' },
  { code: '62', description: 'Autres approvisionnements', debit: 150000, credit: 0, solde: -150000, category: 'charges' },
  { code: '63', description: 'Achats de services', debit: 200000, credit: 0, solde: -200000, category: 'charges' },
  { code: '64', description: 'Autres charges', debit: 100000, credit: 0, solde: -100000, category: 'charges' },
  { code: '65', description: 'Charges de personnel', debit: 300000, credit: 0, solde: -300000, category: 'charges' },
  { code: '66', description: 'Charges financières', debit: 50000, credit: 0, solde: -50000, category: 'charges' },
  // Résultat
  { code: '131', description: 'Résultat net de l\'exercice', debit: 0, credit: 620000, solde: 620000, category: 'resultat' },
];

export default function ProfitAndLossPage() {
  const [periodes, setPeriodes] = useState<PeriodeComptable[]>([]);
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchPeriodes = async () => {
      try {
        const response = await getPeriodeComptables();
        setPeriodes(Array.isArray(response.data) ? response.data : []);
        if (response.data.length > 0) setSelectedPeriodeId(response.data[0].id);
      } catch (error) {
        console.error('Error fetching periods:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPeriodes();
  }, []);


  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setPeriodes([]);
  };
  const handleGeneratePDF = () => {
    const pdfContent = `
      Compte de Résultat - ${new Date().toLocaleDateString('fr-FR')}
      ${staticResultatData.map(item => `${item.code} - ${item.description}: ${item.solde.toLocaleString()} XAF`).join('\n')}
      Résultat Net: ${staticResultatData.find(item => item.category === 'resultat')?.solde.toLocaleString()} XAF
    `;
    console.log('PDF Content:', pdfContent);
    alert('PDF généré - Contenu dans la console');
  };

  const handleGenerateXLSX = () => {
    const xlsxContent = staticResultatData.map(item => ({
      Code: item.code,
      Description: item.description,
      Débit: item.debit.toLocaleString(),
      Crédit: item.credit.toLocaleString(),
      Solde: item.solde.toLocaleString(),
    }));
    console.log('XLSX Content:', xlsxContent);
    alert('XLSX généré - Contenu dans la console');
  };

  if (isLoading) return <div className="text-center py-10 text-gray-500">Chargement...</div>;

  const produits = staticResultatData.filter(item => item.category === 'produits');
  const charges = staticResultatData.filter(item => item.category === 'charges');
  const resultat = staticResultatData.filter(item => item.category === 'resultat')[0];

  const totalProduits = produits.reduce((sum, item) => sum + item.solde, 0);
  const totalCharges = charges.reduce((sum, item) => sum + item.solde, 0);
  const resultatNet = totalProduits + totalCharges;

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Compte de Résultat</h1>
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
                <span>Compte de Résultat - Période 2025</span>
                <span className="text-sm text-gray-500">
                  {selectedPeriodeId ? `Période: ${periodes.find(p => p.id === selectedPeriodeId)?.code}` : 'Aucune période sélectionnée'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Produits */}
                <div>
                  <h2 className="text-xl font-semibold text-green-600 border-b-2 border-green-200 pb-2">Produits (Total: {totalProduits.toLocaleString()} XAF)</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 mt-2">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Intitulé</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Débit</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Crédit</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Solde</th>
                        </tr>
                      </thead>
                      <tbody>
                        {produits.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-mono">{item.code}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">{item.debit.toLocaleString()}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">{item.credit.toLocaleString()}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right text-green-600 font-bold">
                              {item.solde.toLocaleString()} XAF
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-200 font-bold">
                          <td colSpan={4} className="border border-gray-300 px-4 py-2 text-right">Sous-Total Produits</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{totalProduits.toLocaleString()} XAF</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Charges */}
                <div>
                  <h2 className="text-xl font-semibold text-red-600 border-b-2 border-red-200 pb-2">Charges (Total: {totalCharges.toLocaleString()} XAF)</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 mt-2">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Intitulé</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Débit</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Crédit</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Solde</th>
                        </tr>
                      </thead>
                      <tbody>
                        {charges.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-mono">{item.code}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">{item.debit.toLocaleString()}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">{item.credit.toLocaleString()}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right text-red-600 font-bold">
                              {item.solde.toLocaleString()} XAF
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-200 font-bold">
                          <td colSpan={4} className="border border-gray-300 px-4 py-2 text-right">Sous-Total Charges</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{totalCharges.toLocaleString()} XAF</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Résultat */}
                <div>
                  <h2 className="text-xl font-semibold text-purple-600 border-b-2 border-purple-200 pb-2">Résultat Net</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 mt-2">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Intitulé</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Débit</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Crédit</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Solde</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2 font-mono">{resultat.code}</td>
                          <td className="border border-gray-300 px-4 py-2">{resultat.description}</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{resultat.debit.toLocaleString()}</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{resultat.credit.toLocaleString()}</td>
                          <td className="border border-gray-300 px-4 py-2 text-right text-purple-600 font-bold">
                            {resultatNet.toLocaleString()} XAF
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Résumé */}
                <div className="mt-4 text-right text-lg font-bold">
                  <p>Produits: {totalProduits.toLocaleString()} XAF</p>
                  <p>Charges: {totalCharges.toLocaleString()} XAF</p>
                  <p className="text-purple-600">Résultat Net: {resultatNet.toLocaleString()} XAF</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}