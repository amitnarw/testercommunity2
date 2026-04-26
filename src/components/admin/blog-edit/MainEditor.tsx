"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SafeImage } from "@/components/safe-image";
import { TiptapEditor } from "@/components/ui/tiptap-editor";
import { useBlogFormContext } from "./useBlogForm";
import { Image as ImageIcon, ImageOff, Trash2, X, Plus } from "lucide-react";

export function MainEditor() {
  const { form, isNew } = useBlogFormContext();
  const [tagInput, setTagInput] = useState("");

  const watchImageUrl = form.watch("imageUrl");
  const watchAuthorAvatarUrl = form.watch("authorAvatarUrl");
  const watchAuthorName = form.watch("authorName");

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues("tags") || [];
      form.setValue("tags", [...currentTags, tagInput.trim()], { shouldDirty: true });
      setTagInput("");
    }
  };

  return (
    <div className="flex-1 px-4 lg:px-8 py-6 lg:py-8">
      {/* Title Input - WordPress style */}
      <div className="mb-6 lg:mb-8">
        <input
          type="text"
          placeholder="Enter title..."
          {...form.register("title")}
          className="w-full text-xl sm:text-2xl md:text-3xl font-bold bg-border/50 dark:bg-border placeholder:text-muted-foreground/50 rounded-xl p-3 px-4 outline-none focus:ring-2 focus:ring-primary/50"
        />
        {form.formState.errors.title && (
          <p className="text-sm text-destructive mt-1">{form.formState.errors.title.message}</p>
        )}
      </div>

      {/* Content Editor */}
      <div className="mb-6 lg:mb-8">
        <TiptapEditor
          key={isNew ? "new" : "edit"}
          content={form.getValues("content")}
          onChange={(content) => form.setValue("content", content, { shouldDirty: true })}
          placeholder="Start writing your blog post..."
        />
        {form.formState.errors.content && (
          <p className="text-sm text-destructive mt-1">{form.formState.errors.content.message}</p>
        )}
      </div>

      {/* Featured Image Below Editor */}
      <div className="border border-border/50 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-muted/30">
          <h3 className="font-medium text-sm flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Featured Image
          </h3>
        </div>
        <div className="p-4">
          {watchImageUrl ? (
            <div className="relative aspect-video w-full rounded-lg overflow-hidden group">
              <SafeImage
                src={watchImageUrl}
                alt="Featured"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    form.setValue("imageUrl", "");
                    form.setValue("dataAiHint", "");
                  }}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg py-12">
                <ImageOff className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground mb-4">No featured image selected</p>
                <Input
                  placeholder="Image URL (https://...)"
                  {...form.register("imageUrl")}
                  className="max-w-md"
                />
              </div>
              <FormField
                control={form.control}
                name="dataAiHint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">AI Image Hint</FormLabel>
                    <FormControl>
                      <Input placeholder="Keywords for AI image generation" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Optional hint for AI image generation
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
