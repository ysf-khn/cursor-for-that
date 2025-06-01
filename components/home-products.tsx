"use client";

import { getPricingBadgeStyle } from "@/utils/formatting";
import { ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { Category } from "@/lib/types";
import { Badge } from "./ui/badge";

export const HomeProducts = ({
  categories,
  categoryProducts,
}: {
  categories: Category[];
  categoryProducts: Record<string, Product[]>;
}) => {
  return (
    <div className="space-y-16 p-6">
      {categories?.map((category) => (
        <section key={category.id} className="space-y-6">
          {categoryProducts[category.id]?.length > 0 && (
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-foreground">
                {category.name}
              </h2>
              <Link
                href={`/categories/${category.slug}`}
                className="text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-2 group"
              >
                View All ({categoryProducts[category.id]?.length || 0})
                <span className="inline-block group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </div>
          )}

          {categoryProducts[category.id]?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoryProducts[category.id]?.slice(0, 4).map((product) => (
                <article
                  key={product.id}
                  className="group relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1"
                >
                  <div className="p-6 space-y-4">
                    {/* Logo and Pricing Badge */}
                    <div className="flex items-start justify-between">
                      <Link
                        href={`/products/${product.slug}`}
                        className="w-full relative flex items-center justify-between gap-2"
                      >
                        {/* Logo */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
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

                          {/* Product Name */}
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                          </div>
                        </div>

                        {/* Pricing Badge */}
                        <Badge
                          className={getPricingBadgeStyle(product.pricing)}
                        >
                          {product.pricing}
                        </Badge>
                      </Link>
                    </div>

                    {/* Description */}
                    <Link href={`/products/${product.slug}`}>
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {product.description}
                      </p>
                    </Link>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
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
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
};
