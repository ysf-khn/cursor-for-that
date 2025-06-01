import { z } from "zod";

// Category types
export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  relevance: number;
  slug: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  url: string;
  category_id: string | null;
  category_name: string | null;
  pricing: string;
  logo_url: string | null;
  image_url: string | null;
  featured: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  categories?: Category | null; // For joined data
}

// Submission types
export interface Submission {
  id: string;
  name: string;
  description: string;
  url: string;
  category_id: string | null;
  category_name: string | null;
  pricing: string;
  logo_url: string | null;
  image_url: string | null;
  status: string;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

// Default categories - these will be loaded from the database
export const DEFAULT_CATEGORIES = [
  "Coding",
  "SEO",
  "Marketing",
  "Writing",
  "Web Scraping",
  "Video & Audio",
  "Design & UI/UX",
  "Analytics",
  "Email",
  "Task Management",
  "Content Creation",
  "Developer Tools",
  "Data Analysis",
  "Customer Support",
  "Project Management",
  "Communication",
  "Sales & CRM",
  "Finance & Accounting",
  "HR & Recruitment",
  "Ecommerce",
  "Security",
  "Social Media",
  "Education & Training",
  "Productivity",
  "Legal",
  "Payments",
] as const;

export type DefaultCategory = (typeof DEFAULT_CATEGORIES)[number];

// Export CATEGORIES as an alias for DEFAULT_CATEGORIES for backward compatibility
export const CATEGORIES = DEFAULT_CATEGORIES;

// Pricing options
export const PRICING_OPTIONS = ["Free", "Freemium", "Paid"] as const;

export type PricingOption = (typeof PRICING_OPTIONS)[number];

// Validation schemas
export const productSubmissionSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Product name must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  url: z.string().min(1, "URL is required"),
  category: z.string().min(1, "Please select or enter a category"),
  customCategory: z.string().optional(),
  pricing: z.enum(PRICING_OPTIONS, {
    required_error: "Please select a pricing option",
  }),
  logo: z
    .instanceof(File, { message: "Please upload a logo file" })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Logo must be less than 5MB"
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(
          file.type
        ),
      "Logo must be a JPEG, PNG, WebP, or SVG file"
    )
    .optional(),
  image: z
    .instanceof(File, { message: "Please upload a product image" })
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "Image must be less than 10MB"
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Image must be a JPEG, PNG, or WebP file"
    )
    .optional(),
});

export type ProductSubmissionForm = z.infer<typeof productSubmissionSchema>;

// Search and filter types
export interface SearchFilters {
  query: string;
  category: string | null;
  pricing: string | null;
}

// Form state for category selection
export interface CategoryFormState {
  selectedCategory: string;
  isCustomCategory: boolean;
  customCategoryName: string;
}

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          url: string;
          category_id: string | null;
          category_name: string | null;
          pricing: string;
          logo_url: string | null;
          image_url: string | null;
          featured: boolean;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          url: string;
          category_id?: string | null;
          category_name?: string | null;
          pricing: string;
          logo_url?: string | null;
          image_url?: string | null;
          featured?: boolean;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          url?: string;
          category_id?: string | null;
          category_name?: string | null;
          pricing?: string;
          logo_url?: string | null;
          image_url?: string | null;
          featured?: boolean;
          status?: string;
          updated_at?: string;
        };
      };
      submissions: {
        Row: {
          id: string;
          name: string;
          description: string;
          url: string;
          category_id: string | null;
          category_name: string | null;
          pricing: string;
          email: string | null;
          logo_url: string | null;
          image_url: string | null;
          status: string;
          rejection_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          url: string;
          category_id?: string | null;
          category_name?: string | null;
          pricing: string;
          email?: string | null;
          logo_url?: string | null;
          image_url?: string | null;
          status?: string;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          url?: string;
          category_id?: string | null;
          category_name?: string | null;
          pricing?: string;
          email?: string | null;
          logo_url?: string | null;
          image_url?: string | null;
          status?: string;
          rejection_reason?: string | null;
          updated_at?: string;
        };
      };
    };
  };
};
