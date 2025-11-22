
'use client';

import { defineStepper } from "@/components/ui/stepper";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { ArrowLeft, ArrowRight, Briefcase, Lightbulb, Save, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UserProfileType, UserJobRole, UserExperienceLevel, UserCompanySize, UserCompanyPosition, UserTotalPublishedApps, UserDevelopmentPlatform, UserPublishFrequency, UserTestingServiceReason, UserCommunicationMethod, UserProfileData } from "@/lib/types";

const { Stepper, useStepper, utils } = defineStepper(
    { id: 'role', title: 'Your Role', description: 'Tell us about you.', icon: User },
    { id: 'company', title: 'Your Company', description: 'Info about your organization.', icon: Briefcase },
    { id: 'projects', title: 'Your Projects', description: 'About your work.', icon: Lightbulb },
    { id: 'contact', title: 'Contact', description: 'How to reach you.', icon: User },
);

interface ProfileStepperProps {
    profileData: Partial<UserProfileData>;
    setProfileData: React.Dispatch<React.SetStateAction<Partial<UserProfileData>>>;
    onSubmit: () => void;
}

export function ProfileStepper({ profileData, setProfileData, onSubmit }: ProfileStepperProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { state, goTo, next, prev, isFirst, isLast, current, all } = useStepper();

  const handleNext = async () => {
    next();
  }

  const stepperProps = { profileData, setProfileData };

  return (
    <div className="bg-card p-4 sm:p-8 rounded-2xl shadow-lg">
      <Stepper.Provider
        variant={isMobile ? "vertical" : "horizontal"}
        value={state}
        onStepChange={goTo}
      >
        <Stepper.Navigation>
            {all.map((step) => {
              const rolePanel = <RoleStep {...stepperProps} />;
              const companyPanel = <CompanyStep {...stepperProps} />;
              const projectsPanel = <ProjectsStep {...stepperProps} />;
              const contactPanel = <ContactStep {...stepperProps} />;

              let panel;
              if (step.id === 'role') panel = rolePanel;
              else if (step.id === 'company') panel = companyPanel;
              else if (step.id === 'projects') panel = projectsPanel;
              else if (step.id === 'contact') panel = contactPanel;

              return (
                <Stepper.Step key={step.id} of={step.id} icon={step.icon}>
                    <Stepper.Title>{step.title}</Stepper.Title>
                    {!isMobile && (
                        <Stepper.Description>{step.description}</Stepper.Description>
                    )}
                     {isMobile &&
                        utils.when(step.id, () => (
                          <Stepper.Panel className="h-auto content-center rounded border bg-slate-50 p-8">
                             {panel}
                          </Stepper.Panel>
                      ))}
                </Stepper.Step>
              )
            })}
        </Stepper.Navigation>

        {!isMobile && (
            <AnimatePresence mode="wait">
                <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
                    exit={{ opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } }}
                    className="mt-8"
                >
                    {current.id === 'role' && <RoleStep {...stepperProps} />}
                    {current.id === 'company' && <CompanyStep {...stepperProps} />}
                    {current.id === 'projects' && <ProjectsStep {...stepperProps} />}
                    {current.id === 'contact' && <ContactStep {...stepperProps} />}
                </motion.div>
            </AnimatePresence>
        )}

        <div className="mt-8 pt-5 border-t flex justify-between">
            <Button
                type="button"
                onClick={prev}
                disabled={isFirst}
                variant="ghost"
                className={cn(isFirst && "invisible")}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            
            <div className="flex items-center gap-4">
                <Button type="button" variant="ghost" asChild>
                    <Link href="/dashboard">Skip for now</Link>
                </Button>
                
                {!isLast && (
                    <Button
                        type="button"
                        onClick={handleNext}
                        variant="outline"
                    >
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                )}

                {isLast && (
                        <Button type="submit" onClick={onSubmit}>
                        <Save className="mr-2 h-4 w-4"/> Finish Setup
                    </Button>
                )}
            </div>
        </div>
      </Stepper.Provider>
    </div>
  );
}

