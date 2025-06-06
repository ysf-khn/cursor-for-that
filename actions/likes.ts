"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Toggles a like for a product (like if not liked, unlike if already liked)
 * @param productId - The ID of the product to toggle like for
 * @returns Promise<{success: boolean, isLiked: boolean, likeCount: number, error?: string}>
 */
export async function toggleProductLike(productId: string) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        isLiked: false,
        likeCount: 0,
        error: "You must be logged in to like products",
      };
    }

    // Check if the user has already liked this product
    const { data: existingLike, error: checkError } = await supabase
      .from("likes")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is expected if no like exists
      console.error("Error checking existing like:", checkError);
      return {
        success: false,
        isLiked: false,
        likeCount: 0,
        error: "Failed to check like status",
      };
    }

    let isLiked: boolean;

    if (existingLike) {
      // Unlike: Remove the existing like
      const { error: deleteError } = await supabase
        .from("likes")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (deleteError) {
        console.error("Error removing like:", deleteError);
        return {
          success: false,
          isLiked: true,
          likeCount: 0,
          error: "Failed to remove like",
        };
      }

      isLiked = false;
    } else {
      // Like: Add a new like
      const { error: insertError } = await supabase.from("likes").insert({
        user_id: user.id,
        product_id: productId,
      });

      if (insertError) {
        console.error("Error adding like:", insertError);
        return {
          success: false,
          isLiked: false,
          likeCount: 0,
          error: "Failed to add like",
        };
      }

      isLiked = true;
    }

    // Get the updated like count
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("like_count")
      .eq("id", productId)
      .single();

    if (productError) {
      console.error("Error fetching updated like count:", productError);
      return {
        success: false,
        isLiked,
        likeCount: 0,
        error: "Failed to get updated like count",
      };
    }

    // Revalidate the page to update the UI
    revalidatePath("/");

    return {
      success: true,
      isLiked,
      likeCount: product.like_count || 0,
    };
  } catch (error) {
    console.error("Unexpected error in toggleProductLike:", error);
    return {
      success: false,
      isLiked: false,
      likeCount: 0,
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Gets the like status for a product for the current user
 * @param productId - The ID of the product to check
 * @returns Promise<{isLiked: boolean, likeCount: number}>
 */
export async function getProductLikeStatus(productId: string) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let isLiked = false;

    if (user) {
      // Check if the user has liked this product
      const { data: existingLike } = await supabase
        .from("likes")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .single();

      isLiked = !!existingLike;
    }

    // Get the like count
    const { data: product } = await supabase
      .from("products")
      .select("like_count")
      .eq("id", productId)
      .single();

    return {
      isLiked,
      likeCount: product?.like_count || 0,
    };
  } catch (error) {
    console.error("Error getting product like status:", error);
    return {
      isLiked: false,
      likeCount: 0,
    };
  }
}

/**
 * Gets all products liked by the current user
 * @returns Promise<string[]> Array of product IDs
 */
export async function getUserLikedProducts() {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data: likes, error } = await supabase
      .from("likes")
      .select("product_id")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching user liked products:", error);
      return [];
    }

    return likes?.map((like) => like.product_id) || [];
  } catch (error) {
    console.error("Unexpected error in getUserLikedProducts:", error);
    return [];
  }
}
