'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { generateBugInsightsAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full font-bold">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      Generate Insights
    </Button>
  );
}

export default function AiInsightTool() {
  const [state, formAction] = useFormState(generateBugInsightsAction, initialState);
  const [showResult, setShowResult] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message === "Success" && state.insights) {
      setShowResult(true);
      toast({
        title: "Analysis Complete",
        description: "Your bug report insights are ready.",
      });
      formRef.current?.reset();
    } else if (state.message.startsWith('Error:')) {
      setShowResult(false);
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card className="sticky top-24">
          <form ref={formRef} action={formAction}>
            <CardHeader>
              <CardTitle className="font-headline">Bug Report Analysis</CardTitle>
              <CardDescription>
                Paste your raw bug reports here. For best results, provide as much detail as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                name="bugReports"
                placeholder="Example: 'User clicks login, app crashes on iOS 17.2. Console shows null pointer exception...'"
                rows={10}
                required
              />
            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>
      </div>

      <div className="md:col-span-2">
        <AnimatePresence>
          {showResult && state.insights ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-gradient-to-br from-primary/10 to-background">
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground">
                      <Bot className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="font-headline text-2xl">AI-Generated Insights</CardTitle>
                    <CardDescription>Here is a summary of the analysis from the provided reports.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap rounded-md bg-background/50 p-4 border">
                    {state.insights}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] border-2 border-dashed rounded-lg p-8 text-center bg-background">
              <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-headline text-xl font-semibold">Your insights will appear here</h3>
              <p className="text-muted-foreground mt-2">Submit your bug reports to get started.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
