import Link from 'next/link';

export function AdminFooter() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} inTesters, Inc. Admin Panel</p>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
            <Link href="/help" className="hover:text-primary transition-colors">Internal Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
