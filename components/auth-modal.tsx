"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { signInWithGoogle } from "@/app/login/actions";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Authentication modal component for Google sign in
 * Used when unauthenticated users try to perform actions requiring authentication
 */
export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [success, setSuccess] = useState(false);

  /**
   * Resets modal state when closing or opening
   */
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset state when closing
      setSuccess(false);
    } else {
      // Also reset state when opening to ensure clean slate
      setSuccess(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {success ? "Success!" : "Sign In"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {success
              ? "Authentication successful! You can now like products."
              : "Sign in with Google to like products and save your favorites"}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center space-y-4 py-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <p className="text-sm text-muted-foreground text-center">
              Redirecting you back...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              onClick={signInWithGoogle}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h240z"
                ></path>
              </svg>
              Continue with Google
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
