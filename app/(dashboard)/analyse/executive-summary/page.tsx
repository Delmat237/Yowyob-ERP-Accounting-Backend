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

interface SummaryData {
  section: string;
  total: number;
  description: string;
}

const staticSummaryData: SummaryData[] = [
  // Bilan
  { section: 'Actifs', total: 350000, description: 'Total des actifs' },
  { section: 'Passifs', total: -1250000, description: 'Total des passifs' },
  { section: 'Capitaux Propres', total: -1150000, description: 'Total des capitaux propres' },
  // Compte de Résultat
  { section: 'Produits', total: 2000000, description: 'Total des produits' },
  { section: 'Charges', total: -700000, description: 'Total des charges' },
  { section: 'Résultat Net', total: 1300000, description: 'Résultat net de l\'exercice' },
  // Flux de Trésorerie
  { section: 'Opérationnel', total: 570000, description: 'Flux opérationnels' },
  { section: 'Investissement', total: -200000, description: 'Flux d\'investissement' },
  { section: 'Financement', total: 150000, description: 'Flux de financement' },
  { section: 'Flux Net', total: 520000, description: 'Variation nette de trésorerie' },
];

export default function GeneralSummaryPage() {
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
      Résumé Général - ${new Date().toLocaleDateString('fr-FR')}
      ${staticSummaryData.map(item => `${item.section}: ${item.total.toLocaleString()} XAF - ${item.description}`).join('\n')}
    `;
    console.log('PDF Content:', pdfContent);
    alert('PDF généré - Contenu dans la console');
  };

  const handleGenerateXLSX = () => {
    const xlsxContent = staticSummaryData.map(item => ({
      Section: item.section,
      Total: item.total.toLocaleString(),
      Description: item.description,
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

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Résumé Général</h1>
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
                <span>Résumé Général - Période 2025</span>
                <span className="text-sm text-gray-500">
                  {selectedPeriodeId ? `Période: ${periodes.find(p => p.id === selectedPeriodeId)?.code}` : 'Aucune période sélectionnée'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Bilan */}
                <div>
                  <h2 className="text-xl font-semibold text-blue-600 border-b-2 border-blue-200 pb-2">Bilan</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 mt-2">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Section</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staticSummaryData.filter(item => ['Actifs', 'Passifs', 'Capitaux Propres'].includes(item.section)).map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-mono">{item.section}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                            <td className={`border border-gray-300 px-4 py-2 text-right font-bold ${item.total >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                              {item.total.toLocaleString()} XAF
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-200 font-bold">
                          <td colSpan={2} className="border border-gray-300 px-4 py-2 text-right">Total Bilan (Actifs)</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{staticSummaryData.find(item => item.section === 'Actifs')?.total.toLocaleString()} XAF</td>
                        </tr>
                        <tr className="bg-gray-200 font-bold">
                          <td colSpan={2} className="border border-gray-300 px-4 py-2 text-right">Total Passifs + Capitaux Propres</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{(staticSummaryData.find(item => item.section === 'Passifs')!.total + staticSummaryData.find(item => item.section === 'Capitaux Propres')!.total).toLocaleString()} XAF</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Compte de Résultat */}
                <div>
                  <h2 className="text-xl font-semibold text-green-600 border-b-2 border-green-200 pb-2">Compte de Résultat</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 mt-2">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Section</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staticSummaryData.filter(item => ['Produits', 'Charges', 'Résultat Net'].includes(item.section)).map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-mono">{item.section}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                            <td className={`border border-gray-300 px-4 py-2 text-right font-bold ${item.total >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                              {item.total.toLocaleString()} XAF
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Flux de Trésorerie */}
                <div>
                  <h2 className="text-xl font-semibold text-purple-600 border-b-2 border-purple-200 pb-2">Flux de Trésorerie</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 mt-2">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Section</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staticSummaryData.filter(item => ['Opérationnel', 'Investissement', 'Financement', 'Flux Net'].includes(item.section)).map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-mono">{item.section}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                            <td className={`border border-gray-300 px-4 py-2 text-right font-bold ${item.total >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                              {item.total.toLocaleString()} XAF
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}