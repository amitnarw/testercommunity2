"use client";

import React from "react";
import { UserCompanySize, UserCompanyPosition } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileStepperProps, StepWrapper } from "./common";

export const CompanyStep = ({
  profileData,
  setProfileData,
}: ProfileStepperProps) => (
  <StepWrapper>
    <div className="flex flex-col gap-2">
      <Label>Company Name</Label>
      <Input
        placeholder="Your Company Inc."
        value={profileData?.company_name}
        onChange={(e) =>
          setProfileData((prev) => ({ ...prev, company_name: e.target.value }))
        }
      />
    </div>
    <div className="flex flex-col gap-2">
      <Label>Company Website</Label>
      <Input
        placeholder="https://example.com"
        value={profileData?.company_website}
        onChange={(e) =>
          setProfileData((prev) => ({
            ...prev,
            company_website: e.target.value,
          }))
        }
      />
    </div>
    <div className="flex flex-col gap-2">
      <Label>Company Size</Label>
      <Select
        onValueChange={(value) =>
          setProfileData((prev) => ({
            ...prev,
            company_size: value as UserCompanySize,
          }))
        }
        defaultValue={profileData?.company_size}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select company size" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(UserCompanySize).map((size) => (
            <SelectItem key={size} value={size}>
              {size.replace("SIZE_", "").replace(/_/g, "-")?.toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="flex flex-col gap-2">
      <Label>Your Position</Label>
      <Select
        onValueChange={(value) =>
          setProfileData((prev) => ({
            ...prev,
            position_in_company: value as UserCompanyPosition,
          }))
        }
        defaultValue={profileData?.position_in_company}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select your position" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(UserCompanyPosition).map((pos) => (
            <SelectItem key={pos} value={pos}>
              {pos.replace(/_/g, " ")?.toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </StepWrapper>
);
