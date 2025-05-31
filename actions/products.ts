"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * Fetches products from the database with optional filtering
 * @param filters - Optional filters for category, pricing, and search
 * @returns Promise<Array> Array of product objects or empty array on error
 */
export async function getProducts(filters?: {
  category?: string;
  pricing?: string;
  search?: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(
      `
      *,
      categories (
        id,
        name
      )
    `
    )
    .eq("status", "active")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters?.category) {
    query = query.eq("category_name", filters.category);
  }

  if (filters?.pricing) {
    query = query.eq("pricing", filters.pricing);
  }

  if (filters?.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data || [];
}
