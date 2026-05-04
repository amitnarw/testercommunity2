"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, Star } from "lucide-react";
import { useTestimonialById, useCreateTestimonial, useUpdateTestimonial } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { SafeImage } from "@/components/safe-image";
import { cn } from "@/lib/utils";

export default function AdminReviewEditPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params?.id as string;
  const isNew = id === "new" || id === "create";

  const numericId = isNew ? 0 : parseInt(id);
  const { data: testimonial, isLoading } = useTestimonialById(numericId, { enabled: !isNew && numericId > 0 });

  const createMutation = useCreateTestimonial({
    onSuccess: () => {
      toast({ title: "Success", description: "Review created" });
      router.push("/admin/reviews");
    },
    onError: (err: any) =>
      toast({ title: "Error", description: err.message || "Failed to create", variant: "destructive" }),
  });

  const updateMutation = useUpdateTestimonial({
    onSuccess: () => {
      toast({ title: "Success", description: "Review updated" });
      router.push("/admin/reviews");
    },
    onError: (err: any) =>
      toast({ title: "Error", description: err.message || "Failed to update", variant: "destructive" }),
  });

  const [form, setForm] = useState({
    name: "",
    role: "",
    avatar: "",
    dataAiHint: "",
    comment: "",
    image: "",
    appLink: "",
    tags: "",
    rating: 5,
    isActive: true,
  });

  useEffect(() => {
    if (testimonial && !isNew) {
      setForm({
        name: testimonial.name || "",
        role: testimonial.role || "",
        avatar: testimonial.avatar || "",
        dataAiHint: testimonial.dataAiHint || "",
        comment: testimonial.comment || "",
        image: testimonial.image || "",
        appLink: testimonial.appLink || "",
        tags: (testimonial.tags || []).join(", "),
        rating: testimonial.rating ?? 5,
        isActive: testimonial.isActive ?? true,
      });
    }
  }, [testimonial, isNew]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.role || !form.avatar || !form.comment) {
      toast({ title: "Validation Error", description: "Name, role, avatar, and comment are required.", variant: "destructive" });
      return;
    }
    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    if (isNew) {
      createMutation.mutate(payload);
    } else {
      updateMutation.mutate({ id: numericId, ...payload });
    }
  };

  const [avatarError, setAvatarError] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setAvatarError(false);
  }, [form.avatar]);

  useEffect(() => {
    setImageError(false);
  }, [form.image]);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 container mx-auto px-4 md:px-6 py-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 container mx-auto px-4 md:px-6 py-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/reviews")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
            {isNew ? "Create Review" : "Edit Review"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isNew ? "Add a new testimonial or success story." : `Editing review from ${testimonial?.name || ""}`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Review Details</CardTitle>
            <CardDescription>Fill in the information about this testimonial.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Sarah Jennings" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Input id="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Lead Developer, TechNova" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL *</Label>
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-2">
                  <Input id="avatar" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} placeholder="https://images.unsplash.com/..." />
                  {form.avatar && (
                    <div className={cn(
                      "relative w-16 h-16 rounded-full overflow-hidden border bg-muted",
                      avatarError ? "border-destructive" : "border-border"
                    )}>
                      {avatarError ? (
                        <div className="w-full h-full flex items-center justify-center text-destructive text-xs text-center p-1">
                          Invalid
                        </div>
                      ) : (
                        <img
                          src={form.avatar}
                          alt="avatar preview"
                          className="w-full h-full object-cover"
                          onError={() => setAvatarError(true)}
                          onLoad={() => setAvatarError(false)}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Review Image URL</Label>
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-2">
                  <Input id="image" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://images.unsplash.com/..." />
                  {form.image && (
                    <div className={cn(
                      "relative w-full max-w-[200px] aspect-video rounded-lg overflow-hidden border bg-muted",
                      imageError ? "border-destructive" : "border-border"
                    )}>
                      {imageError ? (
                        <div className="w-full h-full flex items-center justify-center text-destructive text-xs text-center p-1">
                          Invalid image URL
                        </div>
                      ) : (
                        <img
                          src={form.image}
                          alt="image preview"
                          className="w-full h-full object-cover"
                          onError={() => setImageError(true)}
                          onLoad={() => setImageError(false)}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appLink">App / Website Link</Label>
                <Input id="appLink" value={form.appLink} onChange={(e) => setForm({ ...form, appLink: e.target.value })} placeholder="https://technova.io" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataAiHint">AI Hint</Label>
                <Input id="dataAiHint" value={form.dataAiHint} onChange={(e) => setForm({ ...form, dataAiHint: e.target.value })} placeholder="woman portrait" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm({ ...form, rating: star })}
                    className="p-1 transition-colors hover:scale-110"
                  >
                    <Star
                      className={cn(
                        "w-6 h-6 transition-colors",
                        star <= form.rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-muted text-muted-foreground"
                      )}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">{form.rating} / 5</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Enterprise, SaaS, High Volume" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Comment *</Label>
              <Textarea id="comment" rows={4} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="The testimonial text..." />
            </div>

            <div className="flex items-center gap-2">
              <Switch id="isActive" checked={form.isActive} onCheckedChange={(c) => setForm({ ...form, isActive: c })} />
              <Label htmlFor="isActive">Active (visible on public site)</Label>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        {form.avatar && (
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 border rounded-xl bg-secondary/20">
                <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-background shadow-md flex-shrink-0">
                  <SafeImage src={form.avatar} alt={form.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-foreground truncate">{form.name || "Name"}</p>
                  <p className="text-xs text-muted-foreground truncate">{form.role || "Role"}</p>
                  {form.comment && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">"{form.comment}"</p>
                  )}
                </div>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {Array.from({ length: form.rating }).map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/reviews")}>
            Cancel
          </Button>
          <Button type="submit" className="gap-2" disabled={createMutation.isPending || updateMutation.isPending}>
            <Save className="h-4 w-4" />
            {isNew ? "Create Review" : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
