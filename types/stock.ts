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
    theoreticalQty: number;
    physicalQty: number | null;
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

export interface WarehouseTransferItem {
    productId: string;
    quantity: number;
    costPrice: number;
}

export interface WarehouseTransfer {
    id: string;
    reference: string;
    date: string | Date;
    sourceWarehouseId: string;
    destinationWarehouseId: string;
    description?: string;
    notes?: string;
    items: WarehouseTransferItem[];
}

export interface ProductTransformationItem {
    productId: string;
    quantity: number;
    costPrice: number;
}

export interface ProductTransformation {
    id: string;
    reference: string;
    date: string | Date;
    warehouseId: string;
    description?: string;
    notes?: string;
    inputItems: ProductTransformationItem[];
    outputItems: ProductTransformationItem[];
}