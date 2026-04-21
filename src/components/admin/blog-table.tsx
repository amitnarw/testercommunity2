"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface Blog {
  id: number;
  title: string;
  authorName: string;
  tags: string[];
  description: string;
  isActive: boolean;
  createdAt: string;
  media: { src: string }[];
}

interface BlogTableProps {
  blogs: Blog[];
  isLoading: boolean;
  onEdit: (blog: Blog) => void;
  onDelete: (id: number) => void;
}

export function BlogTable({
  blogs,
  isLoading,
  onEdit,
  onDelete,
}: BlogTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-20 ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : blogs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                No blog posts found.
              </TableCell>
            </TableRow>
          ) : (
            blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell className="font-medium max-w-[300px] truncate">
                  {blog.title}
                </TableCell>
                <TableCell>{blog.authorName}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {(blog.tags || []).slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {(blog.tags || []).length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{blog.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={blog.isActive ? "default" : "secondary"}
                    className={cn(
                      blog.isActive
                        ? "bg-green-500/20 text-green-700 hover:bg-green-500/30 border-green-500/30"
                        : "",
                    )}
                  >
                    {blog.isActive ? "Active" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {format(new Date(blog.createdAt), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(blog)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(blog.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}