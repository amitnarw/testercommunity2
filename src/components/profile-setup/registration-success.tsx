"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export const RegistrationSuccess = ({
  dashboardHref = ROUTES.AUTHENTICATED.HANDSHAKE_TESTING,
}: {
  dashboardHref?: string;
}) => {
  return (
    <div className="text-center py-8 sm:py-12 flex flex-col items-center justify-center h-full px-4">
      <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-6" />

      <h2 className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 mb-2">
        Profile Saved!
      </h2>
      <p className="mt-2 text-muted-foreground max-w-sm sm:max-w-md mx-auto text-base sm:text-lg leading-relaxed">
        Your profile details have been saved successfully.
      </p>

      <Button
        asChild
        className="mt-8 w-full sm:w-auto px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <Link href={dashboardHref}>
          Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
    </div>
  );
};
