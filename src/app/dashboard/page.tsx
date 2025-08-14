
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
                <div className="grid grid-cols-1 md:grid-cols-2">
                  
                  <div className="relative hidden md:flex flex-col justify-between p-8 lg:p-12 bg-secondary/50 rounded-l-lg overflow-hidden">
                      <div className="bg-dot-pattern-dark absolute inset-0 opacity-50"></div>
                      <div className="relative z-10">
                        <div className="bg-primary/20 p-3 rounded-full w-fit">
                          <UploadCloud className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold mt-6">Submit Your App</h3>
                        <p className="text-muted-foreground text-base mt-2">
                          Provide the necessary details to get your app tested by our community or professional testers.
                        </p>
                      </div>
                      <div className="relative z-10 text-xs text-muted-foreground">
                        © TestTribe - App Testing Platform
                      </div>
                  </div>

                  <div className="p-8 lg:p-12">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">New App Submission</DialogTitle>
                      <DialogDescription>
                        Fill in the details below. You can edit this information later.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-8">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">App Name</Label>
                          <input id="name" placeholder="E.g., Project Phoenix" className="flex h-10 w-full rounded-none border-b border-input bg-transparent px-1 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="url">Testing URL</Label>
                           <input id="url" placeholder="https://example.com/test-build" className="flex h-10 w-full rounded-none border-b border-input bg-transparent px-1 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50" />
                        </div>
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="icon">App Icon URL</Label>
                          <input id="icon" placeholder="https://example.com/icon.png" className="flex h-10 w-full rounded-none border-b border-input bg-transparent px-1 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instructions">Test Instructions (Optional)</Label>
                        <Textarea id="instructions" placeholder="e.g., Use user: demo@test.com, pass: 1234. Focus on the new checkout flow." className="rounded-xl mt-2" />
                      </div>
                    </div>
                    <DialogFooter>
                       <Button variant="outline" className="rounded-xl">Cancel</Button>
                      <Button type="submit" className="rounded-xl w-full sm:w-auto px-8 py-6">Submit App</Button>
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
