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
    password?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    company?: string;
}

export interface SystemAudit {
    id: string;
    user: string;
    action: string;
    date: string | Date;
    remarks: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    password: string;
}