const RoleStep = ({ profileData, setProfileData }: ProfileStepperProps) => (
    <div className="space-y-6">
        <div className="space-y-3">
             <RadioGroup
                onValueChange={(value) => setProfileData(prev => ({...prev, profileType: value as UserProfileType}))}
                defaultValue={profileData.profileType}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {Object.values(UserProfileType).map((type) => (
                    <div key={type}>
                        <RadioGroupItem value={type} id={type} className="peer sr-only" />
                        <Label htmlFor={type} className="flex h-full flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">{type.replace('_', ' ')}</Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
        <div>
            <Label>Your Job Role</Label>
            <Select onValueChange={(value) => setProfileData(prev => ({...prev, jobRole: value as UserJobRole}))} defaultValue={profileData.jobRole}>
                <SelectTrigger><SelectValue placeholder="Select your primary role" /></SelectTrigger>
                <SelectContent>{Object.values(UserJobRole).map(role => <SelectItem key={role} value={role}>{role.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
            </Select>
        </div>
        <div>
            <Label>Your Experience Level</Label>
            <Select onValueChange={(value) => setProfileData(prev => ({...prev, experienceLevel: value as UserExperienceLevel}))} defaultValue={profileData.experienceLevel}>
                <SelectTrigger><SelectValue placeholder="Select your experience level" /></SelectTrigger>
                <SelectContent>{Object.values(UserExperienceLevel).map(level => <SelectItem key={level} value={level}>{level.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
            </Select>
        </div>
    </div>
);

const CompanyStep = ({ profileData, setProfileData }: ProfileStepperProps) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <Label>Company Name</Label>
            <Input placeholder="Your Company Inc." value={profileData.companyName} onChange={e => setProfileData(prev => ({...prev, companyName: e.target.value}))} />
        </div>
        <div>
            <Label>Company Website</Label>
            <Input placeholder="https://example.com" value={profileData.companyWebsite} onChange={e => setProfileData(prev => ({...prev, companyWebsite: e.target.value}))} />
        </div>
        <div>
            <Label>Company Size</Label>
            <Select onValueChange={(value) => setProfileData(prev => ({...prev, companySize: value as UserCompanySize}))} defaultValue={profileData.companySize}>
                <SelectTrigger><SelectValue placeholder="Select company size" /></SelectTrigger>
                <SelectContent>
                    {Object.values(UserCompanySize).map(size => <SelectItem key={size} value={size}>{size.replace('SIZE_', '').replace(/_/g, '-')}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
        <div>
            <Label>Your Position</Label>
            <Select onValueChange={(value) => setProfileData(prev => ({...prev, positionInCompany: value as UserCompanyPosition}))} defaultValue={profileData.positionInCompany}>
                <SelectTrigger><SelectValue placeholder="Select your position" /></SelectTrigger>
                <SelectContent>
                    {Object.values(UserCompanyPosition).map(pos => <SelectItem key={pos} value={pos}>{pos.replace(/_/g, ' ')}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
    </div>
);

const ProjectsStep = ({ profileData, setProfileData }: ProfileStepperProps) => (
    <div className="space-y-6">
        <div>
            <Label>Total Published Apps</Label>
            <Select onValueChange={(value) => setProfileData(prev => ({...prev, totalPublishedApps: value as UserTotalPublishedApps}))} defaultValue={profileData.totalPublishedApps}>
                <SelectTrigger><SelectValue placeholder="Select number of apps" /></SelectTrigger>
                <SelectContent>
                    {Object.values(UserTotalPublishedApps).map(val => <SelectItem key={val} value={val}>{val.replace('PUB_', '').replace(/_/g, '-')}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
        <div>
            <Label>Primary Development Platform</Label>
            <Select onValueChange={(value) => setProfileData(prev => ({...prev, platformDevelopment: value as UserDevelopmentPlatform}))} defaultValue={profileData.platformDevelopment}>
                <SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger>
                <SelectContent>
                    {Object.values(UserDevelopmentPlatform).map(val => <SelectItem key={val} value={val}>{val.replace(/_/g, ' ')}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
        <div>
            <Label>App Publish Frequency</Label>
            <Select onValueChange={(value) => setProfileData(prev => ({...prev, publishFrequency: value as UserPublishFrequency}))} defaultValue={profileData.publishFrequency}>
                <SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger>
                <SelectContent>
                    {Object.values(UserPublishFrequency).map(val => <SelectItem key={val} value={val}>{val.replace(/_/g, ' ')}</SelectItem>)}
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
                <div key={item} className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 has-[:checked]:border-primary">
                    <Checkbox 
                        checked={profileData.serviceUsage?.includes(item)} 
                        onCheckedChange={(checked) => {
                            const current = profileData.serviceUsage || [];
                            const updated = checked ? [...current, item] : current.filter(val => val !== item);
                            setProfileData(prev => ({...prev, serviceUsage: updated}));
                        }}
                        id={`service-${item}`}
                    />
                    <Label htmlFor={`service-${item}`} className="text-sm font-normal">{item.replace(/_/g, ' ')}</Label>
                </div>
            ))}
            </div>
        </div>
        <div>
            <Label>Preferred Communication</Label>
            <div className="grid grid-cols-3 gap-4">
            {Object.values(UserCommunicationMethod).map((item) => (
                <div key={item} className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 has-[:checked]:border-primary">
                     <Checkbox 
                        checked={profileData.communicationMethods?.includes(item)} 
                        onCheckedChange={(checked) => {
                            const current = profileData.communicationMethods || [];
                            const updated = checked ? [...current, item] : current.filter(val => val !== item);
                            setProfileData(prev => ({...prev, communicationMethods: updated}));
                        }}
                        id={`comm-${item}`}
                    />
                    <Label htmlFor={`comm-${item}`} className="text-sm font-normal">{item.replace(/_/g, ' ')}</Label>
                </div>
            ))}
            </div>
        </div>
    </div>
);
