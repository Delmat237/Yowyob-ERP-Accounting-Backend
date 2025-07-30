export interface Warehouse {
    id: string;
    name: string;
}

export interface StockMovementItem {
    productId: string;
    quantity: number;
    costPrice: number;
}

export interface StockMovement {
    id: string;
    type: 'entry' | 'exit';
    reference: string;
    date: string | Date;
    warehouseId: string;
    notes?: string;
    items: StockMovementItem[];
}

export interface InventoryItem {
    productId: string;
    productCode: string;
    productName: string;
    theoreticalQty: number; // Stock machine au moment de la création
    physicalQty: number | null; // Stock physique compté
}

export interface Inventory {
    id: string;
    reference: string;
    warehouseId: string;
    date: string | Date;
    status: 'En cours' | 'Validé' | 'Annulé';
    type: 'Annuel' | 'Spontané' | 'Tournant';
    notes?: string;
    items: InventoryItem[];
}