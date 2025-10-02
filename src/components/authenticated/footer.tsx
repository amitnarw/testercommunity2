
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-secondary/50 pt-10">
      <hr />
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} inTesters, Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/help" className="hover:text-primary transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
