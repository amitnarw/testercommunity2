import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { ListFilter, Search } from 'lucide-react';
import TesterCard from '@/components/tester-card';
import { testers } from '@/lib/data';

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <section>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold">Tester Marketplace</h1>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              Find the perfect tester for your project. Filter by skills, reputation, and more.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search testers by name or skill..." className="pl-10 rounded-xl" />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 rounded-xl">
                    <ListFilter className="h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuLabel>Filter by Skill</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>UI/UX Testing</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Performance</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Security</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Game Testing</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button className="rounded-xl">Search</Button>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {testers.map((tester, i) => (
              <div key={tester.id}>
                <TesterCard tester={tester} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
