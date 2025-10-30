
'use client';

import { notFound, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, Tag, Lightbulb } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const suggestionItems = [
    { id: 1, user: "Tony Stark", role: "Developer", suggestion: "Add a 'duplicate project' button to easily re-run tests.", date: "2024-08-20", status: "Received" },
    { id: 2, user: "Harley Quinn", role: "Tester", suggestion: "Gamify the bug reporting process with points for quality.", date: "2024-08-19", status: "Planned" },
    { id: 3, user: "Bruce Wayne", role: "Developer", suggestion: "Integrate with GitHub Actions to trigger tests on PR.", date: "2024-08-18", status: "In Development" },
    { id: 4, user: "Diana Prince", role: "Tester", suggestion: "Show tester leaderboards for the month.", date: "2024-08-17", status: "Shipped" },
    { id: 5, user: "Peter Parker", role: "Tester", suggestion: "Add a way to directly message developers from a bug report.", date: "2024-08-16", status: "Received" },
];


export default function SuggestionDetailsPage() {
    const params = useParams();
    const { id } = params;
    const item = suggestionItems.find(i => i.id.toString() === id);

    if (!item) {
        notFound();
    }

    return (
        <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/suggestions">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Suggestion Details</h2>
                    <p className="text-muted-foreground">Viewing suggestion ID: {item.id}</p>
                </div>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Suggestion from {item.user}</CardTitle>
                    <CardDescription>Submitted on {item.date}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                             <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2"><Lightbulb className="w-5 h-5 text-muted-foreground" /> Suggestion Content</h3>
                                <p className="bg-secondary/50 p-4 rounded-lg text-muted-foreground">{item.suggestion}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                             <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2"><User className="w-5 h-5 text-muted-foreground" /> Submitted By</h3>
                                <p className="font-medium">{item.user}</p>
                                <Badge variant={item.role === "Developer" ? "default" : "secondary"}>{item.role}</Badge>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2"><Calendar className="w-5 h-5 text-muted-foreground" /> Submitted On</h3>
                                <p>{new Date(item.date).toLocaleDateString()}</p>
                            </div>
                            <Separator />
                             <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2"><Tag className="w-5 h-5 text-muted-foreground" /> Status</h3>
                                <Badge
                                    variant={item.status === 'Shipped' ? 'secondary' : 'outline'}
                                    className={item.status === 'Shipped' ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400' : ''}
                                >
                                    {item.status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
