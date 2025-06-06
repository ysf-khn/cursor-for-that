"use client";

import { createClient } from "@/utils/supabase/client";

export interface AuthResult {
  success: boolean;
  error?: string;
}

/**
 * Client-side login function for use in modals
 * Returns success/error status without redirecting
 */
export async function loginClient(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message || "Login failed",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Login error:", err);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Client-side signup function for use in modals
 * Returns success/error status without redirecting
 */
export async function signupClient(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message || "Signup failed",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Signup error:", err);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
