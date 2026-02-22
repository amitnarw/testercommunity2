"use client";

import React from "react";
import { UserTestingServiceReason, UserCommunicationMethod } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileStepperProps, StepWrapper } from "./common";
import { countries } from "@/lib/countries";

export const ContactStep = ({
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
      <div>
        <Label>Why are you using our service?</Label>
        <RadioGroup
          value={profileData?.service_usage || ""}
          onValueChange={(value) =>
            setProfileData((prev) => ({
              ...prev,
              service_usage: value as UserTestingServiceReason,
            }))
          }
          className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2"
        >
          {Object.values(UserTestingServiceReason).map((item) => (
            <div key={item} className="flex items-center gap-3">
              <RadioGroupItem
                key={item}
                value={item}
                id={`service-${item}`}
              ></RadioGroupItem>
              <Label
                htmlFor={`service-${item}`}
                className="text-sm font-normal cursor-pointer"
              >
                {item.replace(/_/g, " ").toLowerCase()}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div>
        <Label>Preferred Communication Methods</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
          {Object.values(UserCommunicationMethod).map((item) => (
            <div
              key={item}
              className="flex items-center space-x-2 rounded-md border has-[:checked]:border-primary"
            >
              <Checkbox
                checked={profileData?.communication_methods?.includes(item)}
                onCheckedChange={(checked) => {
                  const current = profileData?.communication_methods || [];
                  const updated = checked
                    ? [...current, item]
                    : current.filter((val) => val !== item);
                  setProfileData((prev) => ({
                    ...prev,
                    communication_methods: updated,
                  }));
                }}
                id={`comm-${item}`}
                className="ml-3 rounded-[4px]"
                // className="flex items-center space-x-2
              />
              <Label
                htmlFor={`comm-${item}`}
                className="text-sm font-normal cursor-pointer w-full p-3"
              >
                {item?.toLowerCase()}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </StepWrapper>
  </div>
);
