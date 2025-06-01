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
            "id, name, description, url, pricing, logo_url, image_url, category_id, category_name, featured, status, created_at, updated_at, slug"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
              <div className="group p-8 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  AI-Powered Tools
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Discover cutting-edge SaaS applications that harness the power
                  of artificial intelligence to streamline your workflows.
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  Curated Selection
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every tool is carefully reviewed and categorized to help you
                  find exactly what you need for your specific use case.
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  Community Driven
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Built by the community, for the community. Submit your
                  favorite tools and help others discover amazing solutions.
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-24 p-12 rounded-3xl bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 border border-primary/20">
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Ready to discover your next favorite tool?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who use our directory to find
                the perfect AI-powered solutions for their needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="px-8">
                  <Link href="/categories">
                    Browse All Categories
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8">
                  <Link href="/submit">Submit Your Tool</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
