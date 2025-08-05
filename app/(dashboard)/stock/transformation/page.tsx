import { ProductTransformationForm } from "@/components/stock/transformation/product-transformation-form";
import { getProducts, getWarehouses } from "@/lib/api";

export default async function ProductTransformationPage() {
  const products = await getProducts();
  const warehouses = await getWarehouses();

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-shrink-0">
        <h1 className="text-xl lg:text-2xl font-bold tracking-tight">Transformation de Produit</h1>
        <p className="text-muted-foreground text-sm">
          Consommez des articles en stock pour en créer de nouveaux.
        </p>
      </div>
      <div className="flex-grow min-h-0">
        <ProductTransformationForm products={products} warehouses={warehouses} />
      </div>
    </div>
  );
}