"use server";

import { createClient } from "@/utils/supabase/server";
import { uploadLogo, uploadProductImage } from "@/utils/supabase/storage";
import type { Database } from "@/lib/types";

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
  if (submission.category_name) {
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("name", submission.category_name)
      .single();

    if (categoryError) {
      console.error("Error looking up category:", categoryError);
    } else if (category) {
      submission.category_id = category.id;
    }
  }

  // Include logo and image URLs in submission data
  const submissionWithFiles = {
    ...submission,
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
