"use server";

import { createClient } from "@/utils/supabase/server";
import { uploadLogo, uploadProductImage } from "@/utils/supabase/storage";
import type { Database } from "@/lib/types";

/**
 * Sanitizes string input to prevent XSS attacks
 * @param input - The string to sanitize
 * @returns Sanitized string
 */
function sanitizeString(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

/**
 * Validates and sanitizes submission data on the server side
 * @param submission - Raw submission data
 * @returns Validated and sanitized submission data
 */
function validateAndSanitizeSubmission(
  submission: Database["public"]["Tables"]["submissions"]["Insert"]
): Database["public"]["Tables"]["submissions"]["Insert"] {
  // Additional server-side validation
  if (!submission.name || submission.name.length > 100) {
    throw new Error("Invalid product name");
  }

  if (
    !submission.description ||
    submission.description.length > 500 ||
    submission.description.length < 10
  ) {
    throw new Error("Invalid description length");
  }

  if (!submission.url) {
    throw new Error("URL is required");
  }

  // Validate URL format and security
  try {
    const url = new URL(submission.url);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Invalid URL protocol");
    }

    // Block dangerous URLs
    const hostname = url.hostname.toLowerCase();
    const blockedPatterns = [
      /^localhost$/,
      /^127\./,
      /^192\.168\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^0\./,
      /\.local$/,
    ];

    if (blockedPatterns.some((pattern) => pattern.test(hostname))) {
      throw new Error("URL cannot point to local or private networks");
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("URL")) {
      throw error;
    }
    throw new Error("Invalid URL format");
  }

  // Sanitize string inputs
  return {
    ...submission,
    name: sanitizeString(submission.name),
    description: sanitizeString(submission.description),
    category_name: submission.category_name
      ? sanitizeString(submission.category_name)
      : null,
    url: submission.url.trim(),
  };
}

/**
 * Creates a new submission in the database with optional logo and image uploads
 * @param submission - The submission data to insert
 * @param logoFile - Optional logo file to upload
 * @param imageFile - Optional product image file to upload
 * @returns Promise<Object> The created submission object
 * @throws Error if creation fails
 */
export async function createSubmission(
  submission: Database["public"]["Tables"]["submissions"]["Insert"],
  logoFile?: File,
  imageFile?: File
) {
  console.log("Creating submission with data:", submission);

  // Server-side validation and sanitization
  const validatedSubmission = validateAndSanitizeSubmission(submission);

  let logoUrl: string | null = null;
  let imageUrl: string | null = null;

  // Upload logo if provided
  if (logoFile) {
    try {
      console.log("Uploading logo file:", logoFile.name);
      logoUrl = await uploadLogo(logoFile);
      console.log("Logo uploaded successfully:", logoUrl);
    } catch (error) {
      console.error("Error uploading logo:", error);
      throw new Error(
        `Failed to upload logo: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Upload product image if provided
  if (imageFile) {
    try {
      console.log("Uploading product image file:", imageFile.name);
      imageUrl = await uploadProductImage(imageFile);
      console.log("Product image uploaded successfully:", imageUrl);
    } catch (error) {
      console.error("Error uploading product image:", error);
      throw new Error(
        `Failed to upload product image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  const supabase = await createClient();

  // Look up category ID based on the category name
  if (validatedSubmission.category_name) {
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("name", validatedSubmission.category_name)
      .single();

    if (categoryError) {
      console.error("Error looking up category:", categoryError);
    } else if (category) {
      validatedSubmission.category_id = category.id;
    }
  }

  // Include logo and image URLs in submission data
  const submissionWithFiles = {
    ...validatedSubmission,
    logo_url: logoUrl,
    image_url: imageUrl,
  };

  const { data, error } = await supabase
    .from("submissions")
    .insert(submissionWithFiles)
    .select()
    .single();

  if (error) {
    console.error("Error creating submission:", error);
    console.error("Error details:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw error;
  }

  console.log("Submission created successfully:", data);
  return data;
}
