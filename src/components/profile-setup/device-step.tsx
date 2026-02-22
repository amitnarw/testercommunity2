"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileStepperProps, StepWrapper } from "./common";

export const DeviceStep = ({
  profileData,
  setProfileData,
}: ProfileStepperProps) => (
  <div className="overflow-y-auto h-full">
    <StepWrapper>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label>Device Company</Label>
          <Select
            onValueChange={(value) =>
              setProfileData((prev) => ({ ...prev, device_company: value }))
            }
            defaultValue={profileData?.device_company as string | undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="e.g., Google" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Google">Google</SelectItem>
              <SelectItem value="Samsung">Samsung</SelectItem>
              <SelectItem value="OnePlus">OnePlus</SelectItem>
              <SelectItem value="Xiaomi">Xiaomi</SelectItem>
              <SelectItem value="Motorola">Motorola</SelectItem>
              <SelectItem value="Sony">Sony</SelectItem>
              <SelectItem value="LG">LG</SelectItem>
              <SelectItem value="Huawei">Huawei</SelectItem>
              <SelectItem value="Nokia">Nokia</SelectItem>
              <SelectItem value="Asus">Asus</SelectItem>
              <SelectItem value="Oppo">Oppo</SelectItem>
              <SelectItem value="Vivo">Vivo</SelectItem>
              <SelectItem value="Realme">Realme</SelectItem>
              <SelectItem value="Lenovo">Lenovo</SelectItem>
              <SelectItem value="HTC">HTC</SelectItem>
              <SelectItem value="ZTE">ZTE</SelectItem>
              <SelectItem value="Alcatel">Alcatel</SelectItem>
              <SelectItem value="TCL">TCL</SelectItem>
              <SelectItem value="Nothing">Nothing</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Device Model</Label>
          <Input
            placeholder="e.g., Pixel 8 Pro"
            value={profileData?.device_model as string | undefined}
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                device_model: e.target.value,
              }))
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>RAM</Label>
          <Select
            onValueChange={(value) =>
              setProfileData((prev) => ({ ...prev, ram: value }))
            }
            defaultValue={profileData?.ram as string | undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="e.g., 8GB" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2GB">2GB</SelectItem>
              <SelectItem value="3GB">3GB</SelectItem>
              <SelectItem value="4GB">4GB</SelectItem>
              <SelectItem value="6GB">6GB</SelectItem>
              <SelectItem value="8GB">8GB</SelectItem>
              <SelectItem value="12GB">12GB</SelectItem>
              <SelectItem value="16GB">16GB</SelectItem>
              <SelectItem value="18GB">18GB</SelectItem>
              <SelectItem value="24GB">24GB</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Operating System</Label>
          <Select
            onValueChange={(value) =>
              setProfileData((prev) => ({ ...prev, os: value }))
            }
            defaultValue={profileData?.os as string | undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="e.g., Android 14" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Android 16">Android 16</SelectItem>
              <SelectItem value="Android 15">Android 15</SelectItem>
              <SelectItem value="Android 14">Android 14</SelectItem>
              <SelectItem value="Android 13">Android 13</SelectItem>
              <SelectItem value="Android 12">Android 12</SelectItem>
              <SelectItem value="Android 11">Android 11</SelectItem>
              <SelectItem value="Android 10 or older">
                Android 10 or older
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Screen Resolution</Label>
          <Select
            onValueChange={(value) =>
              setProfileData((prev) => ({ ...prev, screen_resolution: value }))
            }
            defaultValue={profileData?.screen_resolution as string | undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="e.g., QHD+" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HD+ (720p)">HD+ (720p)</SelectItem>
              <SelectItem value="FHD+ (1080p)">FHD+ (1080p)</SelectItem>
              <SelectItem value="QHD+ (2K)">QHD+ (2K)</SelectItem>
              <SelectItem value="UHD (4K)">UHD (4K)</SelectItem>
              <SelectItem value="UHD (8K)">UHD (8K)</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Language</Label>
          <Select
            onValueChange={(value) =>
              setProfileData((prev) => ({ ...prev, language: value }))
            }
            defaultValue={profileData?.language as string | undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="e.g., English (US)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English (US)">English (US)</SelectItem>
              <SelectItem value="English (UK)">English (UK)</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="Mandarin Chinese">Mandarin Chinese</SelectItem>
              <SelectItem value="Hindi">Hindi</SelectItem>
              <SelectItem value="Arabic">Arabic</SelectItem>
              <SelectItem value="Portuguese">Portuguese</SelectItem>
              <SelectItem value="Bengali">Bengali</SelectItem>
              <SelectItem value="Russian">Russian</SelectItem>
              <SelectItem value="Japanese">Japanese</SelectItem>
              <SelectItem value="German">German</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <Label>Primary Network</Label>
          <RadioGroup
            onValueChange={(value) =>
              setProfileData((prev) => ({ ...prev, network: value }))
            }
            defaultValue={profileData?.network as string | undefined}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem value="WiFi" id="wifi" className="peer sr-only" />
              <Label
                htmlFor="wifi"
                className="flex h-full flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-center"
              >
                WiFi
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="Cellular"
                id="cellular"
                className="peer sr-only"
              />
              <Label
                htmlFor="cellular"
                className="flex h-full flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-center"
              >
                Cellular
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </StepWrapper>
  </div>
);
