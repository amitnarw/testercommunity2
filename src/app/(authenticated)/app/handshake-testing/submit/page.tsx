"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  PlayCircle,
  Check,
  Clipboard,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IconRain } from "@/components/icon-rain";
import { PageHeader } from "@/components/page-header";
import { ROUTES } from "@/lib/routes";

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-emerald-500/20 text-emerald-600 font-semibold px-1.5 py-0.5 rounded-md">
    {children}
  </span>
);

const CopyBlock = ({ textToCopy }: { textToCopy: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-secondary/50 p-4 py-2 rounded-lg flex items-center justify-between my-4">
      <code className="text-sm text-muted-foreground">{textToCopy}</code>
      <Button variant="ghost" size="icon" onClick={handleCopy}>
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Clipboard className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};

export default function SubmitAppGuidePage() {
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-brand-background">
      <div className="container mx-auto px-4 md:px-6 pb-12">
        <PageHeader
          title=""
          backHref={ROUTES.AUTHENTICATED.HANDSHAKE_TESTING}
          className="max-w-[50%] sm:max-w-4xl mx-0 sm:mx-auto py-2 sm:!py-2.5"
        />
        <header className="mb-8 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 mt-5">
          <div className="flex flex-col items-start justify-center">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
              Submit a Handshake App
            </h1>
            <p className="text-muted-foreground mt-2">
              Follow this simple guide to prepare your app for handshake testing. Publishing is free.
            </p>
          </div>
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <div className="rounded-xl overflow-hidden shadow-lg relative bg-gradient-to-br from-emerald-500/50 to-emerald-700">
              {isClient && <IconRain />}
              {isVideoExpanded ? (
                <div className="relative aspect-video">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube-nocookie.com/embed/9V6kyq8z4UQ?autoplay=1"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div
                  className="p-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer relative z-10"
                  onClick={() => setIsVideoExpanded(true)}
                >
                  <div>
                    <h3 className="font-bold text-xl sm:text-2xl mb-1 flex flex-col sm:flex-row items-center sm:gap-3 text-white">
                      Quick Walkthrough{" "}
                      <span className="text-sm font-medium text-black">
                        (2-min watch)
                      </span>
                    </h3>
                    <p className="text-white/80 text-sm text-center sm:text-start">
                      Watch a short video on how to submit your app for handshake testing.
                    </p>
                  </div>
                  <Button size="lg" variant="outline">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Watch Guide
                  </Button>
                </div>
              )}
            </div>

            <p className="text-center text-muted-foreground text-sm">
              You can either watch the video above or follow the step-by-step guide below. Both cover the same process.
            </p>

            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem
                value="prepare-app"
                className="bg-white dark:bg-secondary/80 rounded-xl overflow-hidden shadow-xl shadow-gray-200/70 dark:shadow-black/20"
              >
                <AccordionTrigger className="p-6 text-left hover:no-underline flex flex-row items-center justify-between w-full relative">
                  <div className="flex items-start flex-1">
                    <span className="text-7xl md:text-5xl font-black bg-gradient-to-br bg-clip-text text-transparent md:w-20 absolute -top-3 -left-3 md:relative md:top-auto md:left-auto from-emerald-500/20 to-emerald-700/0">
                      01
                    </span>
                    <div>
                      <h3 className="font-bold text-xl mb-1">
                        Prepare App for Testing
                      </h3>
                      <p className="text-muted-foreground text-sm text-left">
                        Grant access and enable global reach in Play Console
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="flex flex-col gap-6 items-start">
                    <div className="flex-1 space-y-4 text-muted-foreground">
                      <p>
                        Before you share your link, ensure your app is correctly configured in the Google Play Console:
                      </p>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                          <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-emerald-500/10 text-emerald-600">1</span>
                            Grant Testers Access
                          </p>
                          <div className="text-sm space-y-2">
                            <p>Navigate to the <Highlight>Closed Testing</Highlight> page and go to the <Highlight>Testers</Highlight> tab. Paste the following Google Group address in the "Add email addresses" field:</p>
                            <CopyBlock textToCopy="appstestlab@googlegroups.com" />
                            <p className="text-xs italic"><strong>Why?</strong> This allows our secure community of testers to download your app while it remains invisible to the public.</p>
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                          <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-emerald-500/10 text-emerald-600">2</span>
                            Enable Global Reach
                          </p>
                          <p className="text-sm">Click the <Highlight>Countries / regions</Highlight> tab and click <Highlight>Add countries / regions</Highlight>. Select the first checkbox to include <Highlight>All</Highlight> countries and regions for maximum test coverage.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                          <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-emerald-500/10 text-emerald-600">3</span>
                            Submit for Google's Review
                          </p>
                          <p className="text-sm"><Highlight>Save</Highlight> your changes. Go to Publishing Overview and Send Changes for Review.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="app-info"
                className="bg-white dark:bg-secondary/80 rounded-xl overflow-hidden shadow-xl shadow-gray-200/70 dark:shadow-black/20"
              >
                <AccordionTrigger className="p-6 text-left hover:no-underline flex flex-row items-center justify-between w-full relative">
                  <div className="flex items-start flex-1">
                    <span className="text-7xl md:text-5xl font-black bg-gradient-to-br bg-clip-text text-transparent md:w-20 absolute -top-3 -left-3 md:relative md:top-auto md:left-auto from-emerald-500/20 to-emerald-700/0">
                      02
                    </span>
                    <div>
                      <h3 className="font-bold text-xl mb-1">
                        Finding Your App Details
                      </h3>
                      <p className="text-muted-foreground text-sm text-left">
                        Where to get your testing link and logo
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="flex flex-col gap-6 items-start">
                    <div className="flex-1 space-y-4 text-muted-foreground">
                      <p>
                        To submit your app for testing, you need to share some links from the Google Play Console. Here is how to find each one:
                      </p>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                          <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-emerald-500/10 text-emerald-600">1</span>
                            Testing Link
                          </p>
                          <p className="text-sm">Go to your app in the Google Play Console. Click on <Highlight>Testing</Highlight> from the left menu. Click on <Highlight>Closed Testing</Highlight>. Click on the testers tab. Look for the <Highlight>Join on Android</Highlight> link and copy it. This is the link our testers will use to download your app.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                          <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-emerald-500/10 text-emerald-600">2</span>
                            App Logo
                          </p>
                          <p className="text-sm">Go to your app in Google Play Console. Click on <Highlight>Store presence</Highlight> on the left menu. Click on <Highlight>Store listing</Highlight>. Scroll down to <Highlight>Graphic Assets</Highlight>. Find the App Icon section. Right-click on the icon and copy the image address. This is your logo URL.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="points"
                className="bg-white dark:bg-secondary/80 rounded-xl overflow-hidden shadow-xl shadow-gray-200/70 dark:shadow-black/20"
              >
                <AccordionTrigger className="p-6 text-left hover:no-underline flex flex-row items-center justify-between w-full relative">
                  <div className="flex items-start flex-1">
                    <span className="text-7xl md:text-5xl font-black bg-gradient-to-br bg-clip-text text-transparent md:w-20 absolute -top-3 -left-3 md:relative md:top-auto md:left-auto from-emerald-500/20 to-emerald-700/0">
                      03
                    </span>
                    <div>
                      <h3 className="font-bold text-xl mb-1">
                        How Handshake Testing Works
                      </h3>
                      <p className="text-muted-foreground text-sm text-left">
                        Barter-based testing , free for everyone
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="flex flex-col gap-6 items-start">
                    <div className="flex-1 space-y-4 text-muted-foreground">
                      <p>
                        Handshake testing is a barter system. You test another developer's app and they test yours. Here is how it works:
                      </p>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                          <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-emerald-500/10 text-emerald-600">1</span>
                            What is a handshake?
                          </p>
                          <p className="text-sm">When you request to test an app, you offer one of your own published apps in return. Both of you join each other's tests. No points are involved.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                          <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-emerald-500/10 text-emerald-600">2</span>
                            Completely free
                          </p>
                          <p className="text-sm">No subscription and no points , publishing and joining handshake tests is free for everyone. Your level rises as you complete successful handshakes, unlocking more simultaneous test slots.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                          <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-emerald-500/10 text-emerald-600">3</span>
                            Slots and levels
                          </p>
                          <p className="text-sm">Each level grants more active handshake slots (start at 12, up to 20). Reach the next level's completion threshold to level up. Skipping your half of a test can temporarily block you from new handshakes.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="test-config"
                className="bg-white dark:bg-secondary/80 rounded-xl overflow-hidden shadow-xl shadow-gray-200/70 dark:shadow-black/20"
              >
                <AccordionTrigger className="p-6 text-left hover:no-underline flex flex-row items-center justify-between w-full relative">
                  <div className="flex items-start flex-1">
                    <span className="text-7xl md:text-5xl font-black bg-gradient-to-br bg-clip-text text-transparent md:w-20 absolute -top-3 -left-3 md:relative md:top-auto md:left-auto from-emerald-500/20 to-emerald-700/0">
                      04
                    </span>
                    <div>
                      <h3 className="font-bold text-xl mb-1">
                        Setting Up Your Test
                      </h3>
                      <p className="text-muted-foreground text-sm text-left">
                        Test setup is fixed ,  here is what to know
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="flex flex-col gap-6 items-start">
                    <div className="flex-1 space-y-4 text-muted-foreground">
                      <p>
                        Handshake campaigns use a fixed setup of{" "}
                        <Highlight>14 tester slots</Highlight> for{" "}
                        <Highlight>16 days</Highlight>. The only setting you choose is the minimum Android version.
                      </p>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                          <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-emerald-500/10 text-emerald-600">1</span>
                            Minimum Android version
                          </p>
                          <p className="text-sm">Select the oldest Android version your app supports. This helps us match testers who have devices that can run your app. If your app works on Android 8, select <Highlight>Android 8.0</Highlight> from the list. Only testers with devices running that version or newer will be assigned to your test.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="pt-6 flex justify-end">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                <Link href={ROUTES.AUTHENTICATED.HANDSHAKE_SUBMIT_FORM}>
                  Get Started <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
