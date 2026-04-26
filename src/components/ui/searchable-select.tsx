"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

interface SearchableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
  triggerClassName?: string;
}

const SearchableSelect = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Root>,
  SearchableSelectProps
>(({ value, onValueChange, placeholder, children, className, triggerClassName }, ref) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Find the selected item to display its text
  const getSelectedDisplay = () => {
    if (!value) return placeholder || "Select...";

    let display = value;
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.props.value === value) {
        const childEl = child as React.ReactElement<any>;
        display = childEl.props["data-name"] || childEl.props["data-email"] || value;
      }
    });
    return display;
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
            triggerClassName
          )}
        >
          <span className={cn("truncate", value ? "text-foreground" : "text-muted-foreground")}>
            {getSelectedDisplay()}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          className={cn(
            "relative z-[70] w-[var(--radix-select-trigger-width)] min-w-[8rem] rounded-md border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            className
          )}
          align="start"
          sideOffset={4}
          style={{ maxHeight: "320px" }}
        >
          <div className="sticky top-0 z-10 border-b bg-background p-2">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setOpen(false);
                }
              }}
            />
          </div>
          <div className="overflow-y-auto max-h-[240px] p-1">
            {React.Children.map(children, (child) => {
              if (!React.isValidElement(child)) return null;
              const childProps = child.props as { value?: string; "data-name"?: string; "data-email"?: string };
              if (!childProps.value) return null;

              // Check if this item matches the search
              if (search) {
                const searchableText = [
                  childProps.value,
                  childProps["data-name"],
                  childProps["data-email"],
                ].filter(Boolean).join(" ").toLowerCase();

                if (!searchableText.includes(search.toLowerCase())) {
                  return null;
                }
              }

              // Clone with onClick handler
              return React.cloneElement(child as React.ReactElement<any>, {
                onClick: () => {
                  onValueChange(childProps.value);
                  setSearch("");
                  setOpen(false);
                },
              });
            })}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
});
SearchableSelect.displayName = "SearchableSelect";

export { SearchableSelect };
export type { SearchableSelectProps };
