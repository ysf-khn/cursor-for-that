"use client";

import { useState, useTransition, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleProductLike } from "@/actions/likes";
import { cn } from "@/lib/utils";
import { useAuthModal } from "@/components/auth-modal-provider";
import { createClient } from "@/utils/supabase/client";

interface LikeButtonProps {
  productId: string;
  initialIsLiked: boolean;
  initialLikeCount: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

/**
 * Like button component with optimistic UI updates and global authentication modal
 * Uses global auth modal to prevent layout shifts and flickering
 * Relies on page refresh after authentication for updated like status
 */
export function LikeButton({
  productId,
  initialIsLiked,
  initialLikeCount,
  size = "sm",
  showCount = true,
  className,
}: LikeButtonProps) {
  // Optimistic state for immediate UI updates
  const [optimisticIsLiked, setOptimisticIsLiked] = useState(initialIsLiked);
  const [optimisticLikeCount, setOptimisticLikeCount] =
    useState(initialLikeCount);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [isPending, startTransition] = useTransition();
  const { showAuthModal } = useAuthModal();
  const supabase = createClient();

  // Listen for authentication state changes
  useEffect(() => {
    const getInitialAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);

      // If user is already authenticated, fetch their like status
      if (user) {
        try {
          const [likeResult, productResult] = await Promise.all([
            supabase
              .from("likes")
              .select("id")
              .eq("user_id", user.id)
              .eq("product_id", productId)
              .single(),
            supabase
              .from("products")
              .select("like_count")
              .eq("id", productId)
              .single(),
          ]);

          // Update both like status and count based on actual server data
          setOptimisticIsLiked(!!likeResult.data);
          setOptimisticLikeCount(
            Math.max(0, productResult.data?.like_count || 0)
          );
        } catch (error) {
          // If there's an error, keep the initial values
          console.error("Error fetching initial like status:", error);
        }
      }
    };

    getInitialAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const wasAuthenticated = isAuthenticated;
      const nowAuthenticated = !!session?.user;

      setIsAuthenticated(nowAuthenticated);

      // If user signed out, reset only the like status, keep the total count
      if (wasAuthenticated && !nowAuthenticated) {
        setOptimisticIsLiked(false);
        // Keep the current like count as-is since it represents total likes from all users
        // The count will be corrected on next page load with server data
        setError(null);
      }

      // If user signed in, fetch their actual like status and current count for this product
      if (!wasAuthenticated && nowAuthenticated && session?.user) {
        // Add a small delay to ensure the session is fully established
        setTimeout(async () => {
          try {
            // Fetch both like status and current like count
            const [likeResult, productResult] = await Promise.all([
              supabase
                .from("likes")
                .select("id")
                .eq("user_id", session.user.id)
                .eq("product_id", productId)
                .single(),
              supabase
                .from("products")
                .select("like_count")
                .eq("id", productId)
                .single(),
            ]);

            // Update both like status and count based on actual server data
            setOptimisticIsLiked(!!likeResult.data);
            setOptimisticLikeCount(
              Math.max(0, productResult.data?.like_count || 0)
            );
          } catch (error) {
            // If there's an error fetching like status, keep current state
            console.error("Error fetching like status after sign in:", error);
          }
        }, 100); // Small delay to ensure auth state is settled
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, isAuthenticated]);

  /**
   * Handles the like/unlike action with optimistic updates
   * Shows global authentication modal for unauthenticated users
   */
  const handleLikeToggle = async () => {
    // Clear any previous errors
    setError(null);

    // Store current state for potential rollback
    const currentIsLiked = optimisticIsLiked;
    const currentLikeCount = optimisticLikeCount;

    // Optimistic update - immediately update UI
    const newIsLiked = !optimisticIsLiked;
    const newLikeCount = newIsLiked
      ? optimisticLikeCount + 1
      : Math.max(0, optimisticLikeCount - 1);

    setOptimisticIsLiked(newIsLiked);
    setOptimisticLikeCount(newLikeCount);

    // Perform the server action
    startTransition(async () => {
      try {
        const result = await toggleProductLike(productId);

        if (!result.success) {
          // Revert optimistic update on error using current state
          setOptimisticIsLiked(currentIsLiked);
          setOptimisticLikeCount(currentLikeCount);

          if (result.error === "You must be logged in to like products") {
            // Show global authentication modal instead of local modal
            showAuthModal();
          } else {
            setError(result.error || "Failed to update like");
          }
        } else {
          // Update with actual server response
          setOptimisticIsLiked(result.isLiked);
          setOptimisticLikeCount(Math.max(0, result.likeCount));
        }
      } catch (err) {
        // Revert optimistic update on unexpected error using current state
        setOptimisticIsLiked(currentIsLiked);
        setOptimisticLikeCount(currentLikeCount);
        setError("An unexpected error occurred");
        console.error("Error toggling like:", err);
      }
    });
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      button: "h-8 px-2",
      icon: "w-3 h-3",
      text: "text-xs",
    },
    md: {
      button: "h-9 px-3",
      icon: "w-4 h-4",
      text: "text-sm",
    },
    lg: {
      button: "h-10 px-4",
      icon: "w-5 h-5",
      text: "text-base",
    },
  };

  const config = sizeConfig[size];

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant={optimisticIsLiked ? "default" : "outline"}
        size="sm"
        onClick={handleLikeToggle}
        disabled={isPending}
        className={cn(
          config.button,
          "relative overflow-hidden transition-all duration-200",
          optimisticIsLiked
            ? "bg-red-500 hover:bg-red-600 border-red-500 text-white"
            : "hover:bg-red-50 hover:border-red-200 hover:text-red-600",
          isPending && "opacity-70 cursor-not-allowed",
          className
        )}
        title={optimisticIsLiked ? "Unlike this product" : "Like this product"}
      >
        <div className="flex items-center gap-1.5">
          <Heart
            className={cn(
              config.icon,
              "transition-all duration-300 ease-out",
              optimisticIsLiked
                ? "fill-current scale-110 animate-pulse"
                : "scale-100",
              // Animation on state change
              isPending && "animate-bounce"
            )}
          />
          {showCount && (
            <span
              className={cn(
                config.text,
                "font-medium transition-all duration-200",
                optimisticIsLiked ? "text-white" : "text-muted-foreground"
              )}
            >
              {optimisticLikeCount}
            </span>
          )}
        </div>

        {/* Ripple effect animation */}
        {optimisticIsLiked && (
          <div className="absolute inset-0 bg-red-400 opacity-30 animate-ping rounded-md" />
        )}
      </Button>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 text-center max-w-[120px] leading-tight">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Compact like button for use in cards or tight spaces
 */
export function CompactLikeButton({
  productId,
  initialIsLiked,
  initialLikeCount,
  className,
}: Omit<LikeButtonProps, "size" | "showCount">) {
  return (
    <LikeButton
      productId={productId}
      initialIsLiked={initialIsLiked}
      initialLikeCount={initialLikeCount}
      size="sm"
      showCount={true}
      className={className}
    />
  );
}
