export interface Client {
  id: string;
  code: string;
  companyName: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  fax?: string;
  email?: string;
  website?: string;
  contactPerson?: string;
  legalForm?: string;
  clientFamily?: string;
  clientType?: string;
  paymentTerms?: string;
  isTaxable: boolean;
  pricingLevels: ('detail' | 'demi-gros' | 'gros' | 'super-gros')[];
  balance: number;
  isActive: boolean;
  notes?: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  family?: string;
  stock: number;
  costPrice: number;
  salePrice: number;
  wholesalePrice: number;
  semiWholesalePrice: number;
  mainSupplier?: string;
  purchaseUnit?: string;
  saleUnit?: string;
  supplierRef?: string;
  billingStation?: string;
  notes?: string;
  isPerishable: boolean;
  isDiscountable: boolean;
  isActive: boolean;
}

export interface Supplier {
  id: string;
  code: string;
  companyName: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  balance: number;
  isActive: boolean;
  notes?: string;
}