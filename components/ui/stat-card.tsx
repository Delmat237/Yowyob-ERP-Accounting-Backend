
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  variant?: "default" | "primary" | "destructive";
  className?: string;
}

export function StatCard({ title, value, icon, variant = "default", className }: StatCardProps) {
  const baseClasses = "rounded-lg border";
  const variantClasses = {
    default: "bg-card text-card-foreground",
    primary: "bg-primary/10 border-primary/20 text-primary",
    destructive: "bg-destructive/10 border-destructive/20 text-destructive",
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      <div className="p-3">
        <p className="text-xs uppercase font-semibold text-muted-foreground">{title}</p>
        <p className="text-l font-bold mt-1">{value}</p>
      </div>
    </div>
  );
}