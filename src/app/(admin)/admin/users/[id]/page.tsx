

'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminUserDetailsPage({ params }: { params: { id: string }}) {
    return (
        <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
            <div className="flex items-center gap-4">
                 <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/users">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back to users</span>
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">User Details</h2>
                    <p className="text-muted-foreground">Viewing details for user ID: {params.id}.</p>
                </div>
            </div>
            
            <div className="text-center py-20 bg-muted rounded-lg">
                <p>User details page content to be built here.</p>
            </div>
        </div>
    )
}
