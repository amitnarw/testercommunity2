
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Package, FlaskConical, CheckCircle2, Coins, PlusCircle, Gem, UploadCloud } from 'lucide-react'
import { ProjectList } from '@/components/project-list';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-secondary/50">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage your apps and testing projects.</p>
          </div>
          <div className='flex items-center gap-2'>
            <Dialog>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New App</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl p-0">
                  <div className="p-8 lg:p-12">
                    <DialogHeader className='mb-8 text-center'>
                      <DialogTitle className="text-4xl font-bold">Submit a New App</DialogTitle>
                      <DialogDescription className="max-w-lg mx-auto">
                        Fill in the details below to get your app ready for testing. You can edit this information later.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-8 max-w-xl mx-auto">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">App Name</Label>
                                <Input id="name" placeholder="E.g., Project Phoenix" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="url" className="text-sm font-medium">Testing URL</Label>
                                <Input id="url" placeholder="https://example.com/test-build" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="icon" className="text-sm font-medium">App Icon URL</Label>
                                <Input id="icon" placeholder="https://example.com/icon.png" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="instructions" className="text-sm font-medium">Test Credentials & Instructions (Optional)</Label>
                                <Textarea id="instructions" placeholder="e.g., Use user: demo@test.com, pass: 1234. Focus on the new checkout flow." className="rounded-xl mt-2 min-h-[120px]" />
                            </div>
                        </div>
                        <DialogFooter className="mt-4 pt-4 sm:justify-center">
                            <Button variant="outline" className="rounded-xl px-6 py-3">Cancel</Button>
                            <Button type="submit" className="rounded-xl px-8 py-6 text-base">Submit App</Button>
                        </DialogFooter>
                    </div>
                  </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" asChild>
                <Link href="/pricing">
                    <Gem className="mr-2 h-4 w-4" /> Add More Points
                </Link>
            </Button>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card className="rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Apps
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                Across all your projects
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                In Testing
              </CardTitle>
              <FlaskConical className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                Currently being tested by the community
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Finished testing cycles
              </p>
            </CardContent>
          </Card>
           <Card className="rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Available Points
              </CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,250</div>
              <p className="text-xs text-muted-foreground">
                Your current point balance
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
            <ProjectList />
        </div>
      </div>
    </div>
  )
}
