
import type { LucideIcon } from 'lucide-react';

export type Tester = {
  id: number;
  name: string;
  avatarUrl: string;
  dataAiHint?: string;
  skills: string[];
  reputation: number;
  rate: number;
  country: string;
};

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
