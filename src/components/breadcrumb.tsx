import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/schema";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={items.map((item) => ({
          name: item.label,
          url: item.href,
        }))}
      />
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        {items.map((item, index) => (
          <span key={item.href} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="w-3.5 h-3.5" />}
            {index === items.length - 1 ? (
              <span className="text-foreground font-medium">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
