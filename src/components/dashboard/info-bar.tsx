import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Bug, Copy, ExternalLink, Lightbulb, PartyPopper, Star } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from '@/hooks/use-toast';
import { Project } from "@/lib/types";


const InfoCard = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
        }}
        className={cn("rounded-2xl bg-card text-card-foreground p-3 shadow-sm", className)}>
        <div className="flex items-center gap-3 mb-3">
            <h3 className="text-sm text-center w-full">{title}</h3>
        </div>
        <div>
            {children}
        </div>
    </motion.div>
);

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: "Copied to clipboard!",
        description: text,
    })
}

export default function InfoBar({project, isUnderReviewOrRejected, feedbackBreakdown }: {project: Project, isUnderReviewOrRejected: boolean, feedbackBreakdown: {
    bugs: number;
    suggestions: number;
    praise: number;
} }) {
    return (
        <motion.div
            variants={{
                visible: { transition: { staggerChildren: 0.15 } }
            }}
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-4 mt-8">

            <div className='flex flex-row gap-1 items-center justify-center rounded-2xl overflow-hidden col-span-3 sm:col-span-2'>
                <div className="bg-gradient-to-tl from-primary/20 to-primary text-primary-foreground p-5 h-full w-full flex flex-col items-center justify-center gap-1">
                    <p className="text-xs">Testers</p>
                    <p className="text-4xl sm:text-5xl font-bold">{project.testersStarted}<span className='text-2xl text-white/50'>/14</span></p>
                </div>
                <div className="bg-gradient-to-tr from-primary/20 to-primary text-primary-foreground p-5 h-full w-full flex flex-col items-center justify-center gap-1">
                    <p className="text-xs">Days</p>
                    <p className="text-4xl sm:text-5xl font-bold">{isUnderReviewOrRejected ? 0 : project.totalDays}<span className='text-2xl text-white/50'>/16</span></p>
                </div>
            </div>

            <InfoCard title="Feedback Breakdown" className='col-span-3 lg:col-span-2'>
                <div className='grid grid-cols-3 gap-2'>
                    <div className="bg-gradient-to-bl from-red-500/20 to-red-500/10 p-2 sm:p-5 rounded-lg relative overflow-hidden w-full text-center">
                        <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-45 text-red-500">
                            <Bug />
                        </div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Bugs</p>
                        <p className="text-3xl sm:text-4xl font-bold">{feedbackBreakdown.bugs}</p>
                    </div>
                    <div className="bg-gradient-to-bl from-yellow-500/20 to-yellow-500/10 p-2 sm:p-5 rounded-lg relative overflow-hidden w-full text-center">
                        <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-45 text-yellow-500">
                            <Lightbulb />
                        </div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Suggestions</p>
                        <p className="text-3xl sm:text-4xl font-bold">{feedbackBreakdown.suggestions}</p>
                    </div>
                    <div className="bg-gradient-to-bl from-green-500/20 to-green-500/10 p-2 sm:p-5 rounded-lg relative overflow-hidden w-full text-center">
                        <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-90 text-green-500">
                            <PartyPopper />
                        </div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Praise</p>
                        <p className="text-3xl sm:text-4xl font-bold">{feedbackBreakdown.praise}</p>
                    </div>
                </div>
            </InfoCard>

            <section className='flex flex-col items-center rounded-2xl bg-card text-card-foreground p-3 shadow-sm relative overflow-hidden'>
                <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-sm text-center w-full">Average Rating</h3>
                </div>
                <div className='flex flex-col items-center justify-center h-full w-full'>
                    <Star className="w-5 h-5 text-amber-400/0 fill-amber-400/20 scale-[2] absolute top-2 left-2 rotate-45" />
                    <div className="flex items-center justify-center gap-2 bg-secondary rounded-lg h-full w-full z-10">
                        <p className="text-4xl font-bold">{project.overallRating.toFixed(1)}</p>
                        <p className="text-muted-foreground hidden sm:block">/ 5.0</p>
                    </div>
                    <Star className="w-5 h-5 text-amber-400/0 fill-amber-400/20 scale-[3] absolute top-7 right-2 rotate-90" />
                </div>
            </section>

            <section className='flex flex-col items-center rounded-2xl bg-card text-card-foreground p-3 shadow-sm'>
                <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-sm text-center w-full">App Information</h3>
                </div>
                <div className='flex flex-col items-center justify-center h-full space-y-3 text-sm w-full'>
                    <div className="flex flex-col items-center justify-between">
                        <span className="text-xs text-muted-foreground">Package Name</span>
                        <span className="font-mono text-primary break-all">{project.packageName}</span>
                    </div>
                    <div className="flex flex-col items-start gap-2 w-full">
                        <div className="flex flex-row gap-2 w-full">
                            <Button variant="outline" size="sm" className="flex-1 py-1.5" onClick={() => copyToClipboard(`https://play.google.com/store/apps/details?id=${project.packageName}`)}>
                                <Copy className="!h-3 !w-3" /> <span className="hidden sm:block text-xs">Copy</span>
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 py-1.5" asChild>
                                <a href={`https://play.google.com/store/apps/details?id=${project.packageName}`} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="!h-3 !w-3" /> <span className="hidden sm:block text-xs">Open</span>
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

        </motion.div>
    )
} 