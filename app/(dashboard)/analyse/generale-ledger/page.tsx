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

interface LedgerEntry {
  date: string;
  reference: string;
  accountCode: string;
  label: string;
  debit: number;
  credit: number;
  balance: number;
}

const staticLedgerData: LedgerEntry[] = [
  { date: '2025-09-01', reference: 'INV001', accountCode: '401', label: 'Vente de marchandises', debit: 0, credit: 800000, balance: 800000 },
  { date: '2025-09-02', reference: 'ACH001', accountCode: '601', label: 'Achat de marchandises', debit: 400000, credit: 0, balance: 400000 },
  { date: '2025-09-03', reference: 'PAY001', accountCode: '401', label: 'Règlement client', debit: 800000, credit: 0, balance: 1200000 },
  { date: '2025-09-04', reference: 'SAL001', accountCode: '641', label: 'Salaires', debit: 300000, credit: 0, balance: 900000 },
  { date: '2025-09-05', reference: 'LOAN001', accountCode: '161', label: 'Emprunt obtenu', debit: 0, credit: 400000, balance: 1300000 },
];

export default function GeneralLedgerPage() {
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
      Grand Livre - ${new Date().toLocaleDateString('fr-FR')}
      ${staticLedgerData.map(item => `${item.date} | ${item.reference} | ${item.accountCode} | ${item.label} | Débit: ${item.debit.toLocaleString()} XAF | Crédit: ${item.credit.toLocaleString()} XAF | Solde: ${item.balance.toLocaleString()} XAF`).join('\n')}
    `;
    console.log('PDF Content:', pdfContent);
    alert('PDF généré - Contenu dans la console');
  };

  const handleGenerateXLSX = () => {
    const xlsxContent = staticLedgerData.map(item => ({
      Date: item.date,
      Référence: item.reference,
      'Code Compte': item.accountCode,
      Libellé: item.label,
      Débit: item.debit.toLocaleString(),
      Crédit: item.credit.toLocaleString(),
      Solde: item.balance.toLocaleString(),
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
          <h1 className="text-2xl font-bold text-gray-800">Grand Livre</h1>
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
                <span>Grand Livre - Période 2025</span>
                <span className="text-sm text-gray-500">
                  {selectedPeriodeId ? `Période: ${periodes.find(p => p.id === selectedPeriodeId)?.code}` : 'Aucune période sélectionnée'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Référence</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Code Compte</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Libellé</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Débit (XAF)</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Crédit (XAF)</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Solde (XAF)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staticLedgerData.map((entry, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{new Date(entry.date).toLocaleDateString('fr-FR')}</td>
                        <td className="border border-gray-300 px-4 py-2 font-mono">{entry.reference}</td>
                        <td className="border border-gray-300 px-4 py-2 font-mono">{entry.accountCode}</td>
                        <td className="border border-gray-300 px-4 py-2">{entry.label}</td>
                        <td className={`border border-gray-300 px-4 py-2 text-right font-bold ${entry.debit > 0 ? 'text-green-600' : ''}`}>
                          {entry.debit.toLocaleString() || '-'}
                        </td>
                        <td className={`border border-gray-300 px-4 py-2 text-right font-bold ${entry.credit > 0 ? 'text-red-600' : ''}`}>
                          {entry.credit.toLocaleString() || '-'}
                        </td>
                        <td className={`border border-gray-300 px-4 py-2 text-right font-bold ${entry.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {entry.balance.toLocaleString()} XAF
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-200 font-bold">
                      <td colSpan={4} className="border border-gray-300 px-4 py-2 text-right">Total</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {staticLedgerData.reduce((sum, entry) => sum + entry.debit, 0).toLocaleString()} XAF
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {staticLedgerData.reduce((sum, entry) => sum + entry.credit, 0).toLocaleString()} XAF
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {staticLedgerData[staticLedgerData.length - 1].balance.toLocaleString()} XAF
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}