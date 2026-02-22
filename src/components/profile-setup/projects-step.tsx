"use client";

import React from "react";
import {
  UserTotalPublishedApps,
  UserDevelopmentPlatform,
  UserPublishFrequency,
} from "@/lib/types";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileStepperProps, StepWrapper } from "./common";

export const ProjectsStep = ({
  profileData,
  setProfileData,
}: ProfileStepperProps) => (
  <StepWrapper>
    <div className="flex flex-col gap-2">
      <Label>Total Published Apps</Label>
      <Select
        onValueChange={(value) =>
          setProfileData((prev) => ({
            ...prev,
            total_published_apps: value as UserTotalPublishedApps,
          }))
        }
        defaultValue={profileData?.total_published_apps}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select number of apps" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(UserTotalPublishedApps).map((val) => (
            <SelectItem key={val} value={val}>
              {val.replace("PUB_", "").replace(/_/g, "-")?.toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="flex flex-col gap-2">
      <Label>Primary Development Platform</Label>
      <Select
        onValueChange={(value) =>
          setProfileData((prev) => ({
            ...prev,
            platform_development: value as UserDevelopmentPlatform,
          }))
        }
        defaultValue={profileData?.platform_development}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select platform" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(UserDevelopmentPlatform).map((val) => (
            <SelectItem key={val} value={val}>
              {val.replace(/_/g, " ")?.toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="flex flex-col gap-2">
      <Label>App Publish Frequency</Label>
      <Select
        onValueChange={(value) =>
          setProfileData((prev) => ({
            ...prev,
            publish_frequency: value as UserPublishFrequency,
          }))
        }
        defaultValue={profileData?.publish_frequency}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select frequency" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(UserPublishFrequency).map((val) => (
            <SelectItem key={val} value={val}>
              {val.replace(/_/g, " ")?.toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </StepWrapper>
);
