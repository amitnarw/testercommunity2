"use client";

import { SafeImage } from "@/components/safe-image";
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
  Bug,
  CheckCircle,
  Clock,
  Star,
  Smartphone,
  XCircle,
  Search,
  AlertTriangle,
  Expand,
  X,
  PartyPopper,
  Lightbulb,
  Video,
  Camera,
  CirclePlay,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { useState, useEffect } from "react";
import type { Project } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { BackButton } from "@/components/back-button";
import { AppPagination } from "@/components/app-pagination";
import AppInfoHeader from "@/components/app-info-header";
import DeveloperInstructions from "@/components/developerInstructions";
import { SubmittedFeedback } from "@/components/dashboard/submitted-feedback";
import Confetti from "react-dom-confetti";
import { useInView } from "react-intersection-observer";
import InfoBar from "@/components/dashboard/info-bar";

const TESTERS_PER_PAGE = 10;

const getStatusConfig = (status: string) => {
  switch (status) {
    case "In Testing":
      return {
        badgeVariant: "destructive" as const,
        icon: <Clock className="w-5 h-5" />,
        color: "text-destructive",
      };
    case "Completed":
      return {
        badgeVariant: "secondary" as const,
        icon: <CheckCircle className="w-5 h-5" />,
        color: "text-green-500",
      };
    case "Rejected":
      return {
        badgeVariant: "destructive" as const,
        icon: <XCircle className="w-5 h-5" />,
        color: "text-destructive",
      };
    case "In Review":
      return {
        badgeVariant: "secondary" as const,
        icon: <Search className="w-5 h-5" />,
        color: "text-muted-foreground",
      };
    default:
      return {
        badgeVariant: "secondary" as const,
        icon: <Clock className="w-5 h-5" />,
        color: "text-muted-foreground",
      };
  }
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/80 backdrop-blur-sm p-2 rounded-lg border text-sm">
        <p className="font-bold">{`${payload[0].name}`}</p>
        <p className="text-muted-foreground">{`Testers: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const TestCompleteSection = ({
  app,
  isUnderReviewOrRejected,
}: {
  app: any;
  isUnderReviewOrRejected: boolean;
}) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  // Mock data for feedback breakdown, as it's not in the app object
  const feedbackBreakdown = {
    bugs: 3,
    suggestions: 2,
    praise: 1,
    totalTesters: 15,
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      className="grid grid-cols-2 sm:grid-cols-4 gap-2"
    >
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-green-500/20 to-green-500/10 p-6 rounded-2xl flex flex-col justify-center items-center text-center "
      >
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border-4 border-green-500/20 mb-2">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-md sm:text-lg font-bold text-green-500">
          Test Complete!
        </h2>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-1 items-center justify-center rounded-2xl overflow-hidden "
      >
        <div className="bg-gradient-to-tl from-primary/20 to-primary text-primary-foreground p-2 sm:p-5 h-full w-full flex flex-col items-center justify-center gap-1">
          <p className="text-xs">Total Testers</p>
          <p className="text-4xl sm:text-5xl font-bold">{app.testersStarted}</p>
        </div>
        <div className="bg-gradient-to-tr from-primary/20 to-primary text-primary-foreground p-2 sm:p-5 h-full w-full flex flex-col items-center justify-center gap-1">
          <p className="text-xs">Total Days</p>
          <p className="text-4xl sm:text-5xl font-bold">
            {isUnderReviewOrRejected ? 0 : app.totalDays}
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-card p-3 pt-2 rounded-2xl flex flex-col justify-between relative overflow-hidden col-span-2"
      >
        <h3 className="text-lg sm:text-xl font-semibold mb-1 bg-gradient-to-b from-primary to-primary/50 text-transparent bg-clip-text text-center">
          Feedback Breakdown
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-gradient-to-bl from-red-500/20 to-red-500/10 p-5 rounded-lg relative overflow-hidden">
            <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-45 text-red-500">
              <Bug />
            </div>
            <p className="text-xs text-muted-foreground">Bugs</p>
            <p className="text-4xl font-bold">{feedbackBreakdown.bugs}</p>
          </div>
          <div className="bg-gradient-to-bl from-yellow-500/20 to-yellow-500/10 p-5 rounded-lg relative overflow-hidden">
            <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-45 text-yellow-500">
              <Lightbulb />
            </div>
            <p className="text-xs text-muted-foreground">Suggestions</p>
            <p className="text-4xl font-bold">
              {feedbackBreakdown.suggestions}
            </p>
          </div>
          <div className="bg-gradient-to-bl from-green-500/20 to-green-500/10 p-5 rounded-lg relative overflow-hidden">
            <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-90 text-green-500">
              <PartyPopper />
            </div>
            <p className="text-xs text-muted-foreground">Praise</p>
            <p className="text-4xl font-bold">{feedbackBreakdown.praise}</p>
          </div>
          <div className="bg-gradient-to-br from-primary to-primary/50 text-primary-foreground p-5 rounded-lg">
            <p className="text-xs hidden sm:block">Average Rating</p>
            <p className="text-xs block sm:hidden">Avg. Rating</p>
            <p className="text-4xl font-bold">
              {app?.overallRating?.toFixed(1)}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function ProjectDetailsView({
  project,
  showBackButton = true,
}: {
  project: Project;
  showBackButton?: boolean;
}) {
  const [testersPage, setTestersPage] = useState(1);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [fullscreenVideo, setFullscreenVideo] = useState<string | null>(null);
  const [isConfettiActive, setConfettiActive] = useState(false);

  const { ref: confettiTriggerRef, inView: confettiInView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    if (confettiInView && project?.status === "Completed") {
      setTimeout(() => setConfettiActive(true), 300);
    }
  }, [confettiInView, project?.status]);

  const statusConfig = getStatusConfig(project.status);
  const isUnderReviewOrRejected =
    project.status === "In Review" || project.status === "Rejected";

  const totalTestersPages = Math.ceil(
    project.testers.length / TESTERS_PER_PAGE,
  );
  const testersStartIndex = (testersPage - 1) * TESTERS_PER_PAGE;
  const testersEndIndex = testersStartIndex + TESTERS_PER_PAGE;
  const currentTesters = project.testers.slice(
    testersStartIndex,
    testersEndIndex,
  );

  const screenshots = project.feedback
    .map((fb) => fb.screenshot)
    .filter(Boolean) as string[];
  const videos = project.feedback
    .map((fb) => fb.videoUrl)
    .filter(Boolean) as string[];

  const handleTestersPageChange = (page: number) => {
    if (page < 1 || page > totalTestersPages) return;
    setTestersPage(page);
  };

  const osData = project.osCoverage.map((os) => ({
    name: os.version,
    value: os.testers,
  }));
  const deviceData = project.deviceCoverage.map((d) => ({
    name: d.device,
    value: d.testers,
  }));
  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
  ];

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const feedbackBreakdown = {
    bugs: isUnderReviewOrRejected
      ? 0
      : project.feedback.filter((fb) => fb.type === "Bug").length,
    suggestions: isUnderReviewOrRejected
      ? 0
      : project.feedback.filter((fb) => fb.type === "Suggestion").length,
    praise: isUnderReviewOrRejected
      ? 0
      : project.feedback.filter((fb) => fb.type === "Praise").length,
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0f151e] min-h-screen relative">
      <div
        ref={confettiTriggerRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 z-50"
      >
        <Confetti
          active={isConfettiActive}
          config={{
            angle: 90,
            spread: 360,
            startVelocity: 40,
            elementCount: 200,
            dragFriction: 0.12,
            duration: 5000,
            stagger: 3,
            width: "10px",
            height: "10px",
            colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
          }}
        />
      </div>

      <div className="container px-4 md:px-6">
        {showBackButton && (
          <div className="sticky top-0 z-[50] pt-2 sm:pt-3 pb-4 pl-0 xl:pl-8 w-1/2">
            <BackButton href="/dashboard" />
          </div>
        )}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={pageVariants}
          className="max-w-7xl mx-auto"
        >
          <AppInfoHeader
            logo={project.icon}
            name={project.name}
            dataAiHint={project.dataAiHint}
            category={project.category}
            description={project.description}
            status={project.status}
            statusConfig={statusConfig}
          />

          {project.status === "Rejected" && project.rejectionReason && (
            <motion.section
              variants={itemVariants}
              className="bg-destructive/10 border-2 border-dashed border-destructive/10 rounded-2xl p-6 relative overflow-hidden mt-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-destructive/5 p-3 sm:bg-destructive/10 sm:p-3 rounded-full text-destructive absolute sm:static top-2 right-0 sm:top-auto sm:right-auto scale-[3] sm:scale-100">
                  <AlertTriangle className="w-8 h-8 text-destructive/20 sm:text-destructive" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-destructive dark:text-red-500">
                  {project.rejectionReason.title}
                </h2>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <p className="text-destructive/80 dark:text-red-500/80 leading-relaxed flex-1">
                  {project.rejectionReason.description}
                </p>
                {project.rejectionReason.imageUrl && (
                  <div
                    className="relative rounded-lg overflow-hidden group cursor-pointer w-full md:w-1/3"
                    onClick={() =>
                      setFullscreenImage(project?.rejectionReason?.imageUrl!)
                    }
                  >
                    <SafeImage
                      src={project.rejectionReason.imageUrl}
                      alt={project.rejectionReason.title}
                      width={600}
                      height={400}
                      className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={project.rejectionReason.dataAiHint}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Expand className="w-10 h-10 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </motion.section>
          )}

          <div
            className={`relative z-10 ${
              isUnderReviewOrRejected ? "blur-md pointer-events-none" : ""
            }`}
          >
            {project?.status !== "Completed" ? (
              <InfoBar
                project={project}
                isUnderReviewOrRejected={isUnderReviewOrRejected}
                feedbackBreakdown={feedbackBreakdown}
              />
            ) : (
              <TestCompleteSection
                app={project}
                isUnderReviewOrRejected={isUnderReviewOrRejected}
              />
            )}

            <DeveloperInstructions
              title="Instructions for Testers"
              instruction={`"${project?.testingInstructions}"`}
              mt={20}
            />

            <main className="w-full mx-auto mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <SubmittedFeedback />
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="lg:col-span-1 space-y-8"
              >
                <Card className="shadow-none h-full">
                  <CardHeader className="p-3 sm:p-6 pb-0">
                    <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                      <Smartphone className="w-5 h-5 text-primary" /> Device
                      &amp; OS Coverage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-auto sm:h-[280px] p-3 sm:p-6">
                    <div className="flex flex-col items-center">
                      <h4 className="text-sm font-semibold mb-2">OS Version</h4>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={osData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            innerRadius={40}
                            outerRadius={60}
                            dataKey="value"
                            paddingAngle={5}
                          >
                            {osData.map((entry, index) => (
                              <Cell
                                key={`cell-os-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend wrapperStyle={{ fontSize: "12px" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col items-center">
                      <h4 className="text-sm font-semibold mb-2">Devices</h4>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={deviceData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            innerRadius={40}
                            outerRadius={60}
                            dataKey="value"
                            paddingAngle={5}
                          >
                            {deviceData.map((entry, index) => (
                              <Cell
                                key={`cell-device-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend wrapperStyle={{ fontSize: "12px" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-none h-full">
                  <CardHeader className="p-3 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                      Media Gallery
                    </CardTitle>
                    <CardDescription>
                      All visual feedback submitted by testers.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 pt-0">
                    <Tabs defaultValue="screenshots">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="screenshots">
                          <Camera className="mr-2 hidden sm:block" size={15} />{" "}
                          <span className="text-xs sm:text-sm mr-1">
                            Screenshots
                          </span>{" "}
                          ({screenshots.length})
                        </TabsTrigger>
                        <TabsTrigger value="videos">
                          <Video className="mr-2 hidden sm:block" size={15} />{" "}
                          <span className="text-xs sm:text-sm mr-1">
                            Videos
                          </span>{" "}
                          ({videos.length})
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="screenshots" className="mt-4">
                        {screenshots.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {screenshots.map((url, index) => (
                              <div
                                key={index}
                                className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer"
                                onClick={() => setFullscreenImage(url)}
                              >
                                <SafeImage
                                  src={url}
                                  alt={`Screenshot ${index + 1}`}
                                  layout="fill"
                                  objectFit="cover"
                                  className="transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Expand className="w-6 h-6 text-white" />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-muted-foreground text-sm py-8">
                            No screenshots submitted yet.
                          </p>
                        )}
                      </TabsContent>
                      <TabsContent value="videos" className="mt-4">
                        {videos.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {videos.map((url, index) => (
                              <div
                                key={index}
                                className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer bg-black"
                                onClick={() => setFullscreenVideo(url)}
                              >
                                <video
                                  src={url}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <CirclePlay className="w-8 h-8 text-white" />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-muted-foreground text-sm py-8">
                            No videos submitted yet.
                          </p>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            </main>

            <motion.div
              variants={itemVariants}
              className="mt-14 bg-card sm:bg-card/0 p-3 rounded-xl"
            >
              <Card className="bg-card/0 border-0 shadow-none">
                <CardHeader className="p-0">
                  <CardTitle className="text-xl sm:text-2xl">
                    Tester &amp; Device Details
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Comprehensive information about the testers and devices in
                    your project.
                  </CardDescription>
                </CardHeader>
              </Card>
              <div className="mt-4 space-y-4 md:hidden">
                {currentTesters.length > 0 ? (
                  currentTesters.map((tester) => (
                    <Card
                      key={tester.id}
                      className="rounded-xl overflow-hidden bg-card shadow-[0_0_20px_rgba(0,0,0,0.2)] shadow-gray-100 dark:shadow-gray-900 border border-gray-100/80 dark:border-gray-900/80"
                    >
                      <CardHeader className="flex flex-row items-center gap-4 bg-secondary/50 p-3 sm:p-6">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={tester.avatar} />
                          <AvatarFallback>
                            {tester.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold">{tester.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {tester.country}
                          </p>
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="font-bold">
                            {tester.rating.toFixed(1)}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 text-sm grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[10px] text-muted-foreground">
                            Device
                          </p>
                          <p className="text-xs">{tester.device}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">
                            OS
                          </p>
                          <p className="text-xs">{tester.os}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">
                            Screen
                          </p>
                          <p className="text-xs">{tester.screenSize}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">
                            Language
                          </p>
                          <p className="text-xs">{tester.language}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">
                            RAM
                          </p>
                          <p className="text-xs">{tester.ram}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">
                            Network
                          </p>
                          <Badge
                            variant={
                              tester.network === "WiFi"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {tester.network}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No tester data available.
                  </div>
                )}
              </div>
              <div className="mt-4 rounded-xl shadow-sm bg-card overflow-hidden hidden md:block">
                <div className="overflow-x-auto grid grid-cols-1">
                  <Table>
                    <TableHeader>
                      <TableRow className="!border-b-[8px] border-[#f8fafc] dark:border-[#0f151e]">
                        <TableHead className="py-6">Tester</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Device</TableHead>
                        <TableHead>RAM</TableHead>
                        <TableHead>OS</TableHead>
                        <TableHead>Screen</TableHead>
                        <TableHead>Language</TableHead>
                        <TableHead>Network</TableHead>
                        <TableHead className="text-right">Rating</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentTesters.length > 0 ? (
                        currentTesters.map((tester) => (
                          <TableRow
                            key={tester.id}
                            className="border-b-gray-100 dark:border-b-gray-900"
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={tester.avatar} />
                                  <AvatarFallback>
                                    {tester.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">
                                  {tester.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{tester.country}</TableCell>
                            <TableCell>{tester.device}</TableCell>
                            <TableCell>{tester.ram}</TableCell>
                            <TableCell>{tester.os}</TableCell>
                            <TableCell>{tester.screenSize}</TableCell>
                            <TableCell>{tester.language}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  tester.network === "WiFi"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {tester.network}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                <span className="font-bold">
                                  {tester.rating.toFixed(1)}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={9}
                            className="text-center h-24 text-muted-foreground"
                          >
                            No tester data available for this project yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <CardContent className="p-0 mt-4">
                <AppPagination
                  currentPage={testersPage}
                  totalPages={totalTestersPages}
                  onPageChange={handleTestersPageChange}
                />
              </CardContent>
            </motion.div>
          </div>
        </motion.div>
        {fullscreenImage && (
          <div
            className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 animate-in fade-in-0"
            onClick={() => setFullscreenImage(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:text-white bg-red-500/60 hover:bg-red-500 h-12 w-12 rounded-lg z-50"
              onClick={() => setFullscreenImage(null)}
            >
              <X className="w-8 h-8" />
              <span className="sr-only">Close</span>
            </Button>
            <div className="relative w-full h-full max-w-4xl max-h-[90vh]">
              <SafeImage
                src={fullscreenImage}
                alt="Fullscreen view"
                layout="fill"
                objectFit="contain"
                className="animate-in zoom-in-95"
              />
            </div>
          </div>
        )}
        {fullscreenVideo && (
          <div
            className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 animate-in fade-in-0"
            onClick={() => setFullscreenVideo(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:text-white bg-red-500/60 hover:bg-red-500 h-12 w-12 rounded-lg z-50"
              onClick={() => setFullscreenVideo(null)}
            >
              <X className="w-8 h-8" />
              <span className="sr-only">Close</span>
            </Button>
            <div className="relative w-full max-w-4xl">
              <video controls src={fullscreenVideo} className="w-full h-auto" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
