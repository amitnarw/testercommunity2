"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Search,
  MessageSquare,
  Sparkles,
  AtSign,
  MessageCircle,
  Users,
  Newspaper,
  Linkedin,
  Facebook,
  MoreHorizontal,
  CheckCircle2,
  Hand,
} from "lucide-react";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDiscoverySourceSave } from "@/hooks/useUser";
import { cn } from "@/lib/utils";

type Option = {
  id: string;
  label: string;
  icon: typeof Play;
  iconBg: string;
  iconColor: string;
};

const options: Option[] = [
  { id: "youtube", label: "YouTube", icon: Play, iconBg: "bg-red-50 dark:bg-red-500/10", iconColor: "text-red-500" },
  { id: "google_search", label: "Google Search", icon: Search, iconBg: "bg-blue-50 dark:bg-blue-500/10", iconColor: "text-blue-500" },
  { id: "chatgpt", label: "ChatGPT", icon: MessageSquare, iconBg: "bg-emerald-50 dark:bg-emerald-500/10", iconColor: "text-emerald-500" },
  { id: "gemini", label: "Gemini", icon: Sparkles, iconBg: "bg-violet-50 dark:bg-violet-500/10", iconColor: "text-violet-500" },
  { id: "twitter_x", label: "Twitter / X", icon: AtSign, iconBg: "bg-sky-50 dark:bg-sky-500/10", iconColor: "text-sky-500" },
  { id: "reddit", label: "Reddit", icon: MessageCircle, iconBg: "bg-orange-50 dark:bg-orange-500/10", iconColor: "text-orange-500" },
  { id: "friend_colleague", label: "Friend or Colleague", icon: Users, iconBg: "bg-indigo-50 dark:bg-indigo-500/10", iconColor: "text-indigo-500" },
  { id: "blog_article", label: "Blog or Article", icon: Newspaper, iconBg: "bg-amber-50 dark:bg-amber-500/10", iconColor: "text-amber-600" },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, iconBg: "bg-blue-50 dark:bg-blue-500/10", iconColor: "text-blue-700" },
  { id: "facebook_instagram", label: "Facebook / Instagram", icon: Facebook, iconBg: "bg-pink-50 dark:bg-pink-500/10", iconColor: "text-pink-500" },
  { id: "other", label: "Other", icon: MoreHorizontal, iconBg: "bg-muted", iconColor: "text-muted-foreground" },
];

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      delay: 0.15 + i * 0.04,
    },
  }),
};

interface DiscoverySourceModalProps {
  open: boolean;
  onComplete: () => void;
}

export function DiscoverySourceModal({ open, onComplete }: DiscoverySourceModalProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const saveMutation = useDiscoverySourceSave();

  const handleSelect = (id: string) => {
    setSelected(id);
    if (id !== "other") {
      setOtherText("");
    }
  };

  const handleSubmit = async () => {
    const value = selected === "other" ? otherText.trim() : selected;
    if (!value) return;

    try {
      await saveMutation.mutateAsync(value);
      setShowSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 1500);
    } catch {
      // error handled by mutation
    }
  };

  const isValid = selected && (selected !== "other" || otherText.trim().length > 0);
  const isSubmitting = saveMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-[520px] w-[calc(100vw-40px)] h-auto max-h-[95%] p-0 border-none shadow-2xl overflow-y-auto bg-background [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">How did you discover us?</DialogTitle>
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative rounded-[2rem] overflow-hidden w-full"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-emerald-500/[0.02] to-transparent opacity-60" />

              <div className="relative p-10 flex flex-col items-center text-center">
                {/* Pulsing ring */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-20 h-20 rounded-full bg-emerald-500/10 ring-4 ring-emerald-500/20"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 250, damping: 15, delay: 0.1 }}
                  className="relative w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center ring-4 ring-emerald-500/20 mb-6"
                >
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 mb-2"
                >
                  Thanks for Helping Us Grow!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-muted-foreground text-sm"
                >
                  We appreciate your feedback.
                </motion.p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="main"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative rounded-[2rem] overflow-hidden w-full"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-primary/[0.01] to-transparent opacity-60" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl opacity-40" />
              </div>

              <div className="relative p-4 sm:p-6">
                <div className="flex items-center gap-4 mb-5">
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 250, damping: 15, delay: 0.05 }}
                    className="relative shrink-0"
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 rounded-xl bg-primary/10 ring-2 ring-primary/20"
                    />
                    <div className="relative w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                      <motion.div
                        animate={{ rotate: [-20, 20, -20] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                        style={{ originY: 0.8 }}
                      >
                        <Hand className="w-6 h-6 text-primary" />
                      </motion.div>
                    </div>
                  </motion.div>
                  <div className="flex flex-col">
                    <motion.h2
                      custom={0}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className="text-xl sm:text-2xl font-bold tracking-tight"
                    >
                      How did you discover us?
                    </motion.h2>
                    <motion.p
                      custom={1}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className="text-muted-foreground text-xs sm:text-sm"
                    >
                      This helps us serve developers like you better.
                    </motion.p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {options.map((option, i) => {
                    const Icon = option.icon;
                    const isSelected = selected === option.id;
                    return (
                      <motion.button
                        key={option.id}
                        custom={i + 2}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        onClick={() => handleSelect(option.id)}
                        className={cn(
                          "relative flex flex-col items-center justify-center md:flex-row md:items-center md:justify-start md:gap-2 p-2.5 rounded-xl border transition-all duration-200 text-center md:text-left overflow-hidden",
                          isSelected
                            ? "border-primary/50 bg-primary/[0.04] shadow-sm ring-1 ring-primary/20"
                            : "border-border/60 bg-muted/30 hover:bg-muted/50 hover:border-border hover:shadow-sm",
                        )}
                      >
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 400, damping: 15 }}
                              className="absolute top-2 right-2 z-20"
                            >
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Desktop inline icon */}
                        <div className={cn(
                          "hidden md:flex w-9 h-9 rounded-lg items-center justify-center shrink-0 transition-colors",
                          option.iconBg,
                          isSelected && "ring-1 ring-primary/20",
                        )}>
                          <Icon className={cn("w-[18px] h-[18px]", option.iconColor)} />
                        </div>

                        {/* Mobile background watermark icon */}
                        <div className="md:hidden absolute bottom-1.5 right-1.5 pointer-events-none">
                          <Icon className={cn(
                            "w-14 h-14 opacity-[0.06]",
                            option.iconColor,
                          )} />
                        </div>

                        <span className={cn(
                          "relative z-10 text-sm font-medium leading-tight transition-colors",
                          isSelected ? "text-foreground" : "text-muted-foreground",
                        )}>
                          {option.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {selected === "other" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="overflow-hidden mb-4"
                    >
                      <input
                        type="text"
                        placeholder="Tell us where you found us..."
                        value={otherText}
                        onChange={(e) => setOtherText(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-muted/30 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                        autoFocus
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  custom={options.length + 2}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <LoadingButton
                    disabled={!isValid}
                    isLoading={isSubmitting}
                    isSuccess={saveMutation.isSuccess}
                    showSuccessState={true}
                    onClick={handleSubmit}
                    className="w-full py-3 rounded-xl"
                  >
                    Submit
                  </LoadingButton>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
