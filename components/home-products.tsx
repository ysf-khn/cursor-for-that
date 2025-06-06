"use client";

import { getPricingBadgeStyle } from "@/utils/formatting";
import { ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { Category } from "@/lib/types";
import { Badge } from "./ui/badge";
import { CompactLikeButton } from "./like-button";

export const HomeProducts = ({
  categories,
  categoryProducts,
}: {
  categories: Category[];
  categoryProducts: Record<string, (Product & { isLiked: boolean })[]>;
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryProducts[category.id]?.slice(0, 4).map((product) => (
                <article
                  key={product.id}
                  className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:border-primary/40 hover:-translate-y-2 flex flex-col h-full backdrop-blur-sm"
                >
                  {/* Header Section with Logo and Actions */}
                  <div className="p-5 pb-3">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <Link
                        href={`/products/${product.slug}`}
                        className="flex items-center gap-3 flex-1 min-w-0 group/link"
                      >
                        {/* Logo */}
                        {product.logo_url ? (
                          <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-muted/50 flex-shrink-0 ring-1 ring-border/50 group-hover:ring-primary/30 transition-all duration-300">
                            <Image
                              src={product.logo_url}
                              alt={`${product.name} logo`}
                              fill
                              className="object-contain"
                              sizes="48px"
                            />
                          </div>
                        ) : (
                          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 via-primary/30 to-primary/40 flex items-center justify-center flex-shrink-0 ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                            <span className="text-primary font-bold text-xl">
                              {product.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}

                        {/* Product Name */}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover/link:text-primary transition-colors duration-300">
                            {product.name}
                          </h3>
                        </div>
                      </Link>

                      {/* Actions Column */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Badge
                          className={`${getPricingBadgeStyle(
                            product.pricing
                          )} text-xs font-medium px-2.5 py-1`}
                        >
                          {product.pricing}
                        </Badge>
                        <CompactLikeButton
                          productId={product.id}
                          initialIsLiked={product.isLiked}
                          initialLikeCount={product.like_count || 0}
                          className="self-end"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Product Image */}
                  {product.image_url && (
                    <div className="px-5 pb-4">
                      <Link
                        href={`/products/${product.slug}`}
                        className="block"
                      >
                        <div className="relative w-full h-36 rounded-xl overflow-hidden bg-gradient-to-br from-muted/30 to-muted/60 border border-border/30 group-hover:border-primary/20 transition-all duration-300">
                          <Image
                            src={product.image_url}
                            alt={`${product.name} screenshot`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </Link>
                    </div>
                  )}

                  {/* Content Section */}
                  <div className="px-5 pb-5 flex-1 flex flex-col">
                    {/* Description */}
                    <Link
                      href={`/products/${product.slug}`}
                      className="flex-1 mb-4"
                    >
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                        {product.description}
                      </p>
                    </Link>

                    {/* Action Buttons */}
                    <div className="flex gap-2.5 mt-auto">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="flex-1 h-9 text-xs font-medium border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                      >
                        <Link href={`/products/${product.slug}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        className="flex-1 h-9 text-xs font-medium bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <a
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5"
                        >
                          Visit Site
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
