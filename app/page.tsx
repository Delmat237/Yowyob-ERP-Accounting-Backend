import { getClients, getOrders } from "@/lib/api";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { format, parseISO, startOfMonth, getMonth } from "date-fns";
import { fr } from 'date-fns/locale';

export default async function DashboardPage() {

    const orders = await getOrders();
    const clients = await getClients();
    
    const currentYear = new Date().getFullYear();

    const ordersThisYear = orders.filter(order => new Date(order.orderDate).getFullYear() === currentYear);

    const totalRevenue = ordersThisYear.reduce((sum, order) => sum + order.netToPay, 0);
    const orderCount = ordersThisYear.length;
    const avgOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;
    
    const clientsThisYear = clients.filter(client => {
        // Supposons qu'un client ait une date de création, pour l'instant on simule
        const creationDate = client.id ? new Date() : new Date();
        return creationDate.getFullYear() === currentYear;
    });
    const newClients = clientsThisYear.length;

    const salesByMonth = Array.from({ length: 12 }).map((_, i) => {
        const monthName = format(new Date(0, i), 'MMM', { locale: fr });
        return { name: monthName, total: 0 };
    });

    for (const order of ordersThisYear) {
        const month = getMonth(new Date(order.orderDate));
        salesByMonth[month].total += order.netToPay;
    }
    
    const recentSales = orders
        .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
        .slice(0, 5);

    const kpis = {
        totalRevenue,
        orderCount,
        newClients,
        avgOrderValue
    };
    
    return (
        <DashboardView 
            kpis={kpis}
            salesByMonth={salesByMonth}
            recentSales={recentSales}
        />
    );
}