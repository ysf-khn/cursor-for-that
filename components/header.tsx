"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const getLinkClassName = (path: string) => {
    const baseClasses = "transition-colors font-medium";
    if (isActive(path)) {
      return `${baseClasses} text-primary`;
    }
    return `${baseClasses} text-muted-foreground hover:text-foreground`;
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center flex-1 gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="CursorForThat Logo"
                width={32}
                height={32}
                className="h-8 w-8"
                priority
              />
              <span className="text-muted-foreground">CursorForThat</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center justify-center space-x-8 flex-1">
            <Link href="/" className={getLinkClassName("/")}>
              Home
            </Link>
            <Link
              href="/categories"
              className={getLinkClassName("/categories")}
            >
              Categories
            </Link>
            <Link href="/submit" className={getLinkClassName("/submit")}>
              Submit Product
            </Link>
          </nav>

          <div className="flex items-center justify-end space-x-4 flex-1">
            <ThemeToggle />
            <Button asChild variant="default" className="hidden sm:inline-flex">
              <Link href="/submit">Submit Your Product</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
