"use client";

import * as React from "react";

import { defineStepper } from "@/components/ui/stepper";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Lightbulb,
  Save,
  User,
} from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import {
  UserCommunicationMethod,
  UserCompanyPosition,
  UserCompanySize,
  UserDevelopmentPlatform,
  UserExperienceLevel,
  UserJobRole,
  UserProfileData,
  UserProfileType,
  UserPublishFrequency,
  UserTestingServiceReason,
  UserTotalPublishedApps,
} from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface ProfileStepperProps {
  profileData: Partial<UserProfileData>;
  setProfileData: React.Dispatch<
    React.SetStateAction<Partial<UserProfileData>>
  >;
  onSubmit?: () => void;
}

const { Stepper } = defineStepper(
  {
    id: "role",
    title: "Your Role",
    description: "Tell us about you.",
    icon: User,
  },
  {
    id: "company",
    title: "Your Company",
    description: "Info about your organization.",
    icon: Briefcase,
  },
  {
    id: "projects",
    title: "Your Projects",
    description: "About your work.",
    icon: Lightbulb,
  },
  {
    id: "contact",
    title: "Contact",
    description: "How to reach you.",
    icon: User,
  },
);

export function StepperWithResponsiveVariant({
  profileData,
  setProfileData,
  onSubmit,
}: ProfileStepperProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const stepperProps = { profileData, setProfileData };
  return (
    <Stepper.Provider
      className="space-y-4"
      variant={isMobile ? "vertical" : "horizontal"}
    >
      {({ methods }) => (
        <React.Fragment>
          <Stepper.Navigation>
            {methods.all.map((step) => (
              <Stepper.Step
                key={step.id}
                of={step.id}
                onClick={() => methods.goTo(step.id)}
              >
                <Stepper.Title>{step.title}</Stepper.Title>
                {isMobile &&
                  methods.when(step.id, (step) => (
                    <Stepper.Panel className="content-center rounded border bg-slate-50 p-8">
                      {step?.id === "role" ? (
                        <RoleStep {...stepperProps} />
                      ) : step?.id === "company" ? (
                        <CompanyStep {...stepperProps} />
                      ) : step?.id === "projects" ? (
                        <ProjectsStep {...stepperProps} />
                      ) : (
                        <ContactStep {...stepperProps} />
                      )}
                    </Stepper.Panel>
                  ))}
              </Stepper.Step>
            ))}
          </Stepper.Navigation>
          {!isMobile && (
            <Stepper.Panel className="content-center rounded border bg-slate-50 p-8">
              {methods.switch({
                role: (step) => <RoleStep {...stepperProps} />,
                company: (step) => <CompanyStep {...stepperProps} />,
                projects: (step) => <ProjectsStep {...stepperProps} />,
                contact: (step) => <ContactStep {...stepperProps} />,
              })}
            </Stepper.Panel>
          )}
          <Stepper.Controls>
            {!methods.isLast && (
              <Button
                type="button"
                variant="secondary"
                onClick={methods.prev}
                disabled={methods.isFirst}
              >
                Previous
              </Button>
            )}
            <Button onClick={methods.isLast ? methods.reset : methods.next}>
              {methods.isLast ? "Reset" : "Next"}
            </Button>
          </Stepper.Controls>
        </React.Fragment>
      )}
    </Stepper.Provider>
  );
}

const RoleStep = ({ profileData, setProfileData }: ProfileStepperProps) => (
  <div className="space-y-6">
    <div className="space-y-3">
      <RadioGroup
        onValueChange={(value) =>
          setProfileData((prev) => ({
            ...prev,
            profile_type: value as UserProfileType,
          }))
        }
        defaultValue={profileData?.profile_type}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {Object.values(UserProfileType).map((type) => (
          <div key={type}>
            <RadioGroupItem value={type} id={type} className="peer sr-only" />
            <Label
              htmlFor={type}
              className="flex h-full flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              {type.replace("_", " ")}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
    <div>
      <Label>Your Job Role</Label>
      <Select
        onValueChange={(value) =>
          setProfileData((prev) => ({
            ...prev,
            job_role: value as UserJobRole,
          }))
        }
        defaultValue={profileData?.job_role}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select your primary role" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(UserJobRole).map((role) => (
            <SelectItem key={role} value={role}>
              {role.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label>Your Experience Level</Label>
      <Select
        onValueChange={(value) =>
          setProfileData((prev) => ({
            ...prev,
            experience_level: value as UserExperienceLevel,
          }))
        }
        defaultValue={profileData?.experience_level}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select your experience level" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(UserExperienceLevel).map((level) => (
            <SelectItem key={level} value={level}>
              {level.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);

const CompanyStep = ({ profileData, setProfileData }: ProfileStepperProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <Label>Company Name</Label>
      <Input
        placeholder="Your Company Inc."
        value={profileData?.company_name}
        onChange={(e) =>
          setProfileData((prev) => ({ ...prev, company_name: e.target.value }))
        }
      />
    </div>
    <div>
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
    <div>
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
              {size.replace("SIZE_", "").replace(/_/g, "-")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div>
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
              {pos.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);

const ProjectsStep = ({ profileData, setProfileData }: ProfileStepperProps) => (
  <div className="space-y-6">
    <div>
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
              {val.replace("PUB_", "").replace(/_/g, "-")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div>
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
              {val.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div>
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
              {val.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);

const ContactStep = ({ profileData, setProfileData }: ProfileStepperProps) => (
  <div className="space-y-6">
    <div>
      <Label>Why are you using our service?</Label>
      <div className="grid grid-cols-2 gap-4">
        {Object.values(UserTestingServiceReason).map((item) => (
          <div
            key={item}
            className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 has-[:checked]:border-primary"
          >
            <Checkbox
              checked={profileData?.service_usage?.includes(item as any)}
              onCheckedChange={(checked) => {
                const current =
                  (profileData?.service_usage as unknown as any[]) || [];
                const updated = checked
                  ? [...current, item as any]
                  : current.filter((val: string) => val !== item);
                setProfileData((prev) => ({
                  ...prev,
                  service_usage: updated as any,
                }));
              }}
              id={`service-${item}`}
            />
            <Label htmlFor={`service-${item}`} className="text-sm font-normal">
              {item.replace(/_/g, " ")}
            </Label>
          </div>
        ))}
      </div>
    </div>
    <div>
      <Label>Preferred Communication</Label>
      <div className="grid grid-cols-3 gap-4">
        {Object.values(UserCommunicationMethod).map((item) => (
          <div
            key={item}
            className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 has-[:checked]:border-primary"
          >
            <Checkbox
              checked={profileData?.communication_methods?.includes(
                item as any,
              )}
              onCheckedChange={(checked) => {
                const current =
                  (profileData?.communication_methods as any[]) || [];
                const updated = checked
                  ? [...current, item as any]
                  : current.filter((val: string) => val !== item);
                setProfileData((prev) => ({
                  ...prev,
                  communication_methods: updated,
                }));
              }}
              id={`comm-${item}`}
            />
            <Label htmlFor={`comm-${item}`} className="text-sm font-normal">
              {item.replace(/_/g, " ")}
            </Label>
          </div>
        ))}
      </div>
    </div>
  </div>
);
