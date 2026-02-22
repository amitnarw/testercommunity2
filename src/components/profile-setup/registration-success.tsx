"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Confetti from "react-dom-confetti";

export const RegistrationSuccess = ({
  status,
}: {
  status: "EARNED_NOW" | "ALREADY_EARNED" | "INCOMPLETE";
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (status === "EARNED_NOW") {
      setShowConfetti(true);
    }
  }, [status]);

  const confettiConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  };

  let title = "Profile Setup Saved!";
  let message =
    "Your profile has been saved. Complete all fields to earn 200 bonus points!";
  let icon = (
    <CheckCircle className="mx-auto h-20 w-20 text-muted-foreground/50 mb-6" />
  );

  if (status === "EARNED_NOW") {
    title = "Profile Setup Complete!";
    message =
      "Congratulations! You've earned 200 bonus points for completing your profile. You're all set to explore the dashboard.";
    icon = (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.1,
        }}
      >
        <div className="relative">
          <CheckCircle className="mx-auto h-24 w-24 text-green-500 mb-6 drop-shadow-2xl" />
          <motion.div
            className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    );
  } else if (status === "ALREADY_EARNED") {
    title = "Profile Updated!";
    message = "Your profile has been successfully updated.";
    icon = <CheckCircle className="mx-auto h-20 w-20 text-blue-500 mb-6" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8 sm:py-12 flex flex-col items-center justify-center h-full relative overflow-hidden px-4"
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <Confetti active={showConfetti} config={confettiConfig} />
      </div>

      {icon}

      <h2 className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 mb-2">
        {title}
      </h2>
      <p className="mt-2 text-muted-foreground max-w-sm sm:max-w-md mx-auto text-base sm:text-lg leading-relaxed">
        {message}
      </p>

      {status === "EARNED_NOW" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-primary/10 rounded-xl border border-primary/20 w-full sm:w-auto"
        >
          <p className="font-bold text-primary flex items-center justify-center gap-2 text-sm sm:text-base">
            <span className="text-xl sm:text-2xl">🎉</span> +200 Points Added to
            Wallet
          </p>
        </motion.div>
      )}

      <Button
        asChild
        className="mt-8 w-full sm:w-auto px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <Link href="/dashboard">
          Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
    </motion.div>
  );
};
