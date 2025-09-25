
'use client';

import { SiteLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { BackgroundBeams } from '@/components/background-beams';
import { Input } from '@/components/ui/input';

const AdminLoginForm = () => {
    const router = useRouter();

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would verify credentials here
        localStorage.setItem('isAdminAuthenticated', 'true');
        router.push('/admin/dashboard');
    }

    return (
        <form onSubmit={handleAdminLogin} className="space-y-6">
             <div className="space-y-2">
                <label htmlFor="email">Admin Email</label>
                <Input id="email" type="email" placeholder="admin@example.com" defaultValue="admin@inTesters.com" className="flex h-10 w-full rounded-md border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
            </div>
            <div className="space-y-2">
                <label htmlFor="password">Password</label>
                <Input id="password" type="password" placeholder="••••••••" defaultValue="password" className="flex h-10 w-full rounded-md border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
            </div>
            <div className="space-y-2">
                <Button type="submit" className="w-full rounded-xl py-6 text-lg">Log In</Button>
            </div>
        </form>
    )
}


export default function AdminLoginPage() {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
        <div className="relative w-full h-screen flex flex-col items-center justify-center p-6 bg-background">
            <div className="max-w-md w-full space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        Admin Control Panel
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        Please log in to continue.
                    </p>
                </div>
                <AdminLoginForm />
            </div>
        </div>
        <div className="hidden lg:flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-background">
            <BackgroundBeams />
            <div className="relative z-10 flex flex-col items-center">
                <SiteLogo className="h-20 w-auto mb-4" />
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome Administrator</h1>
                <p className="mt-2 max-w-md mx-auto text-muted-foreground">
                    Manage users, review submissions, and oversee the platform.
                </p>
            </div>
        </div>
    </div>
  );
}
