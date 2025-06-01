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
                        href={`/products/${product.id}`}
                        className="w-full relative flex items-center justify-between gap-2"
                      >
                        {product.logo_url ? (
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                            <Image
                              src={product.logo_url}
                              alt={`${product.name} logo`}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center flex-shrink-0 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                            <span
                              className="text-primary font-bold text-lg"
                              aria-hidden="true"
                            >
                              {product.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <Badge
                          variant="outline"
                          className={`text-xs font-medium ${getPricingBadgeStyle(
                            product.pricing
                          )}`}
                        >
                          {product.pricing}
                        </Badge>
                      </Link>
                    </div>

                    {/* Product Details */}
                    <Link
                      href={`/products/${product.id}`}
                      className="block space-y-2 transition-colors"
                    >
                      <h3 className="font-semibold text-lg truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {product.description}
                      </p>
                    </Link>
                  </div>

                  {/* Visit Button */}
                  <div className="px-6 pb-6">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="w-full group/btn bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 hover:border-primary transition-all"
                    >
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        Visit Site
                        <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </a>
                    </Button>
                  </div>

                  {/* Hover overlay effect */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  />
                </article>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
};
