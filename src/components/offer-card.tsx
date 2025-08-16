
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Gift, ArrowRight } from "lucide-react";
import Link from "next/link";

interface OfferCardProps {
    isCollapsed: boolean;
}

export function OfferCard({ isCollapsed }: OfferCardProps) {
    if (isCollapsed) {
        return (
            <Link href="/pricing">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 transition-all">
                    <Gift className="h-5 w-5"/>
                    <span className="sr-only">Buy Points</span>
                </div>
            </Link>
        )
    }

    return (
        <Card className="rounded-xl overflow-hidden bg-gradient-to-br from-primary to-accent text-primary-foreground border-none">
            <CardContent className="p-4 text-center">
                <div className="p-2 bg-primary-foreground/20 rounded-full w-fit mx-auto mb-2">
                    <Gift className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold mb-1">New Offers!</p>
                <p className="text-xs text-primary-foreground/80 mb-3">Check out our new point packages.</p>
                <Button size="sm" variant="secondary" className="w-full h-8" asChild>
                    <Link href="/pricing">Buy Points <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
            </CardContent>
        </Card>
    )
}
