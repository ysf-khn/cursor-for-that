import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics } from "@next/third-parties/google";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CursorForThat | Discover Prompt-Powered SaaS Tools",
  description:
    "Find the best prompt-powered SaaS tools similar to Cursor IDE. Discover AI writing tools, code automation, task management, and productivity solutions.",
  keywords:
    "cursor, prompt tools, AI writing, code automation, SaaS directory, productivity tools",
  authors: [{ name: "CursorForThat" }],
  openGraph: {
    title: "CursorForThat - Discover Prompt-Powered SaaS Tools",
    description:
      "Find the best prompt-powered SaaS tools similar to Cursor IDE.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CursorForThat - Discover Prompt-Powered SaaS Tools",
    description:
      "Find the best prompt-powered SaaS tools similar to Cursor IDE.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bricolage.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-WNP07JK4ZZ" />
    </html>
  );
}
