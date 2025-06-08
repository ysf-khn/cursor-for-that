"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  productSubmissionSchema,
  ProductSubmissionForm,
  PRICING_OPTIONS,
} from "@/lib/types";
import { createSubmission } from "@/actions";
import Image from "next/image";

// Predefined categories
const CATEGORIES = [
  "3D Modeling",
  "Analytics",
  "Biotech",
  "Business Intelligence",
  "Coding",
  "Communication",
  "Content Creation",
  "Customer Support",
  "Data Analysis",
  "Design & UI/UX",
  "Developer Tools",
  "DevOps",
  "Ecommerce",
  "Education & Training",
  "Email",
  "Everyday AI",
  "File Management",
  "Finance & Accounting",
  "Game Dev",
  "Government",
  "Hardware/IoT",
  "HR & Recruitment",
  "Legal",
  "Marketing",
  "Payments",
  "Product Management",
  "Productivity",
  "Project Management",
  "Real Estate",
  "Research",
  "Sales & CRM",
  "Slides",
  "Spreadsheets",
  "Security",
  "SEO",
  "Smart Contracts",
  "Social Media",
  "Task Management",
  "Testing",
  "Trading",
  "Video & Audio",
  "Web Scraping",
  "Writing",
] as const;

export default function SubmitForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProductSubmissionForm>({
    resolver: zodResolver(productSubmissionSchema),
  });

  /**
   * Handles logo file selection and creates preview
   */
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("logo", file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Removes the selected logo and clears preview
   */
  const removeLogo = () => {
    setValue("logo", undefined);
    setLogoPreview(null);
    // Reset the file input
    const fileInput = document.getElementById("logo") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  /**
   * Handles product image file selection and creates preview
   */
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("image", file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Removes the selected product image and clears preview
   */
  const removeImage = () => {
    setValue("image", undefined);
    setImagePreview(null);
    // Reset the file input
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  /**
   * Handles URL input and automatically adds https:// if missing
   */
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.trim();

    // If the value is not empty and doesn't start with http:// or https://
    if (
      value &&
      !value.startsWith("http://") &&
      !value.startsWith("https://")
    ) {
      value = `https://${value}`;
    }

    setValue("url", value);
  };

  /**
   * Handles form submission with error handling
   */
  const onSubmit = async (data: ProductSubmissionForm) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare submission data
      const submissionData = {
        name: data.name,
        description: data.description,
        url: data.url,
        category_id: null, // We'll let the backend handle category mapping
        category_name: data.category,
        pricing: data.pricing,
      };

      // Pass both submission data and files to createSubmission
      await createSubmission(submissionData, data.logo, data.image);

      setIsSubmitted(true);
      reset();
      setLogoPreview(null);
      setImagePreview(null);
    } catch (error: unknown) {
      console.error("Submission error:", error);

      // Provide specific error messages based on the error type
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (errorMessage.includes("row-level security policy")) {
        setSubmitError(
          "There was a configuration issue with the database. Please ensure your Supabase environment variables are set correctly and the database policies are properly configured."
        );
      } else if (errorMessage.includes("Supabase configuration is missing")) {
        setSubmitError(
          "Database configuration is missing. Please check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file."
        );
      } else if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "PGRST301"
      ) {
        setSubmitError(
          "Database connection failed. Please check your Supabase configuration and try again."
        );
      } else {
        setSubmitError(
          errorMessage ||
            "An unexpected error occurred. Please try again later."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state component
  if (isSubmitted) {
    return (
      <div className=" bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Submission Received!
            </h2>
            <p className="text-muted-foreground mb-6">
              Thank you for submitting your product. We&apos;ll add it here very
              soon.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/">Back to Directory</Link>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsSubmitted(false)}
              >
                Submit Another Product
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            Please provide detailed information about your product. Fields
            marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="Enter your product name"
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label htmlFor="logo">Product Logo</Label>
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  {logoPreview && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-border bg-muted flex-shrink-0">
                      <Image
                        src={logoPreview}
                        alt="Logo Preview"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/svg+xml"
                      onChange={handleLogoChange}
                      className={errors.logo ? "border-red-500" : ""}
                    />
                    {errors.logo && (
                      <p className="text-sm text-red-600">
                        {errors.logo.message}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Upload your product logo. Max size: 5MB.
                    </p>
                  </div>
                </div>
                {logoPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeLogo}
                    className="w-fit"
                  >
                    Remove Logo
                  </Button>
                )}
              </div>
            </div>

            {/* Product Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Product Screenshot</Label>
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  {imagePreview && (
                    <div className="w-40 h-24 rounded-lg overflow-hidden border-2 border-border bg-muted flex-shrink-0">
                      <Image
                        src={imagePreview}
                        alt="Product Image Preview"
                        width={160}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className={errors.image ? "border-red-500" : ""}
                    />
                    {errors.image && (
                      <p className="text-sm text-red-600">
                        {errors.image.message}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Upload a screenshot or preview of your product. Max size:
                      10MB.
                    </p>
                  </div>
                </div>
                {imagePreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeImage}
                    className="w-fit"
                  >
                    Remove Image
                  </Button>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your product, its features, and how it uses prompts or AI..."
                rows={4}
                {...register("description")}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                {watch("description")?.length || 0}/500 characters
              </p>
            </div>

            {/* Website URL */}
            <div className="space-y-2">
              <Label htmlFor="url">Website URL *</Label>
              <Input
                id="url"
                type="text"
                placeholder="example.com or https://example.com"
                onChange={handleUrlChange}
                className={errors.url ? "border-red-500" : ""}
              />
              {errors.url && (
                <p className="text-sm text-red-600">{errors.url.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={(value) => setValue("category", value)}>
                <SelectTrigger
                  className={errors.category ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <Label htmlFor="pricing">Pricing Model *</Label>
              <Select
                onValueChange={(value) =>
                  setValue("pricing", value as (typeof PRICING_OPTIONS)[number])
                }
              >
                <SelectTrigger
                  className={errors.pricing ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select pricing model" />
                </SelectTrigger>
                <SelectContent>
                  {PRICING_OPTIONS.map((pricing) => (
                    <SelectItem key={pricing} value={pricing}>
                      {pricing}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.pricing && (
                <p className="text-sm text-red-600">{errors.pricing.message}</p>
              )}
            </div>

            {/* Error Display */}
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Guidelines */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Submission Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            • Your product should use AI, prompts, or automation to enhance user
            workflows.
          </p>
          <p>• Upload a high-quality logo that represents your product.</p>
          <p>
            • Provide a clear, detailed description of your product&apos;s
            features and benefits.
          </p>
          <p>
            • Ensure your website is functional and provides adequate product
            information.
          </p>
          <p>
            • To prevent spam, we review all submissions manually and get your
            product in the list as soon as possible.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
