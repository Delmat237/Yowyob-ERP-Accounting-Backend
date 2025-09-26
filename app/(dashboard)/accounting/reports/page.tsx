"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  getPeriodeComptables,
  generateReport,
} from '@/lib/api';
import { PeriodeComptable } from '@/types/accounting';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AccountingReportsPage() {
  const [periodes, setPeriodes] = useState<PeriodeComptable[]>([]);
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<string | null>(null);
  const [reportType, setReportType] = useState<'BALANCE_SHEET' | 'LEDGER' | 'PERIOD_SUMMARY'>('BALANCE_SHEET');
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<string | null>(null);

  const fetchPeriodes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getPeriodeComptables();
      setPeriodes(Array.isArray(response.data) ? response.data : []);
      if (response.data.length > 0) setSelectedPeriodeId(response.data[0].id);
    } catch (error) {
      console.error("Failed to fetch periods:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPeriodes();
  }, [fetchPeriodes]);

  const handleGenerateReport = async () => {
    if (!selectedPeriodeId) return;
    setIsLoading(true);
    try {
      const response = await generateReport({
        periodeId: selectedPeriodeId,
        reportType,
      });
      setReportData(response.data || 'Rapport généré avec succès. Téléchargement simulé.');
    } catch (error) {
      console.error("Failed to generate report:", error);
      setReportData('Erreur lors de la génération du rapport.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Génération de Rapports</h1>
          <Button onClick={fetchPeriodes} variant="outline" disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Rafraîchir
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Chargement...</div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du Rapport</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Période</label>
                    <Select
                      onValueChange={setSelectedPeriodeId}
                      value={selectedPeriodeId || undefined}
                      disabled={isLoading || periodes.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isLoading ? "Chargement..." : "Sélectionner une période"} />
                      </SelectTrigger>
                      <SelectContent>
                        {periodes.map((periode) => (
                          <SelectItem key={periode.id} value={periode.id!}>
                            {periode.code} - {periode.cloturee}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type de Rapport</label>
                    <Select onValueChange={(value) => setReportType(value as unknown)} value={reportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BALANCE_SHEET">Bilan</SelectItem>
                        <SelectItem value="LEDGER">Grand Livre</SelectItem>
                        <SelectItem value="PERIOD_SUMMARY">Résumé des Périodes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  onClick={handleGenerateReport}
                  disabled={isLoading || !selectedPeriodeId}
                  className="w-full md:w-auto"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Générer le Rapport
                </Button>
              </CardContent>
            </Card>

            {reportData && (
              <Card>
                <CardHeader>
                  <CardTitle>Résultat du Rapport</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
                    {reportData}
                  </pre>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}