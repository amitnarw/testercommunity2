
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Check, Coins, PlusCircle, ShoppingBag } from 'lucide-react';

const activity = [
    { type: 'earn', description: 'Tested "Finance Tracker"', points: 100 },
    { type: 'spend', description: 'Submitted "My Awesome App"', points: -500 },
    { type: 'earn', description: 'Tested "Pixel Adventure"', points: 75 },
    { type: 'earn', description: 'Feedback bonus for "Weatherly"', points: 25 },
];

export function PointsSidebar() {
    return (
        <div className="sticky top-24 space-y-6">
            <Card className="rounded-xl">
                <CardHeader>
                    <CardTitle>My Points</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <div className="text-5xl font-bold text-primary">2,450</div>
                    <p className="text-muted-foreground mt-1">Points Balance</p>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4"/> Earn More Points
                    </Button>
                    <Button variant="outline" className="w-full">
                        <ShoppingBag className="mr-2 h-4 w-4"/> Redeem Points
                    </Button>
                </CardFooter>
            </Card>
            <Card className="rounded-xl">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest points transactions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {activity.map((item, index) => (
                            <li key={index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-full ${item.type === 'earn' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                        <Check className={`w-3 h-3 ${item.type === 'earn' ? 'text-green-600' : 'text-red-600'}`} />
                                    </div>
                                    <p className="text-muted-foreground">{item.description}</p>
                                </div>
                                <p className={`font-bold ${item.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.type === 'earn' ? '+' : ''}{item.points}
                                </p>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
