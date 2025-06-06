import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthModalProvider } from "@/components/auth-modal-provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://cursorfor.xyz"
  ),
  title: {
    default: "Cursor For That | Find the Perfect AI Tools",
    template: "%s | Cursor For That",
  },
  description:
    "Discover the next generation of SaaS tools that leverage AI prompts to revolutionize your coding, writing, productivity, and creative workflows.",
  applicationName: "Cursor For That",
  referrer: "origin-when-cross-origin",
  keywords: [
    "AI tools",
    "SaaS directory",
    "AI-powered software",
    "productivity tools",
    "coding tools",
    "writing tools",
    "AI prompts",
    "artificial intelligence",
    "software directory",
    "business tools",
  ],
  authors: [{ name: "Yusuf" }],
  creator: "CursorForThat",
  publisher: "CursorForThat",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Cursor For That",
    title: "Cursor For That | Find the Perfect AI Tools",
    description:
      "Discover curated AI-powered SaaS tools that revolutionize coding, writing, productivity, and creative workflows.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Cursor For That",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cursor For That | Find the Perfect AI Tools",
    description:
      "Discover curated AI-powered SaaS tools that revolutionize your workflows.",
    images: ["/og-image.jpg"],
    creator: "@yuusuf_khaan",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Cursor For That",
              description:
                "Discover the next generation of SaaS tools that leverage AI prompts to revolutionize your coding, writing, productivity, and creative workflows.",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://cursorfor.xyz",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${
                    process.env.NEXT_PUBLIC_SITE_URL || "https://cursorfor.xyz"
                  }/categories?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
              publisher: {
                "@type": "Organization",
                name: "Cursor For That",
                url:
                  process.env.NEXT_PUBLIC_SITE_URL || "https://cursorfor.xyz",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${bricolage.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthModalProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthModalProvider>
        </ThemeProvider>
        <Analytics />
      </body>
      <GoogleAnalytics gaId="G-WNP07JK4ZZ" />
    </html>
  );
}
