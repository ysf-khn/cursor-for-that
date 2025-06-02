import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SubmitForm from "@/components/submit-form";
import type { Metadata } from "next";

// SEO metadata for the submit page
export const metadata: Metadata = {
  title: "Submit Your Product",
  description:
    "Submit your AI-powered SaaS tool to our curated directory. Share your prompt-powered application with our community of developers, creators, and professionals.",
  keywords: [
    "submit AI tool",
    "add SaaS product",
    "AI tool submission",
    "SaaS directory submission",
    "promote AI software",
    "list AI product",
    "AI tool marketing",
  ],
  openGraph: {
    title: "Submit Your Product | Cursor For That",
    description:
      "Submit your AI-powered SaaS tool to our curated directory. Share your prompt-powered application with our community.",
    type: "website",
    url: "/submit",
  },
  twitter: {
    card: "summary",
    title: "Submit Your Product | Cursor For That",
    description:
      "Submit your AI-powered SaaS tool to our curated directory. Share your prompt-powered application with our community.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button asChild variant="ghost">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Directory
            </Link>
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Submit Your Product
          </h1>
          <p className="text-lg text-muted-foreground">
            Share your product with our community. We&apos;ll review your
            submission and add it to our directory.
          </p>
        </div>

        {/* Client-side form component */}
        <SubmitForm />
      </div>
    </div>
  );
}
