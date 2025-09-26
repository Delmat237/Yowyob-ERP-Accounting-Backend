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

interface BilanData {
  code: string;
  description: string;
  debit: number;
  credit: number;
  solde: number;
  category: 'actif' | 'passif' | 'capitauxPropres';
}

const staticBilanData: BilanData[] = [
  // Capitaux Propres
  { code: '10', description: 'Capital social', debit: 0, credit: 1000000, solde: -1000000, category: 'capitauxPropres' },
  { code: '101', description: 'Capital social non appelé', debit: 0, credit: 50000, solde: -50000, category: 'capitauxPropres' },
  { code: '1011', description: 'Capital souscrit non appelé', debit: 0, credit: 30000, solde: -30000, category: 'capitauxPropres' },
  { code: '1012', description: 'Capital à payer sur augmentations', debit: 0, credit: 20000, solde: -20000, category: 'capitauxPropres' },
  { code: '11', description: 'Réserves', debit: 0, credit: 150000, solde: -150000, category: 'capitauxPropres' },
  { code: '110', description: 'Réserve légale', debit: 0, credit: 50000, solde: -50000, category: 'capitauxPropres' },
  { code: '111', description: 'Réserve statuaires', debit: 0, credit: 30000, solde: -30000, category: 'capitauxPropres' },
  { code: '112', description: 'Réserves réglementées', debit: 0, credit: 70000, solde: -70000, category: 'capitauxPropres' },
  { code: '12', description: 'Report à nouveau', debit: 0, credit: 80000, solde: -80000, category: 'capitauxPropres' },
  { code: '120', description: 'Report à nouveau créditeur', debit: 0, credit: 80000, solde: -80000, category: 'capitauxPropres' },
  { code: '121', description: 'Report à nouveau débiteur', debit: 50000, credit: 0, solde: 50000, category: 'capitauxPropres' },
  { code: '13', description: 'Résultat de l\'exercice', debit: 0, credit: 120000, solde: -120000, category: 'capitauxPropres' },
  { code: '131', description: 'Résultat en instance d\'affectation', debit: 0, credit: 120000, solde: -120000, category: 'capitauxPropres' },
  // Passifs
  { code: '14', description: 'Subventions d\'investissement', debit: 0, credit: 45000, solde: -45000, category: 'passif' },
  { code: '141', description: 'Subventions d\'équilibre', debit: 0, credit: 30000, solde: -30000, category: 'passif' },
  { code: '142', description: 'Subventions d\'exploitation', debit: 0, credit: 15000, solde: -15000, category: 'passif' },
  { code: '15', description: 'Provisions pour risques', debit: 0, credit: 200000, solde: -200000, category: 'passif' },
  { code: '151', description: 'Provisions pour litiges', debit: 0, credit: 50000, solde: -50000, category: 'passif' },
  { code: '152', description: 'Provisions pour garanties', debit: 0, credit: 80000, solde: -80000, category: 'passif' },
  { code: '153', description: 'Provisions pour dépréciation', debit: 0, credit: 70000, solde: -70000, category: 'passif' },
  { code: '16', description: 'Emprunts et dettes assimilées', debit: 0, credit: 800000, solde: -800000, category: 'passif' },
  { code: '161', description: 'Emprunts obligataires', debit: 0, credit: 300000, solde: -300000, category: 'passif' },
  { code: '162', description: 'Emprunts auprès des établissements', debit: 0, credit: 400000, solde: -400000, category: 'passif' },
  { code: '163', description: 'Avances reçues des clients', debit: 0, credit: 100000, solde: -100000, category: 'passif' },
  { code: '17', description: 'Dettes d\'exploitation', debit: 0, credit: 450000, solde: -450000, category: 'passif' },
  { code: '171', description: 'Fournisseurs et comptes rattachés', debit: 0, credit: 300000, solde: -300000, category: 'passif' },
  { code: '172', description: 'Dettes sur immobilisations', debit: 0, credit: 150000, solde: -150000, category: 'passif' },
  // Actifs
  { code: '20', description: 'Immobilisations incorporelles', debit: 200000, credit: 0, solde: 200000, category: 'actif' },
  { code: '201', description: 'Frais d\'établissement', debit: 50000, credit: 0, solde: 50000, category: 'actif' },
  { code: '202', description: 'Frais de recherche et développement', debit: 30000, credit: 0, solde: 30000, category: 'actif' },
  { code: '203', description: 'Brevets, licences, marques', debit: 120000, credit: 0, solde: 120000, category: 'actif' },
  { code: '21', description: 'Terrains', debit: 150000, credit: 0, solde: 150000, category: 'actif' },
  { code: '22', description: 'Bâtiments', debit: 300000, credit: 0, solde: 300000, category: 'actif' },
  { code: '23', description: 'Installations techniques', debit: 250000, credit: 0, solde: 250000, category: 'actif' },
  { code: '24', description: 'Matériel industriel', debit: 180000, credit: 0, solde: 180000, category: 'actif' },
  { code: '25', description: 'Matériel informatique', debit: 120000, credit: 0, solde: 120000, category: 'actif' },
  { code: '26', description: 'Mobilier', debit: 80000, credit: 0, solde: 80000, category: 'actif' },
  { code: '27', description: 'Écroulements', debit: 50000, credit: 0, solde: 50000, category: 'actif' },
  { code: '28', description: 'Avances et acomptes', debit: 100000, credit: 0, solde: 100000, category: 'actif' },
  { code: '29', description: 'Immobilisations en cours', debit: 150000, credit: 0, solde: 150000, category: 'actif' },
  { code: '30', description: 'Stocks de marchandises', debit: 400000, credit: 0, solde: 400000, category: 'actif' },
  { code: '31', description: 'Matières premières', debit: 150000, credit: 0, solde: 150000, category: 'actif' },
  { code: '32', description: 'Autres approvisionnements', debit: 100000, credit: 0, solde: 100000, category: 'actif' },
  { code: '33', description: 'En cours de production', debit: 200000, credit: 0, solde: 200000, category: 'actif' },
  { code: '34', description: 'Produits finis', debit: 180000, credit: 0, solde: 180000, category: 'actif' },
  { code: '35', description: 'Produits intermédiaires', debit: 120000, credit: 0, solde: 120000, category: 'actif' },
  { code: '36', description: 'Produits résiduels', debit: 50000, credit: 0, solde: 50000, category: 'actif' },
  { code: '38', description: 'Avances et acomptes versés', debit: 80000, credit: 0, solde: 80000, category: 'actif' },
  { code: '40', description: 'Fournisseurs et comptes rattachés', debit: 0, credit: 300000, solde: -300000, category: 'passif' },
  { code: '41', description: 'Clients et comptes rattachés', debit: 400000, credit: 0, solde: 400000, category: 'actif' },
  { code: '42', description: 'Personnel - Rémunérations dues', debit: 0, credit: 80000, solde: -80000, category: 'passif' },
  { code: '43', description: 'État et collectivités publiques', debit: 0, credit: 120000, solde: -120000, category: 'passif' },
  { code: '44', description: 'Associés - Comptes courants', debit: 0, credit: 50000, solde: -50000, category: 'passif' },
];

