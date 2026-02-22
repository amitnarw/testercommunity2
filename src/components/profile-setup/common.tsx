import React from "react";
import { UserProfileDataAttributes } from "@/lib/types";

export interface ProfileStepperProps {
  profileData: Partial<UserProfileDataAttributes>;
  setProfileData: React.Dispatch<
    React.SetStateAction<Partial<UserProfileDataAttributes>>
  >;
}

export const StepWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-6">{children}</div>
);
