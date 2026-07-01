import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublicGuidesByCategory } from "@/lib/apiCalls";
import GuideCategoryContent from "@/components/guides/GuideCategoryContent";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const { getPublicGuideCategories } = await import("@/lib/apiCalls");
    const categories = await getPublicGuideCategories();
    return categories.map((cat) => ({ category: cat.slug }));
  } catch {
    return [];
  }
}

interface Props {
  params: Promise<{ category: string }>;
}

async function CategoryLoader({ params }: Props) {
  const { category } = await params;
  const data = await getPublicGuidesByCategory(category);

  return (
    <GuideCategoryContent
      categorySlug={category}
      category={data?.category ?? null}
      guides={data?.guides ?? []}
    />
  );
}

export default function GuideCategoryPage(props: Props) {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryLoader {...props} />
    </Suspense>
  );
}

function CategorySkeleton() {
  return (
    <div className="min-h-screen container mx-auto px-4 md:px-6 py-10 max-w-5xl space-y-12">
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-16 w-16 rounded-2xl" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-96" />
        <Skeleton className="h-6 w-72" />
      </div>
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
