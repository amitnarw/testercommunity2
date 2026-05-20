"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface BlogAuthor {
  id: number;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  dataAiHint: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BlogAuthorsTableProps {
  authors: BlogAuthor[];
  isLoading: boolean;
  onEdit: (author: BlogAuthor) => void;
  onDelete: (id: number) => void;
}

export function BlogAuthorsTable({
  authors,
  isLoading,
  onEdit,
  onDelete,
}: BlogAuthorsTableProps) {
  return (
    <div className="rounded-md border overflow-hidden grid grid-cols-1">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Bio</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-20 ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : authors.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                No authors found. Create your first author to get started.
              </TableCell>
            </TableRow>
          ) : (
            authors.map((author) => (
              <TableRow key={author.id}>
                <TableCell>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={author.avatarUrl || undefined} />
                    <AvatarFallback className="text-xs">
                      {author.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{author.name}</TableCell>
                <TableCell className="max-w-[300px] truncate text-muted-foreground">
                  {author.bio || "—"}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {format(new Date(author.createdAt), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(author)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(author.id)}
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
