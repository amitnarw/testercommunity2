"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ICON_CATALOG, type IconCategory } from "@/lib/lucideIconCatalog";

const CATEGORIES: IconCategory[] = [
  "General",
  "Tech",
  "Devices",
  "Charts & Stats",
  "People & Community",
  "Time & Status",
  "Money & Commerce",
  "Communication",
];

interface IconPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onSelect: (name: string) => void;
}

export function IconPickerModal({ open, onOpenChange, value, onSelect }: IconPickerModalProps) {
  const [category, setCategory] = useState<IconCategory>("General");

  const handleSelect = (name: string) => {
    onSelect(name);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle>Choose Icon</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row max-h-[420px]">
          <div className="flex sm:flex-col gap-1 p-2 overflow-x-auto sm:overflow-y-auto shrink-0 border-b sm:border-b-0 sm:border-r">
            {CATEGORIES.map((cat) => {
              const entry = ICON_CATALOG[cat][0];
              const IconComp = entry?.component;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm whitespace-nowrap transition-colors",
                    category === cat
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {IconComp && <IconComp className="h-4 w-4 shrink-0" />}
                  <span className="hidden sm:inline">{cat}</span>
                </button>
              );
            })}
          </div>
          <ScrollArea className="flex-1 p-3">
            <div className="grid grid-cols-7 gap-1">
              {ICON_CATALOG[category].map(({ name, component: IconComp }) => (
                <button
                  key={name}
                  onClick={() => handleSelect(name)}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-md transition-colors",
                    value === name
                      ? "bg-primary/15 text-primary ring-2 ring-primary"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                  title={name}
                >
                  <IconComp className="h-5 w-5" />
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
