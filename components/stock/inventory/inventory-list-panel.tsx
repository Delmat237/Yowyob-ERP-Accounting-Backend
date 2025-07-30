import { Inventory } from '@/types/stock';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface InventoryListPanelProps {
    inventories: Inventory[];
    selectedId: string | null;
    onSelect: (inventory: Inventory) => void;
}

const statusVariantMap: Record<Inventory['status'], "success" | "warning" | "default"> = {
    "Validé": "success",
    "En cours": "warning",
    "Annulé": "default",
};

export function InventoryListPanel({ inventories, selectedId, onSelect }: InventoryListPanelProps) {
    return (
        <div className="space-y-2">
            {inventories.map(inv => (
                <div
                    key={inv.id}
                    onClick={() => onSelect(inv)}
                    className={cn(
                        "p-3 rounded-lg cursor-pointer border hover:bg-accent",
                        selectedId === inv.id && "bg-primary/10 border-primary"
                    )}
                >
                    <div className="flex justify-between items-start">
                        <p className="font-semibold">{inv.reference}</p>
                        <Badge variant={statusVariantMap[inv.status] || 'default'}>
                            {inv.status}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {format(new Date(inv.date), 'dd MMMM yyyy')} - {inv.type}
                    </p>
                </div>
            ))}
        </div>
    );
}