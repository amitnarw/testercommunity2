"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { UserProfileData } from "@/lib/types";
import { StepperWithResponsiveVariant } from "@/components/stepper-with-responsive-variant";

const RegistrationSuccess = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-12"
  >
    <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
    <h2 className="text-2xl font-bold">Profile Setup Complete!</h2>
    <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
      Thank you for setting up your profile. You're all set to explore the
      dashboard.
    </p>
    <Button asChild className="mt-8">
      <Link href="/dashboard">Go to Dashboard</Link>
    </Button>
  </motion.div>
);

function ProfileSetupPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [profileData, setProfileData] = useState<Partial<UserProfileData>>({
    profileType: undefined,
    jobRole: undefined,
    experienceLevel: undefined,
    companyName: "",
    companyWebsite: "",
    companySize: undefined,
    positionInCompany: undefined,
    totalPublishedApps: undefined,
    platformDevelopment: undefined,
    publishFrequency: undefined,
    serviceUsage: [],
    communicationMethods: [],
    notificationPreference: [],
    country: "",
    phone: "",
  });

  const handleSubmit = () => {
    console.log("Final profile data:", profileData);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full bg-secondary/30 p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        {isSubmitted ? (
          <RegistrationSuccess />
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">User Survey</h2>
              <p className="text-primary font-semibold mt-2">
                Complete your profile to receive a{" "}
                <span className="font-bold">200 point bonus</span> to get you
                started!
              </p>
            </div>

            <div className="mt-8 relative">
              <StepperWithResponsiveVariant
                profileData={profileData}
                setProfileData={setProfileData}
                onSubmit={handleSubmit}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileSetupPage;
