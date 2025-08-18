
import type { ReactNode } from 'react';

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name:string;
    avatarUrl: string;
    dataAiHint?: string;
  };
  date: string;
  imageUrl: string;
  dataAiHint?: string;
  tags: string[];
};

export type Testimonial = {
  name: string;
  role: string;
  avatar: string;
  dataAiHint?: string;
  comment: string;
};

export type RoadmapDetail = {
    title: string;
    description: string;
}

export type RoadmapStep = {
    step: number;
    title:string;
    description: string;
    badgeText: string;
    details: RoadmapDetail[];
};

export type UserProfileData = {
    role: string;
    companySize: string;
    primaryGoal: string;
    monthlyBudget: string;
};

export type PointsPackage = {
    name: string;
    price: number;
    points: number;
    description: string;
    features: string[];
    pricePerPoint?: number;
};

export type ProcessStep = {
    title: string;
    imageUrl: string;
    dataAiHint: string;
};

export type CommunityApp = {
    id: number;
    name: string;
    icon: string;
    dataAiHint?: string;
    category: string;
    shortDescription: string;
    points: number;
    androidVersion: string;
    estimatedTime: string;
    playStoreUrl?: string;
    screenshots: { url: string; alt: string; dataAiHint?: string }[];
    testingInstructions: string;
    status: 'available' | 'ongoing' | 'completed';
    progress?: number;
    completedDate?: string;
}

export type FaqItem = {
    question: string;
    answer: string;
}

export type Notification = {
    id: number;
    title: string;
    description: string;
    date: string;
    type: 'new_test' | 'feedback_received' | 'test_completed' | 'bug_report' | 'points_awarded';
    read: boolean;
}

export type ProjectFeedback = {
    id: number;
    tester: string;
    type: 'Bug' | 'Suggestion' | 'Praise';
    comment: string;
    date: string;
}

export type Project = {
  id: number;
  name: string;
  packageName: string;
  icon: string;
  dataAiHint?: string;
  status: "In Testing" | "Completed" | "Archived";
  testersStarted: number;
  testersCompleted: number;
  totalDays: number;
  avgTestersPerDay: number;
  startedFrom: string;
  description: string;
  crashFreeRate: number;
  topBugs: { type: string; count: number }[];
  feedback: ProjectFeedback[];
  chartData: { date: string; bugs: number }[];
}
