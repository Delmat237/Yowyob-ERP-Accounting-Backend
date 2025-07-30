export interface GeneralOptions {
    id: 'main';
    general: {
        autoInvoiceFromDelivery: boolean;
        autoAccountingInterface: boolean;
        autoTreasuryInterface: boolean;
        printTradeRegistryOnInvoice: boolean;
        useCashRegisterPrinter: boolean;
        allowEntriesInClosedPeriod: boolean;
        decimalPlaces: number;
        maxTechnicalMargin: number;
        dateFormat: string;
        isSupermarket: boolean;
        modifySalePriceOnPurchase: boolean;
    };
    sales: {
        canNegotiatePrice: boolean;
        priceIncludesVAT: boolean;
        allowMultiWarehouseSales: boolean;
        stockValueDisplay: '%' | 'Valeur';
        allowTechnicalInvoices: boolean;
        allowDocumentChanges: boolean;
        maxDiscountRate: number;
        cancellationDays: {
            invoices: number;
            creditNotes: number;
            deliveries: number;
            purchases: number;
        };
    };
    termInvoicing: {
        vatInvoicePrefix: string;
        vatInvoiceSuffix: string;
        vatInvoiceLength: number;
        noVatInvoicePrefix: string;
        noVatInvoiceSuffix: string;
        noVatInvoiceLength: number;
        leftSignature: string;
        rightSignature: string;
        middleSignature: string;
    };
    cashInvoicing: {
        vatInvoicePrefix: string;
        vatInvoiceSuffix: string;
        vatInvoiceLength: number;
        noVatInvoicePrefix: string;
        noVatInvoiceSuffix: string;
        noVatInvoiceLength: number;
        useCashRegisterBalance: boolean;
    };
    printing: {
        previewBeforePrint: boolean;
        orientation: 'Portrait' | 'Paysage';
        width: number;
        height: number;
        format: string;
    };
}

export interface FiscalYear {
    id: string;
    name: string;
    startDate: string | Date;
    endDate: string | Date;
    status: 'Ouvert' | 'En cours' | 'Clôturé';
}