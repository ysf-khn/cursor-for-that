import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Params {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // ISR every 60 seconds

/**
 * Generate dynamic metadata for product pages
 */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;

  const { data: product } = await supabase
    .from("products")
    .select("name, description, pricing, image_url")
    .eq("slug", slug)
    .single();

  if (!product) {
    return {
      title: "Product Not Found | AI-Powered SaaS Directory",
      description: "The requested product could not be found.",
    };
  }

  return {
    title: `${product.name} - AI Tool | AI-Powered SaaS Directory`,
    description: `${
      product.description
    } Discover this ${product.pricing.toLowerCase()} AI tool in our curated AI-powered SaaS directory.`,
    keywords: [
      product.name,
      "AI tool",
      "AI software",
      product.pricing.toLowerCase(),
      "AI-powered software",
      "SaaS tool",
      "artificial intelligence",
    ],
    openGraph: {
      title: `${product.name} - AI Tool`,
      description: product.description,
      type: "website",
      url: `/products/${slug}`,
      images: product.image_url
        ? [
            {
              url: product.image_url,
              width: 1200,
              height: 630,
              alt: `${product.name} - AI tool`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} - AI Tool`,
      description: product.description,
      images: product.image_url ? [product.image_url] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `/products/${slug}`,
    },
  };
}

export default async function ProductDetailsPage({ params }: Params) {
  const { slug } = await params;

  // Fetch the selected product with category
  const { data: product, error } = await supabase
    .from("products")
    .select("*, category:categories(name, slug)")
    .eq("slug", slug)
    .single();

  if (!product || error) return notFound();

  // Fetch related products from the same category (excluding current product)
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("id, name, logo_url, image_url, slug")
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .limit(4);

  return (
    <div className="p-6 space-y-12 max-w-full xl:max-w-7xl mx-auto">
      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden bg-white dark:bg-black">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
              No Image
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                product.pricing === "Free"
                  ? "bg-green-100 text-green-800"
                  : product.pricing === "Freemium"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-purple-100 text-purple-800"
              }`}
            >
              {product.pricing}
            </p>
          </div>
          <p className="text-muted-foreground mb-4">{product.description}</p>

          <div className="space-y-2 mb-4">
            <p className="text-sm">
              <span className="font-medium">Category:</span>{" "}
              <Link
                href={`/categories/${product.category.slug}`}
                className="text-primary hover:underline"
              >
                {product.category.name}
              </Link>
            </p>
          </div>

          {product.url && (
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
            >
              Visit Website
            </a>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Related Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group block border rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="space-y-8 ">
                  {/* Product Icon */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 bg-muted rounded-lg overflow-hidden">
                      {p.logo_url ? (
                        <Image
                          src={p.logo_url}
                          alt={`${p.name} logo`}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                          Logo
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold truncate">{p.name}</h3>
                  </div>

                  {/* Product Image */}
                  <div className="relative w-full aspect-[2/1] bg-muted rounded-md overflow-hidden">
                    {p.image_url ? (
                      <Image
                        src={p.image_url}
                        alt={p.name}
                        fill
                        className="object-contain group-hover:scale-105 transition duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
