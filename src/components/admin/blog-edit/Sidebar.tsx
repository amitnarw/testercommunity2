"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useBlogFormContext } from "./useBlogForm";
import { SidebarPanel } from "./SidebarPanel";
import {
  Globe,
  Lock,
  User,
  Link as LinkIcon,
  FileText,
  Tag,
  Calendar,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";

interface SidebarProps {
  blog?: {
    id?: number;
    createdAt?: string | null;
    updatedAt?: string | null;
  };
}

export function Sidebar({ blog }: SidebarProps) {
  const { form, currentTags, removeTag } = useBlogFormContext();
  const [tagInput, setTagInput] = useState("");
  const watchIsActive = form.watch("isActive");
  const watchAuthorAvatarUrl = form.watch("authorAvatarUrl");
  const watchAuthorName = form.watch("authorName");
  const watchContent = form.watch("content");

  const handleAddTag = () => {
    if (tagInput.trim()) {
      form.setValue("tags", [...currentTags, tagInput.trim()], { shouldDirty: true });
      setTagInput("");
    }
  };

  return (
    <div className="w-full lg:w-80 lg:border-l lg:border-t-0 border-t border-border bg-muted/10 p-4 space-y-4">
      {/* Status Panel */}
      <SidebarPanel
        title="Status & Visibility"
        icon={watchIsActive ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
        defaultOpen={true}
      >
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel className="text-sm">Published</FormLabel>
                <FormDescription className="text-xs">
                  Make this post visible on the blog
                </FormDescription>
              </div>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormItem>
          )}
        />
        <div className="mt-4 pt-4 border-t space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {blog?.createdAt
                ? format(new Date(blog.createdAt), "MMM dd, yyyy 'at' h:mm a")
                : "Not published"}
            </span>
          </div>
          {blog?.updatedAt && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Last updated: {format(new Date(blog.updatedAt), "MMM dd, yyyy")}
              </span>
            </div>
          )}
        </div>
      </SidebarPanel>

      {/* Author Panel */}
      <SidebarPanel
        title="Author"
        icon={<User className="h-4 w-4" />}
        defaultOpen={true}
      >
        <FormField
          control={form.control}
          name="authorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Name</FormLabel>
              <FormControl>
                <Input placeholder="Author name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="authorAvatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Avatar URL</FormLabel>
              <FormControl>
                <Input placeholder="https://...avatar.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {watchAuthorAvatarUrl && (
          <div className="mt-2">
            <Avatar className="h-16 w-16">
              <AvatarImage src={watchAuthorAvatarUrl} />
              <AvatarFallback>
                {watchAuthorName?.slice(0, 2)?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </SidebarPanel>

      {/* Slug Panel */}
      <SidebarPanel
        title="Slug"
        icon={<LinkIcon className="h-4 w-4" />}
        defaultOpen={false}
      >
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">URL Slug</FormLabel>
              <FormControl>
                <Input placeholder="blog-url-slug" {...field} className="font-mono text-sm" />
              </FormControl>
              <FormDescription className="text-xs">
                URL-friendly version of the title
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </SidebarPanel>

      {/* Excerpt Panel */}
      <SidebarPanel
        title="Excerpt"
        icon={<FileText className="h-4 w-4" />}
        defaultOpen={false}
      >
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Excerpt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description for listing page..."
                  {...field}
                  rows={3}
                  className="text-sm"
                />
              </FormControl>
              <FormDescription className="text-xs">
                Shown as excerpt on blog listing
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </SidebarPanel>

      {/* Tags Panel */}
      <SidebarPanel
        title="Tags"
        icon={<Tag className="h-4 w-4" />}
        defaultOpen={true}
      >
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {currentTags.map((tag, index) => (
              <span
                key={index}
                className="bg-primary/10 text-primary px-2 py-1 rounded text-sm flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {currentTags.length === 0 && (
              <p className="text-sm text-muted-foreground">No tags added</p>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add a tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="flex-1 text-sm"
            />
            <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SidebarPanel>

      {/* Quick Stats */}
      <SidebarPanel
        title="Quick Stats"
        icon={<FileText className="h-4 w-4" />}
        defaultOpen={false}
      >
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Blog ID</span>
            <span className="font-mono">#{blog?.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tags</span>
            <span>{currentTags.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Content Length</span>
            <span>{watchContent?.length || 0} chars</span>
          </div>
        </div>
      </SidebarPanel>
    </div>
  );
}
