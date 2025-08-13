import { notFound } from 'next/navigation';
import Image from 'next/image';
import { blogPosts } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-background">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
                 <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Blog
                </Link>
                <article>
                    <header className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={post.author.avatarUrl} data-ai-hint={post.author.dataAiHint} />
                                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{post.author.name}</span>
                            </div>
                            <span>•</span>
                            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                        </div>
                    </header>

                    <div className="relative w-full h-96 mb-8">
                        <Image
                            src={post.imageUrl}
                            alt={post.title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-xl shadow-lg"
                            data-ai-hint={post.dataAiHint}
                        />
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none mx-auto text-foreground"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                     <div className="mt-8 pt-8 border-t">
                        <h3 className="text-xl font-semibold mb-4">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="rounded-full">{tag}</Badge>
                            ))}
                        </div>
                    </div>
                </article>
            </div>
        </div>
    </div>
  );
}
