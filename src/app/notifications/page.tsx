

'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { notifications as allNotifications } from '@/lib/data';
import type { Notification } from '@/lib/types';
import { Bell, Bug, CheckCircle, ChevronLeft, ChevronRight, Gift, MessageSquare, Star } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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

export default function NotificationsPage() {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(allNotifications.length / NOTIFICATIONS_PER_PAGE);
    const startIndex = (currentPage - 1) * NOTIFICATIONS_PER_PAGE;
    const endIndex = startIndex + NOTIFICATIONS_PER_PAGE;
    const currentNotifications = allNotifications.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const getPaginationRange = () => {
        const range: (number | string)[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                range.push(i);
            }
        } else {
            if (currentPage > 2) {
                range.push(1);
                if (currentPage > 3) range.push('...');
            }
            
            let start = Math.max(1, currentPage - 1);
            let end = Math.min(totalPages, currentPage + 1);
    
            if(currentPage === 1) end = 3;
            if(currentPage === totalPages) start = totalPages - 2;
    
            for (let i = start; i <= end; i++) {
                range.push(i);
            }
    
            if (currentPage < totalPages - 1) {
                if (currentPage < totalPages - 2) range.push('...');
                range.push(totalPages);
            }
        }
        return range.slice(0, 3);
      };

    return (
        <div className="container mx-auto px-4 md:px-6 py-12">
            <header className="mb-8">
              <h1 className="text-4xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">Here's a list of your recent activities.</p>
            </header>

            <main className="max-w-4xl mx-auto">
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

                {totalPages > 1 && (
                    <div className="mt-8">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                </PaginationItem>
                                {getPaginationRange().map((page, index) => (
                                    <PaginationItem key={index}>
                                        {typeof page === 'number' ? (
                                            <PaginationLink href="#" isActive={currentPage === page} onClick={(e) => { e.preventDefault(); handlePageChange(page); }}>
                                                {page}
                                            </PaginationLink>
                                        ) : (
                                            <span className="px-4 py-2">...</span>
                                        )}
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </main>
        </div>
    );
}
