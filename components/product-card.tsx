import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  const getPricingColor = (pricing: string) => {
    switch (pricing.toLowerCase()) {
      case "free":
        return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30";
      case "freemium":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30";
      case "paid":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30";
      default:
        return "bg-muted text-muted-foreground hover:bg-muted/80";
    }
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
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
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-bold text-lg">
                  {product.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg leading-tight line-clamp-2">
                {product.name}
              </CardTitle>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="secondary" className="text-xs">
            {product.category_name ||
              product.categories?.name ||
              "Uncategorized"}
          </Badge>
          <Badge className={`text-xs ${getPricingColor(product.pricing)}`}>
            {product.pricing}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <CardDescription className="text-sm text-muted-foreground leading-relaxed flex-1">
          {truncateDescription(product.description)}
        </CardDescription>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <Link
            href={`/products/${product.slug}`}
            className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
          >
            Learn More
          </Link>
          <Button asChild size="sm" className="h-8">
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              Visit
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
