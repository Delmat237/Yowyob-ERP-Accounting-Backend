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

interface AuditEntry {
  date: string;
  user: string;
  action: string;
  accountCode: string;
  description: string;
  amountChange: number;
  newBalance: number;
}

const staticAuditData: AuditEntry[] = [
  { date: '2025-09-23', user: 'admin1', action: 'Ajout', accountCode: '101', description: 'Dépôt en caisse', amountChange: 200000, newBalance: 700000 },
  { date: '2025-09-24', user: 'user2', action: 'Modification', accountCode: '401', description: 'Ajustement fournisseur', amountChange: -50000, newBalance: 750000 },
  { date: '2025-09-24', user: 'admin1', action: 'Suppression', accountCode: '601', description: 'Annulation achat', amountChange: -300000, newBalance: 450000 },
  { date: '2025-09-25', user: 'user3', action: 'Ajout', accountCode: '102', description: 'Nouveau client', amountChange: 150000, newBalance: 600000 },
];

export default function AuditJournalPage() {
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
      Journal d'Audit - ${new Date().toLocaleDateString('fr-FR')}
      ${staticAuditData.map(item => `${item.date} | ${item.user} | ${item.action} | ${item.accountCode} | ${item.description} | Changement: ${item.amountChange.toLocaleString()} XAF | Nouveau Solde: ${item.newBalance.toLocaleString()} XAF`).join('\n')}
    `;
    console.log('PDF Content:', pdfContent);
    alert('PDF généré - Contenu dans la console');
  };

  const handleGenerateXLSX = () => {
    const xlsxContent = staticAuditData.map(item => ({
      Date: item.date,
      Utilisateur: item.user,
      Action: item.action,
      'Code Compte': item.accountCode,
      Description: item.description,
      'Changement (XAF)': item.amountChange.toLocaleString(),
      'Nouveau Solde (XAF)': item.newBalance.toLocaleString(),
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
          <h1 className="text-2xl font-bold text-gray-800">Journal d&#39;Audit</h1>
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
                <span>Journal d&#39;Audit - Période 2025</span>
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
                      <th className="border border-gray-300 px-4 py-2 text-left">Utilisateur</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Code Compte</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Changement (XAF)</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Nouveau Solde (XAF)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staticAuditData.map((entry, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{new Date(entry.date).toLocaleDateString('fr-FR')}</td>
                        <td className="border border-gray-300 px-4 py-2 font-mono">{entry.user}</td>
                        <td className="border border-gray-300 px-4 py-2">{entry.action}</td>
                        <td className="border border-gray-300 px-4 py-2 font-mono">{entry.accountCode}</td>
                        <td className="border border-gray-300 px-4 py-2">{entry.description}</td>
                        <td className={`border border-gray-300 px-4 py-2 text-right font-bold ${entry.amountChange >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {entry.amountChange.toLocaleString()} XAF
                        </td>
                        <td className={`border border-gray-300 px-4 py-2 text-right font-bold ${entry.newBalance >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {entry.newBalance.toLocaleString()} XAF
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-200 font-bold">
                      <td colSpan={5} className="border border-gray-300 px-4 py-2 text-right">Total Changement</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {staticAuditData.reduce((sum, entry) => sum + entry.amountChange, 0).toLocaleString()} XAF
                      </td>
                      <td></td>
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