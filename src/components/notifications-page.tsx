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
            return <Gift className="w-5 h-5 text-primary" />;
        case 'feedback_received':
            return <MessageSquare className="w-5 h-5 text-blue-500" />;
        case 'test_completed':
            return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'bug_report':
            return <Bug className="w-5 h-5 text-red-500" />;
        case 'points_awarded':
            return <Star className="w-5 h-5 text-amber-500" />;
        default:
            return <Bell className="w-5 h-5 text-muted-foreground" />;
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
              <p className="text-muted-foreground">{description}</p>
            </header>

            <main className="mx-auto">
                <Card className="rounded-xl">
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {currentNotifications.length > 0 ? (
                                currentNotifications.map(notification => (
                                     <Link href="#" key={notification.id} className="block hover:bg-secondary/50">
                                        <div className="flex items-start gap-4 p-4">
                                            <div className="bg-secondary p-3 rounded-full mt-1">
                                                <NotificationIcon type={notification.type} />
                                            </div>
                                            <div className="flex-grow">
                                                <p className={cn("font-semibold", !notification.read && "text-foreground")}>{notification.title}</p>
                                                <p className="text-sm text-muted-foreground">{notification.description}</p>
                                                <p className="text-xs text-muted-foreground/80 mt-1">{new Date(notification.date).toLocaleString()}</p>
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
