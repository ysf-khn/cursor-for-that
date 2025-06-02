import { createClient } from "./server";

// File validation constants
const ALLOWED_LOGO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_LOGO_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validates file type and size for security
 * @param file - The file to validate
 * @param allowedTypes - Array of allowed MIME types
 * @param maxSize - Maximum file size in bytes
 * @throws Error if validation fails
 */
function validateFile(
  file: File,
  allowedTypes: string[],
  maxSize: number
): void {
  // Check file size
  if (file.size > maxSize) {
    throw new Error(
      `File size exceeds limit of ${Math.round(maxSize / 1024 / 1024)}MB`
    );
  }

  // Check MIME type
  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`
    );
  }

  // Additional security checks
  const fileName = file.name.toLowerCase();

  // Block potentially dangerous file extensions
  const dangerousExtensions = [
    ".exe",
    ".bat",
    ".cmd",
    ".scr",
    ".pif",
    ".com",
    ".js",
    ".vbs",
    ".jar",
    ".php",
    ".asp",
    ".jsp",
  ];
  if (dangerousExtensions.some((ext) => fileName.endsWith(ext))) {
    throw new Error("File type not allowed for security reasons");
  }

  // Check for double extensions (e.g., image.jpg.exe)
  const parts = fileName.split(".");
  if (parts.length > 2) {
    const secondToLast = parts[parts.length - 2];
    if (dangerousExtensions.some((ext) => ext.includes(secondToLast))) {
      throw new Error("File name contains suspicious extensions");
    }
  }
}

/**
 * Sanitizes filename to prevent path traversal and other attacks
 * @param filename - Original filename
 * @returns Sanitized filename
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, "_") // Replace special chars with underscore
    .replace(/\.+/g, ".") // Replace multiple dots with single dot
    .replace(/^\.+|\.+$/g, "") // Remove leading/trailing dots
    .substring(0, 100); // Limit length
}

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
  // Validate file before upload
  validateFile(file, ALLOWED_LOGO_TYPES, MAX_LOGO_SIZE);

  const supabase = await createClient();

  // Generate a unique filename if not provided
  const timestamp = Date.now();
  const fileExtension = file.name.split(".").pop();
  const baseName = fileName ? sanitizeFilename(fileName) : `logo_${timestamp}`;
  const finalFileName = `${baseName}.${fileExtension}`;

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
  // Validate file before upload
  validateFile(file, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE);

  const supabase = await createClient();
  const fileExt = file.name.split(".").pop();
  const timestamp = Date.now();
  const sanitizedName = sanitizeFilename(file.name.split(".")[0]);
  const fileName = `${sanitizedName}_${timestamp}.${fileExt}`;

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
