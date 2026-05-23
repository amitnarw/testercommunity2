"use client";

import React from "react";
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
import { countries } from "@/lib/countries";

export const TesterPreferencesStep = ({
  profileData,
  setProfileData,
}: ProfileStepperProps) => (
  <div className="overflow-y-auto h-full">
    <StepWrapper>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label>Country</Label>
          <Select
            value={profileData?.country || ""}
            onValueChange={(value) => {
              const country = countries.find((c) => c.name === value);
              setProfileData((prev) => ({
                ...prev,
                country: value,
                phone: country ? country.dial_code : prev.phone,
              }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.name}>
                  {country.name} ({country.dial_code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Phone Number</Label>
          <Input
            type="tel"
            placeholder="Phone Number"
            value={profileData?.phone || ""}
            disabled={!profileData?.country}
            onChange={(e) => {
              const value = e.target.value;
              const country = countries.find(
                (c) => c.name === profileData?.country,
              );

              if (country) {
                // If the user tries to delete the dial code, prevent it or reset
                if (!value.startsWith(country.dial_code)) {
                  if (value.length < country.dial_code.length) {
                    setProfileData((prev) => ({
                      ...prev,
                      phone: country.dial_code,
                    }));
                  }
                  return;
                }

                const numberPart = value.slice(country.dial_code.length);

                // Allow only digits and check length
                if (
                  numberPart.length <= country.length &&
                  /^\d*$/.test(numberPart)
                ) {
                  setProfileData((prev) => ({ ...prev, phone: value }));
                }
              } else {
                setProfileData((prev) => ({ ...prev, phone: value }));
              }
            }}
          />
        </div>
      </div>
    </StepWrapper>
  </div>
);
