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

interface PromoCode {
  id: number;
  code: string;
  fixedPoints: number;
  isActive: boolean;
  maxUses: number | null;
  usedCount: number;
  maxPerUser: number | null;
  createdAt: string;
}

interface PromoCodesTableProps {
  promoCodes: PromoCode[];
  isLoading: boolean;
  onEdit: (promo: PromoCode) => void;
  onDelete: (id: number) => void;
}

export function PromoCodesTable({
  promoCodes,
  isLoading,
  onEdit,
  onDelete,
}: PromoCodesTableProps) {
  return (
    <div className="rounded-md border overflow-hidden grid grid-cols-1  ">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Usage (Total)</TableHead>
            <TableHead>Limit (Per User)</TableHead>
            <TableHead className="hidden md:table-cell">Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-20 ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : promoCodes.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                No promo codes found.
              </TableCell>
            </TableRow>
          ) : (
            promoCodes.map((promo) => (
              <TableRow key={promo.id}>
                <TableCell className="font-mono font-bold tracking-wider">
                  {promo.code}
                </TableCell>
                <TableCell>{promo.fixedPoints}</TableCell>
                <TableCell>
                  <Badge
                    variant={promo.isActive ? "default" : "secondary"}
                    className={cn(
                      promo.isActive
                        ? "bg-green-500/20 text-green-700 hover:bg-green-500/30 border-green-500/30"
                        : "",
                    )}
                  >
                    {promo.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {promo.usedCount} / {promo.maxUses || "∞"}
                  </span>
                </TableCell>
                <TableCell>{promo.maxPerUser || "∞"}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {format(new Date(promo.createdAt), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(promo)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(promo.id)}
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
