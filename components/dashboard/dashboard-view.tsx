"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { SalesChart } from "./sales-chart";
import { RecentSales } from "./recent-sales";
import { Order } from "@/types/sales";

interface DashboardViewProps {
    kpis: {
        totalRevenue: number;
        orderCount: number;
        newClients: number;
        avgOrderValue: number;
    };
    salesByMonth: { name: string; total: number }[];
    recentSales: Order[];
}

export function DashboardView({ kpis, salesByMonth, recentSales }: DashboardViewProps) {
    return (
        <div className="space-y-4">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Chiffre d'Affaires Total" value={`${kpis.totalRevenue.toLocaleString('fr-FR')} XAF`} variant="primary" />
                <StatCard title="Commandes" value={`+${kpis.orderCount.toLocaleString('fr-FR')}`} />
                <StatCard title="Valeur Moy. Commande" value={`${kpis.avgOrderValue.toLocaleString('fr-FR')} XAF`} />
                <StatCard title="Nouveaux Clients (Année)" value={`+${kpis.newClients}`} />
             </div>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Vue d'ensemble</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <SalesChart data={salesByMonth} />
                    </CardContent>
                </Card>
                 <Card className="col-span-4 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Ventes Récentes</CardTitle>
                        <CardDescription>
                            Vous avez réalisé {recentSales.length} ventes aujourd'hui.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RecentSales sales={recentSales} />
                    </CardContent>
                </Card>
             </div>
        </div>
    );
}