export default function BalanceSheetPage() {
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

  const handleGeneratePDF = () => {
    const pdfContent = `
      Bilan au ${new Date().toLocaleDateString('fr-FR')}
      ${staticBilanData.map(item => `${item.code} - ${item.description}: ${item.solde.toLocaleString()} XAF`).join('\n')}
    `;
    console.log('PDF Content:', pdfContent);
    alert('PDF généré - Contenu dans la console');
  };



  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setPeriodes([]);
  };
  const handleGenerateXLSX = () => {
    const xlsxContent = staticBilanData.map(item => ({
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

  const actifs = staticBilanData.filter(item => item.category === 'actif');
  const passifs = staticBilanData.filter(item => item.category === 'passif');
  const capitauxPropres = staticBilanData.filter(item => item.category === 'capitauxPropres');

  const totalActifs = actifs.reduce((sum, item) => sum + item.solde, 0);
  const totalPassifs = passifs.reduce((sum, item) => sum + item.solde, 0);
  const totalCapitauxPropres = capitauxPropres.reduce((sum, item) => sum + item.solde, 0);

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Bilan</h1>
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
                <span>Bilan au {new Date().toLocaleDateString('fr-FR')}</span>
                <span className="text-sm text-gray-500">
                  {selectedPeriodeId ? `Période: ${periodes.find(p => p.id === selectedPeriodeId)?.code}` : 'Aucune période sélectionnée'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Actifs */}
                <div>
                  <h2 className="text-xl font-semibold text-blue-600 border-b-2 border-blue-200 pb-2">Actifs (Total: {totalActifs.toLocaleString()} XAF)</h2>
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
                        {actifs.map((item, index) => (
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
                          <td colSpan={4} className="border border-gray-300 px-4 py-2 text-right">Sous-Total Actifs</td>
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
                          <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Intitulé</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Débit</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Crédit</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Solde</th>
                        </tr>
                      </thead>
                      <tbody>
                        {passifs.map((item, index) => (
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
                          <td colSpan={4} className="border border-gray-300 px-4 py-2 text-right">Sous-Total Passifs</td>
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
                          <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Intitulé</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Débit</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Crédit</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Solde</th>
                        </tr>
                      </thead>
                      <tbody>
                        {capitauxPropres.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-mono">{item.code}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">{item.debit.toLocaleString()}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">{item.credit.toLocaleString()}</td>
                            <td className={`border border-gray-300 px-4 py-2 text-right font-bold ${item.solde >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                              {item.solde.toLocaleString()} XAF
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-200 font-bold">
                          <td colSpan={4} className="border border-gray-300 px-4 py-2 text-right">Sous-Total Capitaux Propres</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{totalCapitauxPropres.toLocaleString()} XAF</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Total Général */}
                <div className="mt-4 text-right text-lg font-bold">
                  <p>Total Actifs: {totalActifs.toLocaleString()} XAF</p>
                  <p>Total Passifs + Capitaux Propres: {(totalPassifs + totalCapitauxPropres).toLocaleString()} XAF</p>
                  <p className="text-green-600">Écart: {(totalActifs + totalPassifs + totalCapitauxPropres).toLocaleString()} XAF</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}