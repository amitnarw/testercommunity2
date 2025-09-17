

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
    totalDays: number;
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
    severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'N/A';
    status: 'New' | 'In Progress' | 'Resolved' | 'Closed';
    comment: string;
    date: string;
    screenshot?: string | null;
}

export type Project = {
  id: number;
  name: string;
  packageName: string;
  icon: string;
  dataAiHint?: string;
  category: string;
  status: "In Testing" | "Completed" | "Archived" | "In Review" | "Draft" | "Rejected";
  testersStarted: number;
  testersCompleted: number;
  totalDays: number;
  avgTestersPerDay: number;
  startedFrom: string;
  description: string;
  testingInstructions: string;
  androidVersion: string;
  pointsCost: number;
  crashFreeRate: number;
  feedbackBreakdown: {
    total: number;
    critical: number;
    high: number;
    low: number;
  };
  performanceMetrics: {
    avgStartupTime: string;
    frozenFrames: string;
  };
  deviceCoverage: {
    device: string;
    testers: number;
  }[];
  osCoverage: {
    version: string;
    testers: number;
  }[];
  topGeographies: {
    country: string;
    testers: number;
    flag: string;
  }[];
  feedback: ProjectFeedback[];
  chartData: { date: string; bugs: number }[];
  reviewNotes?: string;
}

export type SubmittedFeedback = {
  id: number;
  type: 'Bug' | 'Suggestion' | 'Praise';
  comment: string;
  screenshot: string | null;
}
    

    

    
