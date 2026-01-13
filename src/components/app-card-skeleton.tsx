import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function AppCardSkeleton() {
  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-2xl border-0 bg-card">
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="flex items-start gap-4 mb-4">
          <Skeleton className="h-16 w-16 rounded-lg" />
          <div className="flex-grow flex flex-col items-end gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex-grow space-y-2">
          <Skeleton className="h-6 w-2/3" />
          <div className="space-y-1 pt-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-3 p-4 pt-0 mt-4">
        <Separator />
        <div className="flex justify-between w-full">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-9 w-full rounded-lg bg-primary/5" />
      </CardFooter>
    </Card>
  );
}
