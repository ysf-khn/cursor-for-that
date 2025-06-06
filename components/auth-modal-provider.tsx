"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AuthModal } from "@/components/auth-modal";

interface AuthModalContextType {
  showAuthModal: () => void;
  hideAuthModal: () => void;
  isOpen: boolean;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined
);

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}

interface AuthModalProviderProps {
  children: ReactNode;
}

/**
 * Global authentication modal provider
 * Renders the modal at the root level to prevent layout shifts
 */
export function AuthModalProvider({ children }: AuthModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const showAuthModal = () => setIsOpen(true);
  const hideAuthModal = () => setIsOpen(false);

  return (
    <AuthModalContext.Provider
      value={{
        showAuthModal,
        hideAuthModal,
        isOpen,
      }}
    >
      {children}
      <AuthModal open={isOpen} onOpenChange={setIsOpen} />
    </AuthModalContext.Provider>
  );
}
