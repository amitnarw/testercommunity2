
import { cn } from "@/lib/utils";

interface HowItWorksCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export function HowItWorksCard({ icon, title, description }: HowItWorksCardProps) {
    return (
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg flex items-center justify-center">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-muted-foreground mt-1">{description}</p>
            </div>
        </div>
    )
}
