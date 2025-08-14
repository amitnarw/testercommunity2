
import BlogPostCard from '@/components/blog-post-card';
import { blogPosts } from '@/lib/data.tsx';
import { Rss } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <section className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold">The inTesters Blog</h1>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Insights, tutorials, and stories from the world of app testing and quality assurance.
          </p>
        </section>

        <section className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                ))}
            </div>
        </section>
      </div>
    </div>
  );
}
