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
import { Trash2, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { SafeImage } from "@/components/safe-image";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  dataAiHint?: string;
  comment: string;
  image?: string;
  appLink?: string;
  tags: string[];
  rating: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TestimonialsTableProps {
  testimonials: Testimonial[];
  isLoading: boolean;
  onDelete: (id: number) => void;
}

export function TestimonialsTable({
  testimonials,
  isLoading,
  onDelete,
}: TestimonialsTableProps) {
  const router = useRouter();
  return (
    <div className="rounded-md border overflow-hidden grid grid-cols-1">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="max-w-[250px]">Comment</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : testimonials.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No reviews found.
              </TableCell>
            </TableRow>
          ) : (
            testimonials.map((testimonial) => (
              <TableRow
                key={testimonial.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/admin/reviews/${testimonial.id}`)}
              >
                <TableCell>
                  {testimonial.avatar ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                      <SafeImage
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">N/A</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{testimonial.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-[160px] truncate">
                  {testimonial.role}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[250px] truncate">
                  "{testimonial.comment}"
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{testimonial.rating}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={testimonial.isActive ? "default" : "secondary"}
                    className={cn(
                      testimonial.isActive
                        ? "bg-green-500/20 text-green-700 hover:bg-green-500/30 border-green-500/30"
                        : "",
                    )}
                  >
                    {testimonial.isActive ? "Active" : "Hidden"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                  {format(new Date(testimonial.createdAt), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(testimonial.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
