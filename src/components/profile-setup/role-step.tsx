"use client";

import React from "react";
import { UserProfileType, UserJobRole, UserExperienceLevel } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileStepperProps, StepWrapper } from "./common";

export const RoleStep = ({
  profileData,
  setProfileData,
}: ProfileStepperProps) => (
  <StepWrapper>
    <div className="space-y-2">
      <Label>Your professional type</Label>
      <RadioGroup
        onValueChange={(value) =>
          setProfileData((prev) => ({
            ...prev,
            profile_type: value as UserProfileType,
          }))
        }
        value={profileData?.profile_type}
        className="grid grid-cols-2 gap-4"
      >
        {Object.values(UserProfileType).map((type) => (
          <div key={type}>
            <RadioGroupItem value={type} id={type} className="peer sr-only" />
            <Label
              htmlFor={type}
              className="flex h-full flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-center"
            >
              {type.replace("_", " ")?.toLowerCase()}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
    <div className="flex flex-col gap-2">
      <Label>Your job role</Label>
      <Select
        onValueChange={(value) =>
          setProfileData((prev) => ({
            ...prev,
            job_role: value as UserJobRole,
          }))
        }
        value={profileData?.job_role}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select your primary role" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(UserJobRole).map((role) => (
            <SelectItem key={role} value={role}>
              {role.replace(/_/g, " ")?.toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="flex flex-col gap-2">
      <Label>Your experience level</Label>
      <Select
        onValueChange={(value) =>
          setProfileData((prev) => ({
            ...prev,
            experience_level: value as UserExperienceLevel,
          }))
        }
        value={profileData?.experience_level}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select your experience level" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(UserExperienceLevel).map((level) => (
            <SelectItem key={level} value={level}>
              {level.replace(/_/g, " ")?.toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </StepWrapper>
);
