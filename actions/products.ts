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
        name,
        slug
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

/**
 * Fetches products with like status for the current user
 * @param filters - Optional filters for category, pricing, and search
 * @returns Promise<Array> Array of product objects with isLiked property
 */
export async function getProductsWithLikeStatus(filters?: {
  category?: string;
  pricing?: string;
  search?: string;
}) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from("products")
    .select(
      `
      *,
      categories (
        id,
        name,
        slug
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

  const { data: products, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  if (!products) {
    return [];
  }

  // If no user is logged in, return products with isLiked: false
  if (!user) {
    return products.map((product) => ({
      ...product,
      isLiked: false,
    }));
  }

  // Get user's liked products
  const { data: userLikes, error: likesError } = await supabase
    .from("likes")
    .select("product_id")
    .eq("user_id", user.id);

  if (likesError) {
    console.error("Error fetching user likes:", likesError);
    // Return products without like status on error
    return products.map((product) => ({
      ...product,
      isLiked: false,
    }));
  }

  // Create a set of liked product IDs for efficient lookup
  const likedProductIds = new Set(
    userLikes?.map((like) => like.product_id) || []
  );

  // Add isLiked property to each product
  return products.map((product) => ({
    ...product,
    isLiked: likedProductIds.has(product.id),
  }));
}
