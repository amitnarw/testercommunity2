"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface HandshakeCelebrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partnerAppName?: string;
  partnerName?: string;
  onContinue?: () => void;
}

export function HandshakeCelebrationModal({
  open,
  onOpenChange,
  partnerAppName,
  partnerName,
  onContinue,
}: HandshakeCelebrationModalProps) {
  useEffect(() => {
    if (!open) return;
    if (typeof window === "undefined") return;
    // Lightweight confetti effect without external deps
    const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6"];
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      document.body.removeChild(canvas);
      return;
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      life: number;
    };
    const particles: Particle[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 4,
        size: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
      });
    }
    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life -= 0.012;
        if (p.life > 0) {
          alive++;
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
      }
      if (alive > 0) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    const cleanup = () => {
      cancelAnimationFrame(raf);
      if (canvas.parentNode) document.body.removeChild(canvas);
    };
    const t = window.setTimeout(cleanup, 3000);
    return () => {
      window.clearTimeout(t);
      cleanup();
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] overflow-hidden border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-background to-blue-500/10">
        <DialogHeader className="sr-only">
          <DialogTitle>Handshake Completed</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ scale: 0.4, rotate: -45, opacity: 0 }}
                animate={{
                  scale: [0.4, 1.2, 1],
                  rotate: [-45, 15, 0],
                  opacity: 1,
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative mb-4"
              >
                <div className="absolute inset-0 rounded-full bg-emerald-500/30 blur-2xl animate-pulse" />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <Handshake className="w-12 h-12 text-white" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-600"
          >
            🤝 Handshake Completed!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-muted-foreground mt-2 max-w-xs"
          >
            Your request was matched mutually. You and{" "}
            {partnerName ? <strong>{partnerName}</strong> : "your partner"} will
            now test each other&apos;s apps.
          </motion.p>

          {partnerAppName && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xs text-muted-foreground mt-1"
            >
              ({partnerAppName})
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-6"
          >
            <Button
              onClick={() => {
                onOpenChange(false);
                onContinue?.();
              }}
              className="px-8 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
            >
              Continue
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
