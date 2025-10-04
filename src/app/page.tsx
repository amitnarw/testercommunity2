'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { generateSummary } from './actions';
import { ShowcaseHeader } from '@/components/showcase-header';
import { ShowcaseLayout } from '@/components/showcase-layout';

const urlSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

export default function Home() {
  const [demoUrl, setDemoUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof urlSchema>>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: '',
    },
  });

  function handleLoadDemo(data: z.infer<typeof urlSchema>) {
    setDemoUrl(data.url);
  }

  async function handleGenerateSummary() {
    const url = form.getValues('url');
    const validation = urlSchema.safeParse({ url });
    if (!validation.success) {
      form.trigger('url');
      return;
    }

    setIsLoading(true);
    setSummary('Generating summary...');

    try {
      const result = await generateSummary(url);
      if (result.success) {
        setSummary(result.summary);
      } else {
        setSummary('');
        toast({
          variant: 'destructive',
          title: 'Error Generating Summary',
          description: result.error,
        });
      }
    } catch (error) {
      setSummary('');
      toast({
        variant: 'destructive',
        title: 'An Unexpected Error Occurred',
        description: 'Please try again later.',
      });
    }

    setIsLoading(false);
  }

  const leftPanel = (
    <Card className="h-full w-full flex flex-col rounded-none border-0 border-r shadow-none">
      <div className="flex items-center gap-2 border-b p-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground truncate">
            {demoUrl || 'No URL Loaded'}
          </p>
        </div>
      </div>
      <CardContent className="flex-1 p-0 bg-white">
        {demoUrl ? (
          <iframe
            src={demoUrl}
            className="h-full w-full border-0"
            title="Demo"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted/30">
            <p className="text-center text-muted-foreground p-4">
              Enter a URL and click 'Load Demo' to start your showcase.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const rightPanel = (
    <div className="flex flex-col gap-6 h-full p-6 overflow-y-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleLoadDemo)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Demo URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-wrap gap-2">
            <Button type="submit">Load Demo</Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerateSummary}
              disabled={isLoading}
              className="bg-accent/20 border-accent/50 hover:bg-accent/30"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
              )}
              Generate Summary
            </Button>
          </div>
        </form>
      </Form>
      <Separator />
      <div className="flex-1 flex flex-col min-h-0">
        <h3 className="text-lg font-medium mb-2 font-headline">Description</h3>
        <Textarea
          placeholder="AI-generated summary or your own notes will appear here."
          className="flex-1 resize-none text-base"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <ShowcaseHeader />
      <main className="flex-1 border-t">
        <ShowcaseLayout leftPanel={leftPanel} rightPanel={rightPanel} />
      </main>
    </div>
  );
}
