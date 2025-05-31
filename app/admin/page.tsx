"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Check,
  X,
  Edit,
  ExternalLink,
  Globe,
  Tag,
  DollarSign,
} from "lucide-react";
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

import { Badge } from "@/components/ui/badge";
import {
  validateAdminPassword,
  getSubmissions,
  approveSubmission,
  rejectSubmission,
  updateSubmission,
} from "@/actions";
import { Submission, PRICING_OPTIONS, CATEGORIES } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Password validation schema
const passwordSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

// Edit submission schema
const editSubmissionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().min(10).max(500),
  url: z.string().min(1, "URL is required"),
  category_name: z.string().min(1, "Category is required"),
  pricing: z.enum(PRICING_OPTIONS),
});

type PasswordForm = z.infer<typeof passwordSchema>;
type EditSubmissionForm = z.infer<typeof editSubmissionSchema>;

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Password form
  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  // Edit form
  const editForm = useForm<EditSubmissionForm>({
    resolver: zodResolver(editSubmissionSchema),
  });

  // Load data after authentication
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getSubmissions();
      setSubmissions(data);
    } catch (error) {
      console.error("Error loading submissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (data: PasswordForm) => {
    try {
      const isValid = await validateAdminPassword(data.password);
      if (isValid) {
        setIsAuthenticated(true);
      } else {
        passwordForm.setError("password", { message: "Invalid password" });
      }
    } catch (error) {
      console.error("Error validating password:", error);
      passwordForm.setError("password", { message: "Authentication failed" });
    }
  };

  const handleEditSubmission = (submission: Submission) => {
    setEditingSubmission(submission);
    editForm.reset({
      name: submission.name,
      description: submission.description,
      url: submission.url,
      category_name: submission.category_name || "",
      pricing: submission.pricing as (typeof PRICING_OPTIONS)[number],
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateSubmission = async (data: EditSubmissionForm) => {
    if (!editingSubmission) return;

    setActionLoading("update");
    try {
      await updateSubmission(editingSubmission.id, {
        name: data.name,
        description: data.description,
        url: data.url,
        category_name: data.category_name,
        pricing: data.pricing,
      });

      setIsEditDialogOpen(false);
      setEditingSubmission(null);
      await loadData();
    } catch (error) {
      console.error("Error updating submission:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveSubmission = async (submissionId: string) => {
    setActionLoading(submissionId);
    try {
      await approveSubmission(submissionId);
      await loadData();
    } catch (error) {
      console.error("Error approving submission:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectSubmission = async (
    submissionId: string,
    reason?: string
  ) => {
    setActionLoading(submissionId);
    try {
      await rejectSubmission(submissionId, reason);
      await loadData();
    } catch (error) {
      console.error("Error rejecting submission:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "approved":
        return (
          <Badge variant="default" className="bg-green-500">
            Approved
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    if (activeTab === "all") return true;
    return submission.status === activeTab;
  });

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <CardDescription>
              Enter the admin password to access the submission management panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    {...passwordForm.register("password")}
                    className={
                      passwordForm.formState.errors.password
                        ? "border-red-500"
                        : ""
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordForm.formState.errors.password && (
                  <p className="text-sm text-red-600">
                    {passwordForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Access Admin Panel
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Button asChild variant="ghost">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Directory
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Manage product submissions</p>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Directory
              </Link>
            </Button>
            <Button variant="ghost" onClick={() => setIsAuthenticated(false)}>
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">
                {submissions.filter((s) => s.status === "pending").length}
              </div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {submissions.filter((s) => s.status === "approved").length}
              </div>
              <p className="text-sm text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-red-600">
                {submissions.filter((s) => s.status === "rejected").length}
              </div>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{submissions.length}</div>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
        </div>

        {/* Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Submissions</CardTitle>
            <CardDescription>
              Review and manage product submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-32 bg-muted animate-pulse rounded-lg"
                      />
                    ))}
                  </div>
                ) : filteredSubmissions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No submissions found
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredSubmissions.map((submission) => (
                      <Card key={submission.id} className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Logo and Product Image */}
                          <div className="flex flex-col gap-2 flex-shrink-0">
                            {submission.logo_url && (
                              <div className="w-16 h-16 rounded-lg overflow-hidden border bg-muted">
                                <Image
                                  src={submission.logo_url}
                                  alt={`${submission.name} logo`}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            {submission.image_url && (
                              <div className="w-32 h-20 rounded-lg overflow-hidden border bg-muted">
                                <Image
                                  src={submission.image_url}
                                  alt={`${submission.name} screenshot`}
                                  width={128}
                                  height={80}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-semibold text-foreground">
                                  {submission.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  {getStatusBadge(submission.status)}
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(
                                      submission.created_at
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {submission.status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleEditSubmission(submission)
                                      }
                                      disabled={actionLoading === submission.id}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="default"
                                      onClick={() =>
                                        handleApproveSubmission(submission.id)
                                      }
                                      disabled={actionLoading === submission.id}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() =>
                                        handleRejectSubmission(submission.id)
                                      }
                                      disabled={actionLoading === submission.id}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>

                            <p className="text-muted-foreground mb-3 line-clamp-2">
                              {submission.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <a
                                  href={submission.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline truncate"
                                >
                                  {submission.url}
                                </a>
                                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                              </div>

                              <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-muted-foreground" />
                                <span className="truncate">
                                  {submission.category_name}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span>{submission.pricing}</span>
                              </div>
                            </div>

                            {submission.rejection_reason && (
                              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-600">
                                  <strong>Rejection Reason:</strong>{" "}
                                  {submission.rejection_reason}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Submission</DialogTitle>
              <DialogDescription>
                Make changes to the submission before approving it.
              </DialogDescription>
            </DialogHeader>

            {editingSubmission && (
              <form
                onSubmit={editForm.handleSubmit(handleUpdateSubmission)}
                className="space-y-4"
              >
                {/* Images Preview */}
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  {editingSubmission.logo_url && (
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border bg-muted">
                        <Image
                          src={editingSubmission.logo_url}
                          alt="Product Logo"
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Logo
                      </span>
                    </div>
                  )}
                  {editingSubmission.image_url && (
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-32 h-20 rounded-lg overflow-hidden border bg-muted">
                        <Image
                          src={editingSubmission.image_url}
                          alt="Product Screenshot"
                          width={128}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Screenshot
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-name">Product Name</Label>
                  <Input
                    id="edit-name"
                    {...editForm.register("name")}
                    className={
                      editForm.formState.errors.name ? "border-red-500" : ""
                    }
                  />
                  {editForm.formState.errors.name && (
                    <p className="text-sm text-red-600">
                      {editForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    rows={4}
                    {...editForm.register("description")}
                    className={
                      editForm.formState.errors.description
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {editForm.formState.errors.description && (
                    <p className="text-sm text-red-600">
                      {editForm.formState.errors.description.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-url">Website URL</Label>
                  <Input
                    id="edit-url"
                    type="url"
                    {...editForm.register("url")}
                    className={
                      editForm.formState.errors.url ? "border-red-500" : ""
                    }
                  />
                  {editForm.formState.errors.url && (
                    <p className="text-sm text-red-600">
                      {editForm.formState.errors.url.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={editForm.watch("category_name")}
                    onValueChange={(value) =>
                      editForm.setValue("category_name", value)
                    }
                  >
                    <SelectTrigger>
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
                  {editForm.formState.errors.category_name && (
                    <p className="text-sm text-red-600">
                      {editForm.formState.errors.category_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-pricing">Pricing</Label>
                  <Select
                    value={editForm.watch("pricing")}
                    onValueChange={(value) =>
                      editForm.setValue(
                        "pricing",
                        value as (typeof PRICING_OPTIONS)[number]
                      )
                    }
                  >
                    <SelectTrigger>
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
                  {editForm.formState.errors.pricing && (
                    <p className="text-sm text-red-600">
                      {editForm.formState.errors.pricing.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={actionLoading === "update"}>
                    {actionLoading === "update" ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
