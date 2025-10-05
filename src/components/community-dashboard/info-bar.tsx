import { cn } from "@/lib/utils";
import { Bug, Lightbulb, PartyPopper } from "lucide-react";
import { Project } from "@/lib/types";

export default function InfoBar({ project, isUnderReviewOrRejected, feedbackBreakdown }: {
    project: Project, isUnderReviewOrRejected: boolean, feedbackBreakdown: {
        bugs: number;
        suggestions: number;
        praise: number;
        totalTesters: number;
    }
}) {
    return (
        <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 text-center", isUnderReviewOrRejected && "pointer-events-none")}>
            <div className='flex flex-row gap-1 items-center justify-center rounded-2xl overflow-hidden'>
                <div className="bg-gradient-to-tl from-primary/20 to-primary text-primary-foreground p-5 h-full w-full flex flex-col justify-center gap-1">
                    <p className="text-xs">Testers</p>
                    <p className="text-4xl sm:text-5xl font-bold">{feedbackBreakdown?.totalTesters}<span className='text-2xl text-white/50'>/14</span></p>
                </div>
                <div className="bg-gradient-to-tr from-primary/20 to-primary text-primary-foreground p-5 h-full w-full flex flex-col justify-center gap-1">
                    <p className="text-xs">Days</p>
                    <p className="text-4xl sm:text-5xl font-bold">{isUnderReviewOrRejected ? 0 : project.totalDays}<span className='text-2xl text-white/50'>/16</span></p>
                </div>
            </div>
            <div className='flex flex-col gap-2 items-center justify-center bg-card rounded-2xl p-3'>
                <p className='text-xs sm:text-sm'>Feedback</p>
                <div className='flex flex-row gap-2 items-center justify-center w-full'>
                    <div className="bg-gradient-to-bl from-red-500/20 to-red-500/10 p-2 sm:p-5 rounded-lg relative overflow-hidden w-full">
                        <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-45 text-red-500">
                            <Bug />
                        </div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Bugs</p>
                        <p className="text-3xl sm:text-4xl font-bold">{feedbackBreakdown.bugs}</p>
                    </div>
                    <div className="bg-gradient-to-bl from-yellow-500/20 to-yellow-500/10 p-2 sm:p-5 rounded-lg relative overflow-hidden w-full">
                        <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-45 text-yellow-500">
                            <Lightbulb />
                        </div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Suggestions</p>
                        <p className="text-3xl sm:text-4xl font-bold">{feedbackBreakdown.suggestions}</p>
                    </div>
                    <div className="bg-gradient-to-bl from-green-500/20 to-green-500/10 p-2 sm:p-5 rounded-lg relative overflow-hidden w-full">
                        <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-90 text-green-500">
                            <PartyPopper />
                        </div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Praise</p>
                        <p className="text-3xl sm:text-4xl font-bold">{feedbackBreakdown.praise}</p>
                    </div>
                </div>
            </div>

            <div className='flex flex-row gap-2 items-center jutify-center'>
                <div className="bg-card p-3 pt-4 rounded-2xl flex flex-col justify-center h-full w-full">
                    <p className="text-xs sm:text-sm mb-3">Points Cost</p>
                    <p className="text-2xl sm:text-4xl font-bold bg-secondary rounded-lg h-full w-full flex flex items-center justify-center">{isUnderReviewOrRejected ? 0 : project.pointsCost.toLocaleString()}</p>
                </div>
                <div className="bg-card p-3 pt-4 rounded-2xl flex flex-col justify-center h-full w-full">
                    <p className="text-xs sm:text-sm mb-3">Android Version</p>
                    <p className="text-2xl sm:text-4xl py-2 sm:py-0 font-bold bg-secondary rounded-lg h-full w-full flex flex items-center justify-center">{isUnderReviewOrRejected ? 'N/A' : project.androidVersion}</p>
                </div>
            </div>
        </div>
    )
} 