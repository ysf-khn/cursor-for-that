/**
 * Generates a URL-friendly slug from a given text
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      // Replace special characters with spaces
      .replace(/[^a-z0-9\s-]/g, "")
      // Replace multiple spaces/hyphens with single hyphen
      .replace(/[\s-]+/g, "-")
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, "")
  );
}

/**
 * Generates a unique slug by checking for duplicates and appending a number if needed
 * @param baseSlug - The base slug to make unique
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique slug
 */
export function generateUniqueSlug(
  baseSlug: string,
  existingSlugs: string[]
): string {
  let uniqueSlug = baseSlug;
  let counter = 1;

  // Keep checking until we find a unique slug
  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${baseSlug}${counter}`;
    counter++;
  }

  return uniqueSlug;
}

/**
 * Creates a slug from product name and ensures uniqueness
 * @param name - The product name
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique, clean slug
 */
export function createProductSlug(
  name: string,
  existingSlugs: string[] = []
): string {
  const baseSlug = generateSlug(name);
  return generateUniqueSlug(baseSlug, existingSlugs);
}
