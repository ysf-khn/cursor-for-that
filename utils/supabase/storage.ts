import { createClient } from "./server";

/**
 * Uploads a logo file to Supabase storage
 * @param file - The file to upload
 * @param fileName - Optional custom filename, will generate one if not provided
 * @returns Promise<string> The public URL of the uploaded file
 * @throws Error if upload fails
 */
export async function uploadLogo(
  file: File,
  fileName?: string
): Promise<string> {
  const supabase = await createClient();

  // Generate a unique filename if not provided
  const timestamp = Date.now();
  const fileExtension = file.name.split(".").pop();
  const finalFileName = fileName || `logo_${timestamp}.${fileExtension}`;

  // Upload file to the logos bucket
  const { data, error } = await supabase.storage
    .from("logos")
    .upload(finalFileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading logo:", error);
    throw new Error(`Failed to upload logo: ${error.message}`);
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from("logos")
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Deletes a logo file from Supabase storage
 * @param filePath - The path of the file to delete (relative to bucket)
 * @returns Promise<void>
 * @throws Error if deletion fails
 */
export async function deleteLogo(filePath: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.storage.from("logos").remove([filePath]);

  if (error) {
    console.error("Error deleting logo:", error);
    throw new Error(`Failed to delete logo: ${error.message}`);
  }
}

/**
 * Uploads a product image file to Supabase storage
 * @param file The product image file to upload
 * @returns Promise<string> The URL of the uploaded image
 */
export async function uploadProductImage(file: File): Promise<string> {
  const supabase = await createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(fileName, file);

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(data.path);

  return publicUrl;
}
