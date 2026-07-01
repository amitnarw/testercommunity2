import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublicGuideCategories, getPublicPopularGuides, getPublicGuides } from "@/lib/apiCalls";
import type { PublicGuideCategory, PublicGuide } from "@/lib/apiCalls";
import GuidesPageContent from "@/components/guides/GuidesPageContent";

export const dynamic = "force-dynamic";
export const revalidate = 300;

async function GuidesPageLoader() {
  const [categories, popularGuides, allGuides] = await Promise.all([
    getPublicGuideCategories(),
    getPublicPopularGuides(5),
    getPublicGuides(),
  ]);

  const guidesByCategory: Record<number, number> = {};
  for (const guide of allGuides) {
    guidesByCategory[guide.categoryId] = (guidesByCategory[guide.categoryId] || 0) + 1;
  }

  return (
    <GuidesPageContent
      categories={categories}
      popularGuides={popularGuides}
      guidesByCategory={guidesByCategory}
    />
  );
}

export default function GuidesPage() {
  return (
    <Suspense fallback={<GuidesPageSkeleton />}>
      <GuidesPageLoader />
    </Suspense>
  );
}

function GuidesPageSkeleton() {
  return (
    <div className="min-h-screen container mx-auto px-4 md:px-6 py-10 max-w-7xl">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
        <Skeleton className="h-16 w-96 mx-auto" />
        <Skeleton className="h-6 w-64 mx-auto" />
        <Skeleton className="h-12 w-full max-w-xl mx-auto rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="lg:col-span-2 grid grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-3xl border p-8 space-y-4">
              <Skeleton className="h-14 w-14 rounded-2xl" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-40" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
