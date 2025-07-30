export interface PermissionSet {
    read: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
}

export interface Profile {
    id: string;
    name: string;
    description: string;
    permissions: Record<string, PermissionSet>; // ex: { "stock_status": { read: true, ... } }
    authorizedPrices: string[];
    authorizedWarehouses: string[];
    authorizedPaymentModes: string[];
    authorizedDiscounts: string[];
}

export interface User {
    id: string;
    code: string;
    name: string;
    title: string;
    profileId: string;
    creationDate: string | Date;
    password?: string; // Ne sera jamais renvoyé par une vraie API
}

export interface SystemAudit {
    id: string;
    user: string;
    action: string;
    date: string | Date;
    remarks: string;
}