import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublicGuideBySlug } from "@/lib/apiCalls";
import type { PublicGuide } from "@/lib/apiCalls";
import GuideArticleContent from "@/components/guides/GuideArticleContent";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const { getPublicGuides } = await import("@/lib/apiCalls");
    const guides = await getPublicGuides();
    return guides.map((g) => ({
      category: g.category.slug,
      article: g.slug,
    }));
  } catch {
    return [];
  }
}

interface Props {
  params: Promise<{ category: string; article: string }>;
}

async function ArticleLoader({ params }: Props) {
  const { article: articleSlug, category: categorySlug } = await params;
  const article = await getPublicGuideBySlug(articleSlug);

  if (!article) {
    notFound();
  }

  let relatedArticles: PublicGuide[] = [];
  try {
    const { getPublicGuidesByCategory } = await import("@/lib/apiCalls");
    const catData = await getPublicGuidesByCategory(article.category.slug);
    relatedArticles = (catData?.guides ?? []).filter(
      (g) => g.id !== article.id,
    ).slice(0, 3);
  } catch {}

  return (
    <GuideArticleContent
      article={article}
      categorySlug={categorySlug}
      relatedArticles={relatedArticles}
    />
  );
}

export default function GuideArticlePage(props: Props) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <ArticleLoader {...props} />
    </Suspense>
  );
}

function ArticleSkeleton() {
  return (
    <div className="min-h-screen container mx-auto px-4 md:px-6 py-10 max-w-4xl space-y-12">
      <div className="space-y-4">
        <Skeleton className="h-4 w-48" />
        <div className="flex justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <div className="flex gap-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}
