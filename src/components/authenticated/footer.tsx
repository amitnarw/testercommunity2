
import Link from 'next/link';
import { AutoTransitionLink } from '@/components/auto-transition-link';

export default function Footer() {
  return (
    <footer className="bg-secondary/50 overflow-x-hidden">
      <hr />
      <div className="container mx-auto px-4 md:px-6 py-4 max-w-full">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} inTesters, Inc. All rights reserved.</p>
          <div className="flex items-center gap-3 sm:gap-4 mt-2 md:mt-0">
            <AutoTransitionLink href="/terms" className="hover:text-primary transition-colors">Terms of Service</AutoTransitionLink>
            <AutoTransitionLink href="/support" className="hover:text-primary transition-colors">Support</AutoTransitionLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
