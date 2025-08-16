
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { PlusCircle, Gem } from 'lucide-react'
import { ProjectList } from '@/components/project-list';
import Link from 'next/link';
import { Package, FlaskConical, CheckCircle2, Coins } from 'lucide-react'


export default function DashboardPage() {
  return (
    <>
      <div className="min-h-screen bg-secondary/50">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold">Developer Dashboard</h1>
              <p className="text-muted-foreground">Manage your apps and testing projects.</p>
            </div>
            <div className='flex items-center gap-2'>
              <Button asChild>
                <Link href="/dashboard/add-app">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New App
                </Link>
              </Button>
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
    </>
  )
}
