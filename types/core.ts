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
    paymentTerms?: string; // Régime client
    isTaxable: boolean;
    pricingLevels: ('detail' | 'demi-gros' | 'gros' | 'super-gros')[];
    balance: number;
    isActive: boolean;
    notes?: string;
  }
  
  export interface Product {
    id: string;
    code: string; // Ref Vente
    name: string; // Libellé
    family?: string; // Famille ou catégories
    mainSupplier?: string;
    purchaseUnit?: string; // Conditionnement achat
    saleUnit?: string; // Conditionnement vente
    supplierRef?: string; // Ref. Art. fourn.
    billingStation?: string; // Poste facturation
    notes?: string;
    isPerishable: boolean;
    isDiscountable: boolean;
    isActive: boolean;
  }