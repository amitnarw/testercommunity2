import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Tester } from '@/lib/types';
import { Star, MapPin } from 'lucide-react';

interface TesterCardProps {
  tester: Tester;
}

export default function TesterCard({ tester }: TesterCardProps) {
  return (
    <Card className="flex flex-col h-full transition-all duration-300 group overflow-hidden rounded-xl">
      <CardHeader className="flex-row gap-4 items-center p-4">
        <Avatar className="w-16 h-16 border-2 border-primary/20">
          <AvatarImage src={tester.avatarUrl} data-ai-hint={tester.dataAiHint} />
          <AvatarFallback>{tester.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="font-headline text-lg">{tester.name}</CardTitle>
          <CardDescription className="flex items-center gap-1"><MapPin className="w-3 h-3"/>{tester.country}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-0">
        <div className="flex flex-wrap gap-2 mb-4">
          {tester.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary" className="rounded-full">{skill}</Badge>
          ))}
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-bold">{tester.reputation.toFixed(1)}</span>
            </div>
            <p><span className="font-bold text-foreground">${tester.rate}</span>/hr</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full font-bold rounded-xl">
            <Link href="#">View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
