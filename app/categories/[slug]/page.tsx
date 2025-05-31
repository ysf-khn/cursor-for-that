import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Params {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    search?: string;
    pricing?: string;
    view?: "grid" | "list";
  }>;
}

export const revalidate = 60; // ISR every 60s

/**
 * Get pricing badge color based on pricing type
 */
function getPricingColor(pricing: string): string {
  switch (pricing.toLowerCase()) {
    case "free":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "freemium":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "paid":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
}

/**
 * Truncate description text to specified length
 */
function truncateDescription(text: string, maxLength: number = 120): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) return notFound();

  const { data: products } = await supabase
    .from("products")
    .select(
      "id, name, description, url, pricing, logo_url, featured, created_at"
    )
    .eq("category_id", category.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-8">
          {/* Category Header */}
          <div className="space-y-4 text-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-center">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-xl text-muted-foreground text-center mt-2">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto flex justify-center px-4 py-8">
        {/* Products Grid/List */}
        {!products || products.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No tools found</h3>
                  <p className="text-muted-foreground">
                    No tools have been added to the {category.name} category
                    yet.
                  </p>
                </div>

                <Button asChild>
                  <Link href="/submit">Submit a tool</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              "grid max-w-full md:max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            }
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={category.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Product Card Component
 * Displays product information in grid or list view
 */
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    url: string;
    pricing: string;
    logo_url: string | null;
    featured: boolean;
    created_at: string;
  };
  categoryName: string;
}

function ProductCard({ product, categoryName }: ProductCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg hover:shadow-primary/20 hover:border-primary/30 hover:bg-card/80 transition-all duration-300 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            {product.logo_url ? (
              <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={product.logo_url}
                  alt={`${product.name} logo`}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-lg">
                  {product.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg leading-tight line-clamp-2 transition-colors">
                <Link href={`/products/${product.id}`}>{product.name}</Link>
              </CardTitle>
            </div>
          </div>
          {product.featured && (
            <Badge variant="secondary" className="text-xs ml-2">
              Featured
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="outline" className="text-xs">
            {categoryName}
          </Badge>
          <Badge className={`text-xs ${getPricingColor(product.pricing)}`}>
            {product.pricing}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <CardDescription className="text-sm leading-relaxed flex-1 line-clamp-3">
          {truncateDescription(product.description, 120)}
        </CardDescription>

        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
          <Button asChild size="sm" variant="outline" className="flex-1">
            <Link href={`/products/${product.id}`}>Details</Link>
          </Button>
          <Button asChild size="sm" className="flex-1">
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1"
            >
              Visit
              <ExternalLink className="w-3 h-3" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
