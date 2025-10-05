import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { BlogPost } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
        <Card className="flex flex-col h-full overflow-hidden rounded-xl transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1">
            <CardHeader className="p-0">
                <div className="relative w-full h-48">
                <Image
                    src={post.imageUrl}
                    alt={post.title}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={post.dataAiHint}
                />
                </div>
            </CardHeader>
            <CardContent className="p-6 flex-1">
                <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">{post.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="rounded-full">{tag}</Badge>
                    ))}
                </div>
                <CardDescription>{post.excerpt}</CardDescription>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={post.author.avatarUrl} data-ai-hint={post.author.dataAiHint} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-foreground">{post.author.name}</p>
                         <p>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                </div>
                 <div className="flex items-center text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Read More <ArrowRight className="w-4 h-4 ml-1" />
                </div>
            </CardFooter>
        </Card>
    </Link>
  );
}
