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
  slug: string;
  like_count: number;
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
  slug: string;
}

// Default categories - these will be loaded from the database
export const DEFAULT_CATEGORIES = [
  "Coding",
  "Marketing",
  "SEO",
  "Writing",
  "Content Creation",
  "Design & UI/UX",
  "3D Modeling",
  "Analytics",
  "Biotech",
  "Business Intelligence",
  "Communication",
  "Customer Support",
  "Data Analysis",
  "Developer Tools",
  "DevOps",
  "Ecommerce",
  "Education & Training",
  "Email",
  "Everyday AI",
  "Spreadsheets",
  "File Management",
  "Finance & Accounting",
  "Game Dev",
  "Government",
  "Hardware/IoT",
  "HR & Recruitment",
  "Legal",
  "Payments",
  "Product Management",
  "Productivity",
  "Project Management",
  "Real Estate",
  "Research",
  "Sales & CRM",
  "Slides",
  "Security",
  "Smart Contracts",
  "Social Media",
  "Task Management",
  "Testing",
  "Trading",
  "Video & Audio",
  "Web Scraping",
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
    .max(100, "Product name must be less than 100 characters")
    .refine(
      (val) => !/<script|javascript:|data:|vbscript:/i.test(val),
      "Product name contains invalid characters"
    ),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .refine(
      (val) => !/<script|javascript:|data:|vbscript:/i.test(val),
      "Description contains invalid characters"
    ),
  url: z
    .string()
    .min(1, "URL is required")
    .url("Please enter a valid URL")
    .refine((val) => {
      try {
        const url = new URL(val);
        // Only allow http and https protocols
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    }, "URL must use http or https protocol")
    .refine((val) => {
      try {
        const url = new URL(val);
        // Block localhost, private IPs, and suspicious domains
        const hostname = url.hostname.toLowerCase();
        const blockedPatterns = [
          /^localhost$/,
          /^127\./,
          /^192\.168\./,
          /^10\./,
          /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
          /^0\./,
          /\.local$/,
          /^file:/,
        ];
        return !blockedPatterns.some((pattern) => pattern.test(hostname));
      } catch {
        return false;
      }
    }, "URL cannot point to local or private networks"),
  category: z
    .string()
    .min(1, "Please select or enter a category")
    .max(50, "Category name must be less than 50 characters")
    .refine(
      (val) => !/<script|javascript:|data:|vbscript:/i.test(val),
      "Category contains invalid characters"
    ),
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
          slug: string;
          like_count: number;
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
          slug?: string;
          like_count?: number;
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
          slug?: string;
          like_count?: number;
        };
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
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
          slug: string;
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
          slug?: string;
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
          slug?: string;
        };
      };
    };
  };
};
