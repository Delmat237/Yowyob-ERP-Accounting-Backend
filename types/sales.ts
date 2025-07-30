export interface ClientSummary {
  id: string;
  name: string;
  reference: string;
  address?: string;
}

export interface Article {
  id: string;
  reference: string;
  name: string;
  price: number;
  stock: number;
}

export interface OrderItem {
  id: string;
  code: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  poste?: string;
  depot?: string;
}

export type OrderStatus = 'Draft' | 'Reserved' | 'Confirmed' | 'Delivered' | 'Invoiced' | 'Cancelled';
export type OrderPaymentType = 'Cash' | 'Check' | 'Credit' | 'Transfer';

export interface Order {
  id: string;
  client: ClientSummary;
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: OrderPaymentType;
  orderDate: Date;
  deliveryDate?: Date;
  endDate?: Date;
  salesperson?: string;
  notes?: string;
  motif?: string;
  items: OrderItem[];
  totalHT: number;
  totalDiscount: number;
  totalNetHT: number;
  precompte: number;
  totalTVA: number;
  totalTTC: number;
  netToPay: number;
}

export interface OrderJournalEntry {
    id: string;
    blNumber: string;
    clientName: string;
    amountHT: number;
    discount: number;
    tva: number;
    precompte: number;
    commission: number;
    orderDate: Date;
    status: 'Facturée' | 'Livrée' | 'Annulée';
    salesperson: string;
    items: OrderItem[];
}

export interface Payment {
  id: string;
  date: Date;
  amount: number;
  method: 'Espèce' | 'Chèque' | 'Virement' | 'Carte' | 'Mobile Money';
  notes?: string;
}

export type InvoiceStatus = 'NP' | 'PP' | 'P' | 'A';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  client: ClientSummary;
  orderDate: Date;
  dueDate: Date;
  status: InvoiceStatus;
  items: OrderItem[];
  payments: Payment[];
  
  totalHT: number;
  totalDiscount: number;
  totalNetHT: number;
  precompte: number;
  totalTVA: number;
  totalTTC: number;
  totalPaid: number;
  balanceDue: number;
}