"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { FileText, ChevronDown } from "lucide-react";
import { DeclarationReport } from "./declaration-report";

interface Props {
  appId: string | number;
  isOpen: boolean;
  onToggle: () => void;
}

function HeaderContent({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="flex items-center gap-4 flex-1">
      <div className="relative w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <FileText className="w-5 h-5 text-primary relative z-10" />
      </div>
      <div className="text-left flex-1 min-w-0">
        <span className="font-bold text-base sm:text-lg text-foreground tracking-tight">
          Declaration Report
        </span>
        <p className="text-xs text-muted-foreground/80 mt-0.5 leading-relaxed">
          Summary, declaration answers, and PDF download
        </p>
      </div>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="shrink-0 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center"
      >
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </motion.div>
    </div>
  );
}

function ExpandContent({ children, isOpen }: { children: ReactNode; isOpen: boolean }) {
  return (
    <div
      className="overflow-hidden"
      style={{
        maxHeight: isOpen ? "9999px" : "0px",
        opacity: isOpen ? 1 : 0,
        transition: "max-height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="pt-2 pb-4 px-1">{children}</div>
    </div>
  );
}

export function DeclarationReportAccordion({ appId, isOpen, onToggle }: Props) {
  return (
    <div className="relative w-full rounded-[1.75rem] overflow-hidden group">
      {/* Glass background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
      <div className="absolute inset-0 backdrop-blur-xl" />
      <div className="absolute inset-[1px] rounded-[1.75rem] border border-white/10 bg-transparent" />

      {/* Content */}
      <div className="relative z-20">
        <div className="px-6 py-5 cursor-pointer" onClick={onToggle}>
          <HeaderContent isOpen={isOpen} />
        </div>
        <ExpandContent isOpen={isOpen}>
          <div className="px-5" onClick={(e) => e.stopPropagation()}>
            <DeclarationReport appId={appId} />
          </div>
        </ExpandContent>
      </div>
    </div>
  );
}
