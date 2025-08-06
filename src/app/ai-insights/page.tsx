import AiInsightTool from '@/components/ai-insight-tool';
import { Bot, Lightbulb, FileText } from 'lucide-react';

export default function AiInsightsPage() {
  return (
    <div className="min-h-screen bg-secondary/50">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <header className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center bg-primary text-primary-foreground rounded-full w-16 h-16 mb-4">
            <Bot className="w-8 h-8" />
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold">AI-Powered Bug Insights</h1>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Paste your bug reports below and let our AI analyze trends, identify root causes, and provide actionable insights in seconds.
          </p>
        </header>

        <main className="animate-fade-in-up animation-delay-200">
          <AiInsightTool />
        </main>
        
        <section className="mt-16 text-center animate-fade-in-up animation-delay-400">
            <h2 className="font-headline text-2xl font-bold mb-8">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background border mb-4">
                        <FileText className="w-6 h-6 text-primary"/>
                    </div>
                    <h3 className="font-semibold mb-2">1. Paste Reports</h3>
                    <p className="text-muted-foreground">Combine multiple bug reports into a single text block for analysis.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background border mb-4">
                        <Bot className="w-6 h-6 text-primary"/>
                    </div>
                    <h3 className="font-semibold mb-2">2. Generate Insights</h3>
                    <p className="text-muted-foreground">Our AI engine processes the data to find patterns and correlations.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background border mb-4">
                        <Lightbulb className="w-6 h-6 text-primary"/>
                    </div>
                    <h3 className="font-semibold mb-2">3. Get Clarity</h3>
                    <p className="text-muted-foreground">Receive a summarized report with key takeaways and recommendations.</p>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
}
