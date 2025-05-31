import { ProductCard } from "./product-card";
import { Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-96 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl animate-pulse shadow-sm"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center shadow-lg">
            <svg
              className="h-12 w-12 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-primary mb-3">
            No products found
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Try adjusting your search criteria or browse all categories to
            discover amazing tools.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
