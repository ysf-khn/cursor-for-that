"use server";

import { createClient } from "@/utils/supabase/server";
import { generateSlug, generateUniqueSlug } from "@/utils/slug";

/**
 * Checks if a slug already exists in the database
 * @param slug - The slug to check
 * @returns Promise<boolean> - True if slug exists, false otherwise
 */
export async function checkSlugExists(slug: string): Promise<boolean> {
  const supabase = await createClient();

  // Check both products and submissions tables
  const [productsResult, submissionsResult] = await Promise.all([
    supabase.from("products").select("slug").eq("slug", slug).single(),
    supabase.from("submissions").select("slug").eq("slug", slug).single(),
  ]);

  return !productsResult.error || !submissionsResult.error;
}

/**
 * Gets all existing slugs from both products and submissions tables
 * @returns Promise<string[]> - Array of existing slugs
 */
export async function getExistingSlugs(): Promise<string[]> {
  const supabase = await createClient();

  const [productsResult, submissionsResult] = await Promise.all([
    supabase.from("products").select("slug"),
    supabase.from("submissions").select("slug"),
  ]);

  const productSlugs =
    productsResult.data?.map((p) => p.slug).filter(Boolean) || [];
  const submissionSlugs =
    submissionsResult.data?.map((s) => s.slug).filter(Boolean) || [];

  return [...productSlugs, ...submissionSlugs];
}

/**
 * Generates a unique slug for a product name
 * @param name - The product name
 * @returns Promise<string> - A unique slug
 */
export async function generateProductSlug(name: string): Promise<string> {
  const baseSlug = generateSlug(name);
  const existingSlugs = await getExistingSlugs();
  return generateUniqueSlug(baseSlug, existingSlugs);
}

/**
 * Validates and potentially modifies a custom slug
 * @param customSlug - The custom slug provided by user
 * @returns Promise<string> - A valid, unique slug
 */
export async function validateCustomSlug(customSlug: string): Promise<string> {
  const cleanSlug = generateSlug(customSlug);
  const existingSlugs = await getExistingSlugs();
  return generateUniqueSlug(cleanSlug, existingSlugs);
}
