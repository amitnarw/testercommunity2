import { BlogListing } from "@/components/blog/blog-listing";
import { blogPosts } from "@/lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | inTesters Community",
  description:
    "Insights, tutorials, and stories from the world of app testing and quality assurance.",
};

export default function BlogPage() {
  return (
    <div
      data-loc="BlogPage"
      className="min-h-screen bg-background relative overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            The inTesters
            <span className="block text-primary">Chronicles</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Deep dives into quality assurance, community stories, and the future
            of software testing.
          </p>
        </div>

        <BlogListing posts={blogPosts} />
      </div>
    </div>
  );
}
