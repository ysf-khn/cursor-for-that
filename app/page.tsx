import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { ArrowRight, Sparkles, Zap, Target } from "lucide-react";
import Link from "next/link";
import { Category, Product } from "@/lib/types";
import { HomeProducts } from "@/components/home-products";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("relevance", { ascending: true });

  const categoryProducts: Record<string, Product[]> = {};

  if (categories) {
    await Promise.all(
      categories.map(async (cat) => {
        const { data: products } = await supabase
          .from("products")
          .select(
            "id, name, description, url, pricing, logo_url, image_url, category_id, category_name, featured, status, created_at, updated_at"
          )
          .eq("category_id", cat.id);

        categoryProducts[cat.id] = products || [];
      })
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center max-w-7xl">
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 transition-colors"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              The Community&apos;s Directory
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Find the Perfect{" "}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                AI-Powered
              </span>{" "}
              SaaS
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover the next generation of SaaS tools that leverage AI
              prompts to revolutionize your coding, writing, productivity, and
              creative workflows.
            </p>

            {/* Categories and Products */}
            <HomeProducts
              categories={categories as Category[]}
              categoryProducts={categoryProducts}
            />

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
              <div className="group p-6 flex flex-col items-center rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Lightning Fast
                </h3>
                <p className="text-sm text-muted-foreground">
                  Instantly find tools that match your specific workflow needs
                </p>
              </div>

              <div className="group p-6 flex flex-col items-center rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Curated Selection
                </h3>
                <p className="text-sm text-muted-foreground">
                  Hand-picked tools that actually deliver on their AI promises
                </p>
              </div>

              <div className="group p-6 flex flex-col items-center rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Always Updated
                </h3>
                <p className="text-sm text-muted-foreground">
                  Fresh discoveries and the latest AI-powered innovations
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="group">
                <Link href="/categories">
                  Explore All Categories
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/submit">Submit Your Product</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
