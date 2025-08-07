import { SignupForm } from '@/components/signup-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center bg-dot-pattern p-4">
        <div className="w-full max-w-md">
            <Card className="shadow-2xl shadow-primary/10 rounded-xl">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl">Join AnimateTest</CardTitle>
                    <CardDescription>Create your account and start testing today.</CardDescription>
                </CardHeader>
                <CardContent>
                    <SignupForm />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
