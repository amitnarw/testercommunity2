"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ProfileStepperProps, StepWrapper } from "./common";

const testingTypeOptions = [
  { id: "manual", label: "Manual Testing" },
  { id: "automation", label: "Automation Testing" },
  { id: "performance", label: "Performance Testing" },
  { id: "security", label: "Security Testing" },
  { id: "usability", label: "Usability Testing" },
  { id: "api", label: "API Testing" },
];

export const TesterAboutYouStep = ({
  profileData,
  setProfileData,
}: ProfileStepperProps) => (
  <StepWrapper>
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Years of QA Experience</Label>
        <Select
          value={profileData?.years_of_experience || ""}
          onValueChange={(value) =>
            setProfileData((prev) => ({
              ...prev,
              years_of_experience: value,
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-1">0-1 years</SelectItem>
            <SelectItem value="1-3">1-3 years</SelectItem>
            <SelectItem value="3-5">3-5 years</SelectItem>
            <SelectItem value="5+">5+ years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Areas of Expertise</Label>
        <div className="grid grid-cols-2 gap-3">
          {testingTypeOptions.map((item) => (
            <div
              key={item.id}
              className="flex flex-row items-center space-x-3 space-y-0"
            >
              <Checkbox
                id={`expertise-${item.id}`}
                checked={profileData?.areas_of_expertise?.includes(item.id)}
                onCheckedChange={(checked) => {
                  const current = profileData?.areas_of_expertise || [];
                  const updated = checked
                    ? [...current, item.id]
                    : current.filter((v: string) => v !== item.id);
                  setProfileData((prev) => ({
                    ...prev,
                    areas_of_expertise: updated,
                  }));
                }}
              />
              <Label htmlFor={`expertise-${item.id}`} className="text-sm font-normal cursor-pointer">
                {item.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Professional Bio (Optional)</Label>
        <Textarea
          className="resize-none"
          placeholder="Tell us about your experience..."
          value={profileData?.bio || ""}
          onChange={(e) =>
            setProfileData((prev) => ({
              ...prev,
              bio: e.target.value,
            }))
          }
        />
      </div>
    </div>
  </StepWrapper>
);
