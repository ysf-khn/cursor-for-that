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
import { Metadata } from "next";
import { getProductsWithLikeStatus } from "@/actions/products";
import { CompactLikeButton } from "@/components/like-button";
import { getPricingBadgeStyle } from "@/utils/formatting";

interface Params {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // ISR every 60 seconds

/**
 * Generate dynamic metadata for category pages
 */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;

  const { data: category } = await supabase
    .from("categories")
    .select("id, name, description")
    .eq("slug", slug)
    .single();

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    };
  }

  const { data: products } = await supabase
    .from("products")
    .select("id")
    .eq("category_id", category.id)
    .eq("status", "active");

  const productCount = products?.length || 0;

  return {
    title: `Cursor For ${category.name}`,
    description: category.description
      ? `${
          category.description
        } Discover ${productCount} AI-powered ${category.name.toLowerCase()} tools in our curated directory.`
      : `Explore ${productCount} AI-powered ${category.name.toLowerCase()} tools. Find the perfect solution for your ${category.name.toLowerCase()} needs.`,
    keywords: [
      `${category.name.toLowerCase()} AI tools`,
      `${category.name.toLowerCase()} software`,
      `AI ${category.name.toLowerCase()}`,
      `${category.name.toLowerCase()} SaaS`,
      "AI-powered tools",
      "artificial intelligence",
      "productivity tools",
    ],
    openGraph: {
      title: `${category.name} Products | Cursor For That`,
      description: `Discover ${productCount} AI-powered ${category.name.toLowerCase()} tools. ${
        category.description ||
        `Find the perfect solution for your ${category.name.toLowerCase()} needs.`
      }`,
      type: "website",
      url: `/categories/${slug}`,
    },
    twitter: {
      card: "summary",
      title: `${category.name} Products | Cursor For That`,
      description: `Discover ${productCount} AI-powered ${category.name.toLowerCase()} tools in our curated directory.`,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `/categories/${slug}`,
    },
  };
}

/**
 * Utility function to truncate description
 */
function truncateDescription(description: string, maxLength: number) {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength).trim() + "...";
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) return notFound();

  // Use getProductsWithLikeStatus to fetch products with like information
  const allProducts = await getProductsWithLikeStatus();
  const products = allProducts.filter(
    (product) =>
      product.category_id === category.id && product.status === "active"
  );

  // // Sort products by creation date (newest first)
  // products.sort(
  //   (a, b) =>
  //     new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  // );

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
      <div className="container mx-auto px-4 py-8">
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
              "grid max-w-full md:max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto"
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
    image_url: string | null;
    featured: boolean;
    created_at: string;
    slug: string;
    like_count: number;
    isLiked: boolean;
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
                  className="object-contain"
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
                <Link href={`/products/${product.slug}`}>{product.name}</Link>
              </CardTitle>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {product.featured && (
              <Badge variant="secondary" className="text-xs">
                Featured
              </Badge>
            )}
            <CompactLikeButton
              productId={product.id}
              initialIsLiked={product.isLiked}
              initialLikeCount={product.like_count}
              className="self-end"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="outline" className="text-xs">
            {categoryName}
          </Badge>
          <Badge className={`text-xs ${getPricingBadgeStyle(product.pricing)}`}>
            {product.pricing}
          </Badge>
        </div>
      </CardHeader>

      {/* Product Image */}
      {product.image_url && (
        <div className="px-6 pb-4">
          <Link href={`/products/${product.slug}`} className="block">
            <div className="relative w-full h-52 rounded-lg overflow-hidden bg-muted/50 border border-border/50">
              <Image
                src={product.image_url}
                alt={`${product.name} screenshot`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </Link>
        </div>
      )}

      <CardContent className="flex-1 flex flex-col">
        <CardDescription className="text-sm leading-relaxed flex-1 line-clamp-3">
          {truncateDescription(product.description, 120)}
        </CardDescription>

        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
          <Button asChild size="sm" variant="outline" className="flex-1">
            <Link href={`/products/${product.slug}`}>Details</Link>
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
