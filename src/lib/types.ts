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
    name: string;
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

export type RoadmapStep = {
    icon: LucideIcon;
    title: string;
    description: string;
    time: string;
};
