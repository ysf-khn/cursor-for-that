import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";
import {
  Code,
  PenTool,
  Briefcase,
  FileText,
  Wrench,
  BarChart3,
  Palette,
  Megaphone,
  Headphones,
  FolderKanban,
  MessageSquare,
  Users,
  Calculator,
  UserCheck,
  ShoppingCart,
  Shield,
  TrendingUp,
  Share2,
  Video,
  GraduationCap,
  Zap,
  Search,
  Mail,
  Globe,
  Layers,
  Brain,
  Database,
  Smartphone,
  Scale,
  CreditCard,
  Target,
  Home,
  BookOpen,
  Gavel,
  TestTube,
  CheckSquare,
  Cpu,
  LucideIcon,
  Presentation,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Browse Product Categories",
  description:
    "Explore AI-powered SaaS tools organized by category. Find coding tools, productivity apps, writing assistants, design software, and more AI-enhanced solutions for your workflow.",
  keywords: [
    "AI tool categories",
    "SaaS categories",
    "coding tools",
    "productivity tools",
    "writing tools",
    "design tools",
    "AI software categories",
    "business tools",
    "developer tools",
  ],
  openGraph: {
    title: "Browse Product Categories | Cursor For That",
    description:
      "Explore AI-powered SaaS tools organized by category. Find the perfect AI solution for coding, productivity, writing, design, and more.",
    type: "website",
    url: "/categories",
  },
  twitter: {
    card: "summary",
    title: "Browse Product Categories | Cursor For That",
    description:
      "Explore AI-powered SaaS tools organized by category. Find the perfect AI solution for your workflow.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const revalidate = 60; // ISR every 60s

// Function to get the appropriate icon for each category
function getCategoryIcon(categoryName: string): LucideIcon {
  const iconMap: Record<string, LucideIcon> = {
    "AI Writing": PenTool,
    "Code Automation": Code,
    "Task Management": CheckSquare,
    "Content Creation": FileText,
    "Developer Tools": Wrench,
    "Data Analysis": BarChart3,
    "Design & UI/UX": Palette,
    "Marketing Automation": Megaphone,
    "Customer Support": Headphones,
    "Project Management": FolderKanban,
    Communication: MessageSquare,
    "Sales & CRM": Users,
    Slides: Presentation,
    "Finance & Accounting": Calculator,
    "HR & Recruitment": UserCheck,
    "E-commerce": ShoppingCart,
    Security: Shield,
    Trading: TrendingUp,
    Analytics: TrendingUp,
    "Social Media": Share2,
    "Video & Audio": Video,
    "Education & Training": GraduationCap,
    Productivity: Zap,
    SEO: Search,
    Email: Mail,
    Coding: Code,
    Marketing: Megaphone,
    Writing: PenTool,
    "3D Modeling": Layers,
    Biotech: Brain,
    "Business Intelligence": Database,
    DevOps: Cpu,
    Ecommerce: ShoppingCart,
    Spreadsheets: BarChart3,
    "File Management": FolderKanban,
    "Game Dev": Smartphone,
    Government: Scale,
    "Hardware/IoT": Cpu,
    Legal: Gavel,
    Payments: CreditCard,
    "Product Management": Target,
    "Real Estate": Home,
    Research: BookOpen,
    "Smart Contracts": Scale,
    Testing: TestTube,
    "Web Scraping": Globe,
  };

  return iconMap[categoryName] || Briefcase; // Default icon if category not found
}

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
        {categories.map((category) => {
          const IconComponent = getCategoryIcon(category.name);
          return (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="border rounded-xl p-6 bg-card transition flex flex-col justify-between hover:bg-card/80 hover:cursor-pointer hover:border-primary hover:shadow-lg hover:shadow-primary/20 "
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-semibold">{category.name}</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
              <Badge className="mt-4 w-fit">
                {category.products[0].count || 0} tools
              </Badge>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
