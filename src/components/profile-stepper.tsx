
'use client';

import { defineStepper } from "@/components/ui/stepper";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from "./ui/form";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { ArrowLeft, ArrowRight, Briefcase, Lightbulb, Save, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UserProfileType, UserJobRole, UserExperienceLevel, UserCompanySize, UserCompanyPosition, UserTotalPublishedApps, UserDevelopmentPlatform, UserPublishFrequency, UserTestingServiceReason, UserCommunicationMethod } from "@/lib/types";

const { Stepper, useStepper, utils } = defineStepper(
    { id: 'role', title: 'Your Role', description: 'Tell us about you.', icon: User },
    { id: 'company', title: 'Your Company', description: 'Info about your organization.', icon: Briefcase },
    { id: 'projects', title: 'Your Projects', description: 'About your work.', icon: Lightbulb },
    { id: 'contact', title: 'Contact', description: 'How to reach you.', icon: User },
);

export function ProfileStepper({ form, onSubmit }: { form: any, onSubmit: () => void }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { state, goTo, next, prev, isFirst, isLast, current, all } = useStepper();

  const handleNext = async () => {
    const fieldsForStep: { [key: string]: (keyof typeof form.getValues)[] } = {
        role: ['profileType', 'jobRole', 'experienceLevel'],
        company: ['companyName', 'companyWebsite', 'companySize', 'positionInCompany'],
        projects: ['totalPublishedApps', 'platformDevelopment', 'publishFrequency'],
        contact: ['serviceUsage', 'communicationMethods']
    };

    const fields = fieldsForStep[current.id];

    if (fields) {
        const output = await form.trigger(fields);
        if (!output) return;
    }
    next();
  }

  return (
    <div className="bg-card p-4 sm:p-8 rounded-2xl shadow-lg">
      <Stepper.Provider
        variant={isMobile ? "vertical" : "horizontal"}
        value={state}
        onStepChange={goTo}
      >
        <Stepper.Navigation>
            {all.map((step) => {
              const rolePanel = <RoleStep form={form} />;
              const companyPanel = <CompanyStep form={form} />;
              const projectsPanel = <ProjectsStep form={form} />;
              const contactPanel = <ContactStep form={form} />;
              
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
                    {current.id === 'role' && <RoleStep form={form} />}
                    {current.id === 'company' && <CompanyStep form={form} />}
                    {current.id === 'projects' && <ProjectsStep form={form} />}
                    {current.id === 'contact' && <ContactStep form={form} />}
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

const RoleStep = ({ form }: { form: any }) => (
    <div className="space-y-6">
        <FormField
            control={form.control}
            name="profileType"
            render={({ field }: any) => (
                <FormItem className="space-y-3">
                <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.values(UserProfileType).map((type) => (
                            <FormItem key={type}>
                                <RadioGroupItem value={type} id={type} className="peer sr-only" />
                                <Label htmlFor={type} className="flex h-full flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">{type.replace('_', ' ')}</Label>
                            </FormItem>
                        ))}
                    </RadioGroup>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField name="jobRole" render={({ field }: any) => (
            <FormItem><FormLabel>Your Job Role</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select your primary role" /></SelectTrigger></FormControl>
                <SelectContent>{Object.values(UserJobRole).map(role => <SelectItem key={role} value={role}>{role.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
            </Select>
            <FormMessage /></FormItem>
        )} />
        <FormField name="experienceLevel" render={({ field }: any) => (
            <FormItem><FormLabel>Your Experience Level</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select your experience level" /></SelectTrigger></FormControl>
                <SelectContent>{Object.values(UserExperienceLevel).map(level => <SelectItem key={level} value={level}>{level.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
            </Select>
            <FormMessage /></FormItem>
        )} />
    </div>
);

const CompanyStep = ({ form }: { form: any }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField name="companyName" render={({ field }: any) => (
                <FormItem><FormLabel>Company Name</FormLabel><FormControl><Input placeholder="Your Company Inc." {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField name="companyWebsite" render={({ field }: any) => (
                <FormItem><FormLabel>Company Website</FormLabel><FormControl><Input placeholder="https://example.com" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField name="companySize" render={({ field }: any) => (
                <FormItem><FormLabel>Company Size</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select company size" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {Object.values(UserCompanySize).map(size => <SelectItem key={size} value={size}>{size.replace('SIZE_', '').replace(/_/g, '-')}</SelectItem>)}
                    </SelectContent>
                </Select>
                <FormMessage /></FormItem>
        )} />
        <FormField name="positionInCompany" render={({ field }: any) => (
            <FormItem><FormLabel>Your Position</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select your position" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {Object.values(UserCompanyPosition).map(pos => <SelectItem key={pos} value={pos}>{pos.replace(/_/g, ' ')}</SelectItem>)}
                    </SelectContent>
                </Select>
            <FormMessage /></FormItem>
        )} />
    </div>
);

const ProjectsStep = ({ form }: { form: any }) => (
    <div className="space-y-6">
        <FormField name="totalPublishedApps" render={({ field }: any) => (
            <FormItem><FormLabel>Total Published Apps</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select number of apps" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {Object.values(UserTotalPublishedApps).map(val => <SelectItem key={val} value={val}>{val.replace('PUB_', '').replace(/_/g, '-')}</SelectItem>)}
                    </SelectContent>
                </Select>
            <FormMessage /></FormItem>
        )} />
        <FormField name="platformDevelopment" render={({ field }: any) => (
            <FormItem><FormLabel>Primary Development Platform</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {Object.values(UserDevelopmentPlatform).map(val => <SelectItem key={val} value={val}>{val.replace(/_/g, ' ')}</SelectItem>)}
                    </SelectContent>
                </Select>
            <FormMessage /></FormItem>
        )} />
        <FormField name="publishFrequency" render={({ field }: any) => (
            <FormItem><FormLabel>App Publish Frequency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {Object.values(UserPublishFrequency).map(val => <SelectItem key={val} value={val}>{val.replace(/_/g, ' ')}</SelectItem>)}
                    </SelectContent>
                </Select>
            <FormMessage /></FormItem>
        )} />
    </div>
);

const ContactStep = ({ form }: { form: any }) => (
    <div className="space-y-6">
        <FormField name="serviceUsage" render={() => (
            <FormItem>
                <FormLabel>Why are you using our service?</FormLabel>
                <div className="grid grid-cols-2 gap-4">
                {Object.values(UserTestingServiceReason).map((item) => (
                    <FormField key={item} control={form.control} name="serviceUsage" render={({ field }: any) => (
                        <FormItem key={item} className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 has-[:checked]:border-primary">
                            <FormControl>
                                <Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => {
                                    return checked ? field.onChange([...(field.value || []), item]) : field.onChange(field.value?.filter((value: any) => value !== item))
                                }} />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">{item.replace(/_/g, ' ')}</FormLabel>
                        </FormItem>
                    )} />
                ))}
                </div>
                <FormMessage />
            </FormItem>
        )} />
        <FormField name="communicationMethods" render={() => (
            <FormItem>
                <FormLabel>Preferred Communication</FormLabel>
                <div className="grid grid-cols-3 gap-4">
                {Object.values(UserCommunicationMethod).map((item) => (
                    <FormField key={item} control={form.control} name="communicationMethods" render={({ field }: any) => (
                        <FormItem key={item} className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 has-[:checked]:border-primary">
                            <FormControl>
                                <Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => {
                                    return checked ? field.onChange([...(field.value || []), item]) : field.onChange(field.value?.filter((value: any) => value !== item))
                                }} />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">{item.replace(/_/g, ' ')}</FormLabel>
                        </FormItem>
                    )} />
                ))}
                </div>
                <FormMessage />
            </FormItem>
        )} />
    </div>
);
