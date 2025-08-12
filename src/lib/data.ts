
import type { Tester, BlogPost, Testimonial, RoadmapStep } from './types';
import { UserPlus, UploadCloud, Zap, Award, CheckCircle, Briefcase, FileText, Rocket, IndianRupee } from 'lucide-react';

export const testers: Tester[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format=fit=crop',
    dataAiHint: 'woman developer',
    skills: ['UI/UX', 'Mobile', 'Web'],
    reputation: 4.9,
    rate: 75,
    country: 'USA',
  },
  {
    id: 2,
    name: 'Bob Williams',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop',
    dataAiHint: 'man glasses',
    skills: ['Security', 'API', 'Performance'],
    reputation: 4.8,
    rate: 90,
    country: 'Canada',
  },
  {
    id: 3,
    name: 'Charlie Brown',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format=fit=crop',
    dataAiHint: 'man smiling',
    skills: ['Game Testing', 'VR/AR', 'Mobile'],
    reputation: 4.9,
    rate: 80,
    country: 'UK',
  },
  {
    id: 4,
    name: 'Diana Miller',
    avatarUrl: 'https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?q=80&w=400&auto=format&fit=crop',
    dataAiHint: 'woman smiling',
    skills: ['Web', 'Accessibility', 'UI/UX'],
    reputation: 4.7,
    rate: 65,
    country: 'Australia',
  },
  {
    id: 5,
    name: 'Ethan Garcia',
    avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=400&auto=format=fit=crop',
    dataAiHint: 'man engineer',
    skills: ['Performance', 'Backend', 'API'],
    reputation: 4.8,
    rate: 95,
    country: 'Germany',
  },
  {
    id: 6,
    name: 'Fiona Clark',
    avatarUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=400&auto=format&fit=crop',
    dataAiHint: 'woman glasses',
    skills: ['Mobile', 'iOS', 'Android'],
    reputation: 4.9,
    rate: 85,
    country: 'France',
  },
  {
    id: 7,
    name: 'George Hill',
    avatarUrl: 'https://images.unsplash.com/photo-1527982987257-d3abc440f2ba?q=80&w=400&auto=format&fit=crop',
    dataAiHint: 'man portrait',
    skills: ['Security', 'Penetration Testing'],
    reputation: 5.0,
    rate: 120,
    country: 'USA',
  },
  {
    id: 8,
    name: 'Hannah Wright',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop',
    dataAiHint: 'woman tech',
    skills: ['UI/UX', 'Figma', 'Web'],
    reputation: 4.8,
    rate: 70,
    country: 'UK',
  },
];

export const chartData = [
    { month: 'January', reports: 186, resolved: 80 },
    { month: 'February', reports: 305, resolved: 200 },
    { month: 'March', reports: 237, resolved: 120 },
    { month: 'April', reports: 273, resolved: 190 },
    { month: 'May', reports: 209, resolved: 130 },
    { month: 'June', reports: 214, resolved: 140 },
];

export const pieChartData = [
    { category: 'UI/UX', bugs: 275, fill: 'var(--color-ui)' },
    { category: 'Functional', bugs: 200, fill: 'var(--color-functional)' },
    { category: 'Performance', bugs: 187, fill: 'var(--color-performance)' },
    { category: 'Security', bugs: 125, fill: 'var(--color-security)' },
    { category: 'Other', bugs: 73, fill: 'var(--color-other)' },
];

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'mastering-automated-testing',
    title: 'Mastering Automated Testing: A Beginner\'s Guide',
    excerpt: 'Learn the fundamentals of automated testing and how it can save you time and improve your product quality.',
    content: `<p>Automated testing is a cornerstone of modern software development. By letting scripts and tools do the repetitive work, you can focus on what truly matters: building great features. This guide will walk you through the basics.</p><p>We'll cover topics like:</p><ul><li>Choosing the right automation framework</li><li>Writing your first test script</li><li>Integrating tests into your CI/CD pipeline</li><li>Analyzing test results</li></ul>`,
    author: {
      name: 'Alice Johnson',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format=fit=crop',
      dataAiHint: 'woman developer',
    },
    date: '2024-05-15',
    imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697320f64?q=80&w=600&auto=format&fit=crop',
    dataAiHint: 'code testing',
    tags: ['Automation', 'Beginner', 'CI/CD'],
  },
  {
    id: 2,
    slug: 'the-art-of-ux-testing',
    title: 'The Art of UX Testing: More Than Just Finding Bugs',
    excerpt: 'Discover how user experience (UX) testing can transform your app from functional to delightful.',
    content: `<p>UX testing goes beyond identifying functional bugs. It's about understanding how users feel when they interact with your product. A seamless UX can be the difference between a good app and a great one.</p><p>In this article, we explore:</p><ul><li>Heuristic evaluation</li><li>Usability testing methods</li><li>Gathering and interpreting user feedback</li><li>The connection between UX and business success</li></ul>`,
    author: {
      name: 'Hannah Wright',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop',
      dataAiHint: 'woman tech',
    },
    date: '2024-05-20',
    imageUrl: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=600&auto=format&fit=crop',
    dataAiHint: 'ux design',
    tags: ['UI/UX', 'Design', 'User Research'],
  },
  {
    id: 3,
    slug: 'securing-your-mobile-app',
    title: 'Securing Your Mobile App: A Tester\'s Checklist',
    excerpt: 'A comprehensive checklist for mobile app security testing to protect your users and your reputation.',
    content: `<p>Mobile security is not a feature; it's a necessity. With increasing threats, robust security testing is crucial. This checklist provides a starting point for testers to ensure an app is secure.</p><p>Key areas covered:</p><ul><li>Data storage and encryption</li><li>Network communication vulnerabilities</li><li>Authentication and authorization</li><li>Code obfuscation and anti-tampering</li></ul>`,
    author: {
      name: 'George Hill',
      avatarUrl: 'https://images.unsplash.com/photo-1527982987257-d3abc440f2ba?q=80&w=400&auto=format&fit=crop',
      dataAiHint: 'man portrait',
    },
    date: '2024-05-25',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=600&auto=format&fit=crop',
    dataAiHint: 'cyber security',
    tags: ['Security', 'Mobile', 'Checklist'],
  },
];

