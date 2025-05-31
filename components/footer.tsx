import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <Image
                src="/logo.png"
                alt="CursorForThat Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </Link>
            <p className="text-muted-foreground max-w-md">
              Discover the best prompt-powered SaaS tools to automate and
              enhance your workflow. Find tools similar to Cursor IDE for
              coding, content creation, and productivity.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/submit"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Submit Product
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/categories/writing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Writing
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/coding"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Coding
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/seo"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  SEO
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p className="mb-4">Built with ❤️ for the community.</p>
          <p>
            Like this?
            <a
              href="https://x.com/yuusuf_khaan"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-white bg-primary px-4 py-2 rounded-md"
            >
              Follow me on X
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
