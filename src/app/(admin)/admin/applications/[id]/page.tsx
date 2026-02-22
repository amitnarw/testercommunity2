"use client";

import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Check,
  Download,
  Mail,
  Phone,
  Shield,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/back-button";

const applications = [
  {
    id: 1,
    name: "Maria Garcia",
    email: "maria@example.com",
    date: "2024-08-20",
    experience: "3-5 years",
    expertise: ["Manual", "Usability"],
    bio: "Detail-oriented QA tester with over 4 years of experience in manual and usability testing for mobile applications. Passionate about ensuring a seamless user experience and identifying critical bugs before they reach production. Proficient in JIRA, TestRail, and Charles Proxy.",
    avatar: "https://i.pravatar.cc/150?u=maria-garcia",
    phone: "555-0101",
  },
  {
    id: 2,
    name: "David Kim",
    email: "david@example.com",
    date: "2024-08-19",
    experience: "5+ years",
    expertise: ["Automation", "Performance", "API"],
    bio: "Senior QA Automation Engineer with extensive experience in creating and maintaining test frameworks using Selenium, Appium, and Postman. Proven ability to improve testing efficiency and coverage. Looking to apply my skills to challenging mobile projects.",
    avatar: "https://i.pravatar.cc/150?u=david-kim",
    phone: "555-0102",
  },
  {
    id: 3,
    name: "Alex Johnson",
    email: "alex@example.com",
    date: "2024-08-18",
    experience: "1-3 years",
    expertise: ["Manual"],
    bio: "Enthusiastic and fast-learning junior tester with a solid foundation in manual testing methodologies. Eager to contribute to a dynamic team and grow my skills in the mobile testing space. I have a keen eye for detail and a knack for breaking things.",
    avatar: "https://i.pravatar.cc/150?u=alex-johnson",
    phone: "555-0103",
  },
  {
    id: 4,
    name: "Priya Patel",
    email: "priya@example.com",
    date: "2024-08-17",
    experience: "3-5 years",
    expertise: ["Security", "Manual"],
    bio: "Cybersecurity professional with a focus on mobile application security testing. Experienced in vulnerability assessment, penetration testing, and static/dynamic analysis. Certified Ethical Hacker (CEH).",
    avatar: "https://i.pravatar.cc/150?u=priya-patel",
    phone: "555-0104",
  },
  {
    id: 5,
    name: "Michael Chen",
    email: "michael@example.com",
    date: "2024-08-16",
    experience: "5+ years",
    expertise: ["Automation", "API", "Performance"],
    bio: "Results-driven QA lead with a track record of implementing successful performance and API testing strategies. Proficient with JMeter, Gatling, and REST Assured. Strong leadership and mentoring skills.",
    avatar: "https://i.pravatar.cc/150?u=michael-chen",
    phone: "555-0105",
  },
];

export default function AdminApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const application = applications.find(
    (app) => app.id.toString() === params.id,
  );

  if (!application) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="sticky top-0 z-[50] pt-2 pb-4 w-1/2">
        <BackButton href="/community-dashboard" />
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-br from-primary to-primary/10 bg-clip-text text-transparent">
              Application
            </h2>
            <p className="text-lg sm:text-xl bg-gradient-to-br from-primary to-primary/10 bg-clip-text text-transparent">
              ( Tester )
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="destructive">
              <X className="sm:mr-2 !h-3 !w-3 sm:!h-4 sm:!w-4" />
              <span className="hidden sm:block">Reject Application</span>
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <Check className="sm:mr-2 !h-3 !w-3 sm:!h-4 sm:!w-4" />
              <span className="hidden sm:block">Approve Application</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={application.avatar} />
                <AvatarFallback>{application.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold">{application.name}</h3>
              <p className="text-sm text-muted-foreground">
                {application.email}
              </p>
              <Badge variant="secondary" className="mt-4">
                New Applicant
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a
                  href={`mailto:${application.email}`}
                  className="hover:underline"
                >
                  {application.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{application.phone}</span>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" /> Download Resume/CV
          </Button>
        </div>
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Professional Background</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{application.bio}</p>
              <Separator className="my-6" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-muted-foreground">
                    Experience
                  </p>
                  <p className="font-bold text-lg">{application.experience}</p>
                </div>
                <div>
                  <p className="font-semibold text-muted-foreground">
                    Submitted
                  </p>
                  <p>{new Date(application.date).toLocaleDateString()}</p>
                </div>
              </div>
              <Separator className="my-6" />
              <div>
                <p className="font-semibold text-muted-foreground mb-3">
                  Areas of Expertise
                </p>
                <div className="flex flex-wrap gap-2">
                  {application.expertise.map((e) => (
                    <Badge
                      key={e}
                      variant="outline"
                      className="text-base py-1 px-3 flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      {e}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Screening Questions</CardTitle>
              <CardDescription>
                Responses to our standard screening questions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-1">
                  Describe a critical bug you found and how you reported it.
                </h4>
                <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">
                  "In a previous project, I found a race condition that could
                  lead to data corruption during simultaneous write operations.
                  I reported it with detailed replication steps, logs, and a
                  video recording, classifying it as 'Critical'. The developers
                  were able to fix it before the production release."
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">
                  How do you approach testing a new feature?
                </h4>
                <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">
                  "I start by understanding the requirements and user stories.
                  Then, I create a test plan covering functional, UI, and edge
                  cases. I execute the tests manually first to get a feel for
                  the feature, and then identify candidates for automation to
                  ensure long-term quality."
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
