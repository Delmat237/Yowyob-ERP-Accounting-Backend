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

interface BalanceItem {
  category: string;
  accountCode: string;
  description: string;
  amount: number;
}

const staticBalanceData: BalanceItem[] = [
  // Actifs
  { category: 'Actifs', accountCode: '101', description: 'Caisse', amount: 500000 },
  { category: 'Actifs', accountCode: '102', description: 'Comptes clients', amount: 800000 },
  { category: 'Actifs', accountCode: '103', description: 'Immobilisations', amount: 1200000 },
  // Passifs
  { category: 'Passifs', accountCode: '401', description: 'Fournisseurs', amount: -600000 },
  { category: 'Passifs', accountCode: '501', description: 'Emprunts', amount: -400000 },
  // Capitaux Propres
  { category: 'Capitaux Propres', accountCode: '1010', description: 'Capital', amount: -500000 },
  { category: 'Capitaux Propres', accountCode: '1100', description: 'Résultat de l\'exercice', amount: -1300000 },
];

export default function GeneralBalancePage() {
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
      Bilan Général - ${new Date().toLocaleDateString('fr-FR')}
      ${staticBalanceData.map(item => `${item.category} | ${item.accountCode} | ${item.description}: ${item.amount.toLocaleString()} XAF`).join('\n')}
      Total Actifs: ${totalActifs.toLocaleString()} XAF
      Total Passifs + Capitaux Propres: ${totalPassifsCapitaux.toLocaleString()} XAF
    `;
    console.log('PDF Content:', pdfContent);
    alert('PDF généré - Contenu dans la console');
  };

  const handleGenerateXLSX = () => {
    const xlsxContent = staticBalanceData.map(item => ({
      Catégorie: item.category,
      'Code Compte': item.accountCode,
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

  const actifs = staticBalanceData.filter(item => item.category === 'Actifs');
  const passifs = staticBalanceData.filter(item => item.category === 'Passifs');
  const capitauxPropres = staticBalanceData.filter(item => item.category === 'Capitaux Propres');

  const totalActifs = actifs.reduce((sum, item) => sum + item.amount, 0);
  const totalPassifs = passifs.reduce((sum, item) => sum + item.amount, 0);
  const totalCapitauxPropres = capitauxPropres.reduce((sum, item) => sum + item.amount, 0);
  const totalPassifsCapitaux = totalPassifs + totalCapitauxPropres;

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Bilan Général</h1>
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
            </div>          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Bilan Général - Période 2025</span>
                <span className="text-sm text-gray-500">
                  {selectedPeriodeId ? `Période: ${periodes.find(p => p.id === selectedPeriodeId)?.code}` : 'Aucune période sélectionnée'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Actifs */}
                <div>
                  <h2 className="text-xl font-semibold text-green-600 border-b-2 border-green-200 pb-2">Actifs (Total: {totalActifs.toLocaleString()} XAF)</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 mt-2">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Code Compte</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Montant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {actifs.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-mono">{item.accountCode}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right font-bold text-green-600">
                              {item.amount.toLocaleString()} XAF
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-200 font-bold">
                          <td colSpan={2} className="border border-gray-300 px-4 py-2 text-right">Total Actifs</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{totalActifs.toLocaleString()} XAF</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Passifs */}
                <div>
                  <h2 className="text-xl font-semibold text-red-600 border-b-2 border-red-200 pb-2">Passifs (Total: {totalPassifs.toLocaleString()} XAF)</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 mt-2">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Code Compte</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Montant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {passifs.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-mono">{item.accountCode}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right font-bold text-red-600">
                              {item.amount.toLocaleString()} XAF
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-200 font-bold">
                          <td colSpan={2} className="border border-gray-300 px-4 py-2 text-right">Total Passifs</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{totalPassifs.toLocaleString()} XAF</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Capitaux Propres */}
                <div>
                  <h2 className="text-xl font-semibold text-purple-600 border-b-2 border-purple-200 pb-2">Capitaux Propres (Total: {totalCapitauxPropres.toLocaleString()} XAF)</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 mt-2">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Code Compte</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Montant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {capitauxPropres.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-mono">{item.accountCode}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right font-bold text-purple-600">
                              {item.amount.toLocaleString()} XAF
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-200 font-bold">
                          <td colSpan={2} className="border border-gray-300 px-4 py-2 text-right">Total Capitaux Propres</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{totalCapitauxPropres.toLocaleString()} XAF</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Résumé */}
                <div className="mt-4 text-right text-lg font-bold">
                  <p>Total Actifs: {totalActifs.toLocaleString()} XAF</p>
                  <p>Total Passifs + Capitaux Propres: {totalPassifsCapitaux.toLocaleString()} XAF</p>
                  {totalActifs === totalPassifsCapitaux ? (
                    <p className="text-green-600">Équilibre vérifié</p>
                  ) : (
                    <p className="text-red-600">Déséquilibre détecté</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}