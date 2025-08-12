
import type { Tester, BlogPost, Testimonial, RoadmapStep } from './types';
import { UserPlus, UploadCloud, Zap, Award, CheckCircle, Briefcase, FileText, Rocket, IndianRupee } from 'lucide-react';

export const testers: Tester[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
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
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
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
    avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=400&auto=format&fit=crop',
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
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
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
        icon: UserPlus,
        title: "Join the Tribe",
        description: "Sign up for free to create your profile. This is your passport to a world of collaborative testing where you can both give and receive valuable feedback.",
        details: "Time: 5 mins • Cost: Free"
    },
    {
        icon: Zap,
        title: "Test to Earn",
        description: "Explore apps submitted by other community members. Find bugs, submit detailed reports, and earn points for every valid issue you uncover. Build your reputation and skills.",
        details: "Time: 1-2 hours per cycle"
    },
    {
        icon: UploadCloud,
        title: "Submit Your App",
        description: "Once you've earned points, spend them to get your own app tested. Provide details about your app and specify what kind of feedback you're looking for.",
        details: "Wait: Feedback within 48 hours"
    },
    {
        icon: Award,
        title: "Receive Community Feedback",
        description: "Get diverse feedback from a wide range of devices and user perspectives. This crowdsourced approach is invaluable for uncovering unexpected bugs and usability issues.",
        details: "Outcome: Crowdsourced QA reports"
    },
     {
        icon: Rocket,
        title: "Launch with Community Support",
        description: "Use the collective feedback to improve your app. Iterate based on the community's findings and launch a more robust and user-friendly product.",
        details: "Benefit: A battle-tested app"
    },
];

export const professionalPathSteps: RoadmapStep[] = [
    {
        icon: Briefcase,
        title: "Post Your Project",
        description: "Define your project scope and testing requirements. Outline your objectives, whether it's for UI/UX, security, performance, or general quality assurance.",
        details: "Time: 15 mins"
    },
    {
        icon: IndianRupee,
        title: "Hire a Professional",
        description: "Browse our curated marketplace of vetted QA professionals. Choose a tester based on their skills, experience, and ratings to ensure a perfect fit for your project.",
        details: "Cost: Starts at ₹999"
    },
    {
        icon: FileText,
        title: "Receive Expert Reports",
        description: "Your hired tester will conduct a thorough review of your app, providing detailed, actionable bug reports complete with logs, screenshots, and clear replication steps.",
        details: "Cycle: 7-14 day projects"
    },
    {
        icon: CheckCircle,
        title: "Collaborate & Verify",
        description: "Communicate directly with your tester to clarify issues. Once you've implemented fixes, the tester will verify them to ensure they are resolved correctly.",
        details: "Benefit: Guaranteed quality"
    },
     {
        icon: Rocket,
        title: "Launch with Confidence",
        description: "With a professionally audited app and a comprehensive final report, you can launch to the market with the ultimate assurance of quality and a 'TestTribe Certified' badge.",
        details: "Outcome: A production-ready app"
    }
];
