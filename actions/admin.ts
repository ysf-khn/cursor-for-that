"use server";

import { createClient } from "@/utils/supabase/server";
import type { Database } from "@/lib/types";

// Admin password - change this to your desired password
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; // TODO: Change this password

/**
 * Validates admin password
 * @param password - The password to validate
 * @returns boolean - Whether the password is correct
 */
export async function validateAdminPassword(
  password: string
): Promise<boolean> {
  return password === ADMIN_PASSWORD;
}

/**
 * Fetches all submissions with optional status filter
 * @param status - Optional status filter ('pending', 'approved', 'rejected')
 * @returns Promise<Array> Array of submission objects
 */
export async function getSubmissions(status?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("submissions")
    .select(
      `
      *,
      categories (
        id,
        name
      )
    `
    )
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching submissions:", error);
    throw error;
  }

  return data || [];
}

/**
 * Approves a submission and moves it to the products table
 * @param submissionId - The ID of the submission to approve
 * @param updatedData - Optional updated data for the product
 * @returns Promise<Object> The created product object
 */
export async function approveSubmission(
  submissionId: string,
  updatedData?: {
    name?: string;
    description?: string;
    url?: string;
    category_id?: string | null;
    category_name?: string;
    pricing?: string;
  }
) {
  console.log("Starting approval process for submission:", submissionId);
  const supabase = await createClient();

  // Get the submission data
  console.log("Fetching submission data...");
  const { data: submission, error: fetchError } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", submissionId)
    .single();

  if (fetchError || !submission) {
    console.error("Error fetching submission:", fetchError);
    throw new Error("Submission not found");
  }
  console.log("Found submission:", submission);

  // Prepare product data (use updated data if provided, otherwise use submission data)
  const productData: Database["public"]["Tables"]["products"]["Insert"] = {
    name: updatedData?.name || submission.name,
    description: updatedData?.description || submission.description,
    url: updatedData?.url || submission.url,
    category_id:
      updatedData?.category_id !== undefined
        ? updatedData.category_id
        : submission.category_id,
    category_name: updatedData?.category_name || submission.category_name,
    pricing: updatedData?.pricing || submission.pricing,
    logo_url: submission.logo_url,
    image_url: submission.image_url,
    status: "active",
    featured: false,
  };
  console.log("Prepared product data:", productData);

  // Insert into products table
  console.log("Creating new product...");
  const { data: product, error: insertError } = await supabase
    .from("products")
    .insert(productData)
    .select()
    .single();

  if (insertError) {
    console.error("Error creating product:", insertError);
    throw insertError;
  }
  console.log("Product created successfully:", product);

  // Update submission status to 'approved'
  console.log("Updating submission status to approved...");
  const { error: updateError } = await supabase
    .from("submissions")
    .update({
      status: "approved",
      updated_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  if (updateError) {
    console.error("Error updating submission status:", updateError);
    throw new Error(
      `Failed to update submission status: ${updateError.message}`
    );
  }
  console.log("Submission status updated successfully");

  return product;
}

/**
 * Rejects a submission with an optional reason
 * @param submissionId - The ID of the submission to reject
 * @param rejectionReason - Optional reason for rejection
 * @returns Promise<Object> The updated submission object
 */
export async function rejectSubmission(
  submissionId: string,
  rejectionReason?: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("submissions")
    .update({
      status: "rejected",
      rejection_reason: rejectionReason || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", submissionId)
    .select()
    .single();

  if (error) {
    console.error("Error rejecting submission:", error);
    throw error;
  }

  return data;
}

/**
 * Updates a submission with new data
 * @param submissionId - The ID of the submission to update
 * @param updateData - The data to update
 * @returns Promise<Object> The updated submission object
 */
export async function updateSubmission(
  submissionId: string,
  updateData: Database["public"]["Tables"]["submissions"]["Update"]
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("submissions")
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", submissionId)
    .select()
    .single();

  if (error) {
    console.error("Error updating submission:", error);
    throw error;
  }

  return data;
}