export const testimonials: Testimonial[] = [
  {
    name: 'Sarah Jennings',
    role: 'Lead Developer, TechNova',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    dataAiHint: 'woman portrait',
    comment: 'TestTribe has revolutionized our QA process. The real-time feedback and detailed reports are game-changers. The platform isn\'t just functional, it\'s a joy to use!',
  },
  {
    name: 'Mike Valerio',
    role: 'Indie Game Developer',
    avatar: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=400&auto=format&fit=crop',
    dataAiHint: 'man smiling',
    comment: 'Finding the right testers used to be a nightmare. The gamified marketplace made it fun and easy to connect with experienced, reliable people. My app is better for it.',
  },
  {
    name: 'Chen Lin',
    role: 'Product Manager, Innovate Inc.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    dataAiHint: 'person glasses',
    comment: 'The dashboards are incredible. Being able to visualize our testing data with such clarity and beauty has helped us identify critical issues faster than ever before.',
  },
  {
    name: 'David Kim',
    role: 'QA Engineer, GameSphere',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    dataAiHint: 'man portrait',
    comment: 'As a tester, the gamified reputation system is fantastic. It motivates me to do my best work and get recognized for it. I\'ve gotten more high-quality projects through TestTribe than any other platform.',
  },
  {
    name: 'Maria Garcia',
    role: 'Mobile App Developer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
    dataAiHint: 'woman developer',
    comment: 'The community aspect is what sets TestTribe apart. It\'s not just a service; it\'s a network of professionals passionate about quality. The collaboration tools are excellent.',
  },
];


export const communityPathSteps: RoadmapStep[] = [
    {
        step: 1,
        icon: UserPlus,
        title: "Join the Tribe",
        description: "Create your free profile to become part of a global community of developers and testers passionate about quality. This is your passport to a world of collaborative testing.",
        details: "Time: 5 mins • Cost: Free"
    },
    {
        step: 2,
        icon: Zap,
        title: "Test to Earn Points",
        description: "Dive into the community pool and test apps from other members. For every valid bug you report, you'll earn points and build your reputation as a skilled tester.",
        details: "Est. Time: 1-2 hours per test cycle"
    },
    {
        step: 3,
        icon: UploadCloud,
        title: "Submit Your Own App",
        description: "Use the points you've earned to get your own app tested. Provide your build, and specify which areas you want the community to focus on.",
        details: "Requirement: Points earned from testing"
    },
    {
        step: 4,
        icon: Award,
        title: "Receive Diverse Feedback",
        description: "Benefit from a wide range of perspectives, devices, and usage patterns. Crowdsourced testing is invaluable for uncovering unexpected real-world bugs.",
        details: "Typical Wait: Feedback within 48 hours"
    },
     {
        step: 5,
        icon: Rocket,
        title: "Launch a Better App",
        description: "Leverage the collective intelligence of the community. Iterate on the feedback, fix the bugs, and launch a more robust and user-friendly product.",
        details: "Outcome: A community-vetted application"
    },
];

export const professionalPathSteps: RoadmapStep[] = [
    {
        step: 1,
        icon: Briefcase,
        title: "Post Your Project",
        description: "For mission-critical projects where quality is paramount. Define your project scope, objectives, and the specific testing you need, from security to performance.",
        details: "Time: 15 mins • Cost: Free to post"
    },
    {
        step: 2,
        icon: IndianRupee,
        title: "Hire a Professional",
        description: "Browse our marketplace of elite, vetted QA professionals. Review profiles, skills, and ratings to hire the perfect expert for your project's unique needs.",
        details: "Cost: Starts at ₹999 per project"
    },
    {
        step: 3,
        icon: FileText,
        title: "Receive Expert Reports",
        description: "Your pro tester delivers comprehensive, actionable reports. Expect detailed replication steps, logs, and screenshots for every bug found.",
        details: "Cycle: 3-14 day projects available"
    },
    {
        step: 4,
        icon: CheckCircle,
        title: "Collaborate & Verify",
        description: "Communicate directly with your tester to clarify issues. After you push fixes, the tester verifies them to ensure they're resolved and haven't introduced regressions.",
        details: "Benefit: Guaranteed quality assurance"
    },
     {
        step: 5,
        icon: Rocket,
        title: "Launch with Confidence",
        description: "Go to market with the ultimate assurance of quality. Your professionally audited app is ready for prime time, backed by a 'TestTribe Certified' final report.",
        details: "Outcome: A production-ready, flawless app"
    }
];
