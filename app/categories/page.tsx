import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const revalidate = 60; // ISR every 60s

export default async function CategoriesPage() {
  // Fetch categories and count of products
  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug, description, products(count)")
    .order("relevance", { ascending: true });

  if (error || !categories) {
    return <div className="p-6">Failed to load categories.</div>;
  }

  return (
    <div className="p-6 space-y-8 max-w-full xl:max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center py-8">All Categories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="border rounded-xl p-6 bg-card transition flex flex-col justify-between hover:bg-card/80 hover:cursor-pointer hover:border-primary hover:shadow-lg hover:shadow-primary/20 "
          >
            <div>
              <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            </div>
            <Badge className="mt-4 w-fit">
              {category.products[0].count || 0} tools
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
