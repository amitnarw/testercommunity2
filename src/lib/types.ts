
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
}

export type FaqItem = {
    question: string;
    answer: string;
}
