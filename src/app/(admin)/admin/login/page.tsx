
'use client';

import { SiteLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Meteors from "@/components/ui/meteors";
import { Input } from '@/components/ui/input';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { BackButton } from '@/components/back-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LoginForm = ({ role }: { role: 'Super Admin' | 'Admin' | 'Moderator' }) => {
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would verify credentials and set role-based permissions
        document.cookie = `isAdminAuthenticated=true; path=/; max-age=${60 * 60 * 24 * 7}`;
        document.cookie = `userRole=${role}; path=/; max-age=${60 * 60 * 24 * 7}`;
        router.push('/admin/dashboard');
    }

    return (
        <form onSubmit={handleLogin} className="space-y-6">
             <div className="space-y-2">
                <label htmlFor={`${role}-email`}>{role} Email</label>
                <Input id={`${role}-email`} type="email" placeholder={`${role.toLowerCase().replace(' ', '')}@example.com`} defaultValue={`${role.toLowerCase().replace(' ', '')}@inTesters.com`} className="flex h-10 w-full rounded-md border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
            </div>
            <div className="space-y-2">
                <label htmlFor={`${role}-password`}>Password</label>
                <Input id={`${role}-password`} type="password" placeholder="••••••••" defaultValue="password" className="flex h-10 w-full rounded-md border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
            </div>
            <div className="space-y-2">
                <Button type="submit" className="w-full rounded-xl py-6 text-lg">Log In as {role}</Button>
            </div>
        </form>
    )
}


export default function AdminLoginPage() {
    const { setTheme, theme } = useTheme();
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
        <div className="relative w-full h-screen flex flex-col items-center justify-center p-6 bg-background">
            <div className="absolute top-4 right-4 flex items-center gap-4">
                <BackButton href="/" />
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                    <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>
            <div className="max-w-md w-full space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        Admin Control Panel
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        Please log in to continue.
                    </p>
                </div>
                 <Tabs defaultValue="admin" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="super-admin">Super Admin</TabsTrigger>
                        <TabsTrigger value="admin">Admin</TabsTrigger>
                        <TabsTrigger value="moderator">Moderator</TabsTrigger>
                    </TabsList>
                    <TabsContent value="super-admin" className="mt-6">
                        <LoginForm role="Super Admin" />
                    </TabsContent>
                    <TabsContent value="admin" className="mt-6">
                        <LoginForm role="Admin" />
                    </TabsContent>
                    <TabsContent value="moderator" className="mt-6">
                        <LoginForm role="Moderator" />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
        <div className="hidden lg:flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-background">
            <Meteors />
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
