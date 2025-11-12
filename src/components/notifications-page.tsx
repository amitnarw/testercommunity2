'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Notification } from '@/lib/types';
import { Bell, Bug, CheckCircle, Gift, MessageSquare, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { AppPagination } from '@/components/app-pagination';

const NOTIFICATIONS_PER_PAGE = 8;

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
    switch (type) {
        case 'new_test':
            return <Gift className="w-14 h-14 sm:w-5 sm:h-5 bg-primary/10 sm:bg-transparent rounded-full sm:rounded-none p-3 sm:p-0 text-primary/20 sm:text-primary" />;
        case 'feedback_received':
            return <MessageSquare className="w-14 h-14 sm:w-5 sm:h-5 bg-blue-500/10 sm:bg-transparent rounded-full sm:rounded-none p-3 sm:p-0 text-blue-500/20 sm:text-blue-500" />;
        case 'test_completed':
            return <CheckCircle className="w-14 h-14 sm:w-5 sm:h-5 bg-green-500/10 sm:bg-transparent rounded-full sm:rounded-none p-3 sm:p-0 text-green-500/20 sm:text-green-500" />;
        case 'bug_report':
            return <Bug className="w-14 h-14 sm:w-5 sm:h-5 bg-red-500/10 sm:bg-transparent rounded-full sm:rounded-none p-3 sm:p-0 text-red-500/20 sm:text-red-500" />;
        case 'points_awarded':
            return <Star className="w-14 h-14 sm:w-5 sm:h-5 bg-amber-500/10 sm:bg-transparent rounded-full sm:rounded-none p-3 sm:p-0 text-amber-500/20 sm:text-amber-500" />;
        default:
            return <Bell className="w-14 h-14 sm:w-5 sm:h-5 bg-muted-foreground/10 sm:bg-transparent rounded-full sm:rounded-none p-3 sm:p-0 text-muted-foreground/20 sm:text-muted-foreground" />;
    }
}

interface NotificationsPageProps {
    title: string;
    description: string;
    notifications: Notification[];
}

export function NotificationsPageContent({ title, description, notifications }: NotificationsPageProps) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(notifications.length / NOTIFICATIONS_PER_PAGE);
    const startIndex = (currentPage - 1) * NOTIFICATIONS_PER_PAGE;
    const endIndex = startIndex + NOTIFICATIONS_PER_PAGE;
    const currentNotifications = notifications.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className="container mx-auto px-4 md:px-6">
            <header className="mb-8">
                <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">{title}</h1>
                <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
            </header>

            <main className="mx-auto">
                <Card className="rounded-xl bg-transparent shadow-none">
                    <CardContent className="p-0">
                        <div className="flex flex-col gap-2">
                            {currentNotifications.length > 0 ? (
                                currentNotifications.map(notification => (
                                    <Link href="#" key={notification.id} className={`block ${notification?.type === "new_test" ? "bg-gradient-to-br from-primary/10 to-primary/0" : notification?.type === "feedback_received" ? "bg-gradient-to-br from-blue-500/10 to-blue-500/0" : notification?.type === "test_completed" ? "bg-gradient-to-br from-green-500/10 to-green-500/0" : notification?.type === "bug_report" ? "bg-gradient-to-br from-red-500/10 to-red-500/0" : notification?.type === "points_awarded" ? "bg-gradient-to-br from-amber-500/10 to-amber-500/0" : "bg-gradient-to-br from-muted-foreground/10 to-muted-foreground/0"} hover:bg-secondary/80 rounded-xl duration-300`}>
                                        <div className="flex items-start gap-4 p-4 relative sm:static overflow-hidden">
                                            <div className={`sm:bg-secondary p-3 rounded-full mt-1 absolute sm:static -right-5 -bottom-5 ${notification.type !== "test_completed" && "-rotate-45"} sm:right-0 sm:bottom-0 sm:rotate-0 z-10`}>
                                                <NotificationIcon type={notification.type} />
                                            </div>
                                            <div className="flex-grow z-20">
                                                <p className={cn("font-semibold", !notification.read && "text-foreground")}>{notification.title}</p>
                                                <p className="text-xs sm:text-sm text-muted-foreground">{notification.description}</p>
                                                <p className="text-[10px] sm:text-xs text-muted-foreground/60 mt-1">{new Date(notification.date).toLocaleString("en-IN", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "numeric",
                                                    minute: "numeric",
                                                    hour12: true
                                                })}</p>
                                            </div>
                                            {!notification.read && (
                                                <div className="w-2.5 h-2.5 bg-primary rounded-full mt-2 flex-shrink-0">
                                                    <span className="sr-only">Unread</span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="p-8 text-center text-muted-foreground">You have no notifications yet.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <AppPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </main>
        </div>
    );
}
