
import type { Tester, BlogPost, Testimonial, RoadmapStep, UserProfileData, ProcessStep } from './types';
import { Users, Globe, FileCheck, Power } from 'lucide-react';

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
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format=fit=crop',
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
    avatarUrl: 'https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?q=80&w=400&auto=format=fit=crop',
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
    avatarUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=400&auto=format=fit=crop',
    dataAiHint: 'woman glasses',
    skills: ['Mobile', 'iOS', 'Android'],
    reputation: 4.9,
    rate: 85,
    country: 'France',
  },
  {
    id: 7,
    name: 'George Hill',
    avatarUrl: 'https://images.unsplash.com/photo-1527982987257-d3abc440f2ba?q=80&w=400&auto=format=fit=crop',
    dataAiHint: 'man portrait',
    skills: ['Security', 'Penetration Testing'],
    reputation: 5.0,
    rate: 120,
    country: 'USA',
  },
  {
    id: 8,
    name: 'Hannah Wright',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format=fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697320f64?q=80&w=600&auto=format=fit=crop',
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
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format=fit=crop',
      dataAiHint: 'woman tech',
    },
    date: '2024-05-20',
    imageUrl: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=600&auto=format=fit=crop',
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
      avatarUrl: 'https://images.unsplash.com/photo-1527982987257-d3abc440f2ba?q=80&w=400&auto=format=fit=crop',
      dataAiHint: 'man portrait',
    },
    date: '2024-05-25',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=600&auto=format=fit=crop',
    dataAiHint: 'cyber security',
    tags: ['Security', 'Mobile', 'Checklist'],
  },
];

export const testimonials: Testimonial[] = [
  {
    name: 'Sarah Jennings',
    role: 'Lead Developer, TechNova',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format=fit=crop',
    dataAiHint: 'woman portrait',
    comment: 'TestTribe has revolutionized our QA process. The real-time feedback and detailed reports are game-changers. The platform isn\'t just functional, it\'s a joy to use!',
  },
  {
    name: 'Mike Valerio',
    role: 'Indie Game Developer',
    avatar: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=400&auto=format=fit=crop',
    dataAiHint: 'man smiling',
    comment: 'Finding the right testers used to be a nightmare. The gamified marketplace made it fun and easy to connect with experienced, reliable people. My app is better for it.',
  },
  {
    name: 'Chen Lin',
    role: 'Product Manager, Innovate Inc.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format=fit=crop',
    dataAiHint: 'person glasses',
    comment: 'The dashboards are incredible. Being able to visualize our testing data with such clarity and beauty has helped us identify critical issues faster than ever before.',
  },
  {
    name: 'David Kim',
    role: 'QA Engineer, GameSphere',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format=fit=crop',
    dataAiHint: 'man portrait',
    comment: 'As a tester, the gamified reputation system is fantastic. It motivates me to do my best work and get recognized for it. I\'ve gotten more high-quality projects through TestTribe than any other platform.',
  },
  {
    name: 'Maria Garcia',
    role: 'Mobile App Developer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format=fit=crop',
    dataAiHint: 'woman developer',
    comment: 'The community aspect is what sets TestTribe apart. It\'s not just a service; it\'s a network of professionals passionate about quality. The collaboration tools are excellent.',
  },
];


export const communityPathSteps: RoadmapStep[] = [
    {
        step: 1,
        title: "Join & Contribute",
        description: "Sign up and become a vital part of a global community. Earn points and reputation by testing apps for fellow developers, providing valuable feedback on your real devices.",
        badgeText: "Time: 5 Mins • Cost: Free",
        details: [
            { title: "Profile Creation", description: "Quickly set up your profile to showcase your devices and interests." },
            { title: "Points System", description: "Earn points for every valid bug you find. More severe bugs earn more points." },
            { title: "Reputation Building", description: "Quality contributions increase your reputation, unlocking more opportunities." },
            { title: "Diverse Projects", description: "Access a wide variety of apps and games to test." },
        ]
    },
    {
        step: 2,
        title: "Submit Your App",
        description: "Ready for feedback? Use your earned points to submit your own app. Define your testing goals and let the community put your creation through its paces.",
        badgeText: "Requirement: Points Earned",
        details: [
            { title: "Project Setup", description: "Easily create a project, upload your build, and write testing instructions." },
            { title: "Point Budget", description: "Allocate your earned points to control the amount of testing you receive." },
            { title: "Crowdsourced Power", description: "Leverage a vast array of devices, OS versions, and user perspectives." },
            { title: "Real-World Conditions", description: "Get feedback based on real-world usage, not sterile lab environments." },
        ]
    },
    {
        step: 3,
        title: "Analyze Feedback",
        description: "Watch as detailed reports from the community flow into your dashboard in real-time. Triage bugs, gain insights, and understand how users truly interact with your app.",
        badgeText: "Typical: Feedback within 48 hours",
        details: [
            { title: "Live Dashboard", description: "Track incoming reports, view device stats, and monitor progress." },
            { title: "Detailed Reports", description: "Each report includes steps, screenshots, and device logs for easy debugging." },
            { title: "Direct Communication", description: "Collaborate with testers to clarify findings and ask for more details." },
            { title: "Video Evidence", description: "Testers can attach video recordings of the bugs they find." },
        ]
    },
    {
        step: 4,
        title: "Iterate & Improve",
        description: "Armed with actionable feedback, you can now efficiently squash bugs, refine your UX, and enhance performance. Upload new builds for the community to verify your fixes.",
        badgeText: "Cycle: Continuous",
        details: [
            { title: "Bug Prioritization", description: "Use the detailed feedback to prioritize the most critical fixes." },
            { title: "Verification Testing", description: "Submit patched builds to confirm that issues are resolved." },
            { title: "Community Recognition", description: "Reward helpful testers with praise and bonus points." },
            { title: "Ship with Confidence", description: "Release updates knowing your app has been vetted by a diverse user base." },
        ]
    },
];

export const professionalPathSteps: RoadmapStep[] = [
    {
        step: 1,
        title: "Define Your Mission",
        description: "For mission-critical projects, precision is key. Create a detailed test plan, outlining your objectives, target devices, and the specific expertise you require.",
        badgeText: "Time: 15 Mins • Cost: Free to post",
        details: [
            { title: "Project Scoping", description: "Clearly define what needs to be tested, from user flows to API endpoints." },
            { title: "Tester Requirements", description: "Specify skills like 'Security Auditing' or 'Performance Bottlenecking'." },
            { title: "Budget Options", description: "Set a fixed price for the project or invite testers to bid with hourly rates." },
            { title: "Secure Posting", description: "Your project is posted confidentially to our vetted professional marketplace." },
        ]
    },
    {
        step: 2,
        title: "Assemble Your Elite Squad",
        description: "Browse our marketplace of world-class QA professionals. Review their profiles, work history, and client feedback to hire the perfect expert for your project.",
        badgeText: "Cost: Starts at ₹999",
        details: [
            { title: "Advanced Filtering", description: "Filter testers by skills, country, language, and specific device ownership." },
            { title: "Verified Credentials", description: "All professional testers undergo a rigourous vetting and verification process." },
            { title: "Direct Negotiation", description: "Interview and negotiate terms directly on our secure platform." },
            { title: "Milestone Funding", description: "Securely fund the project milestone, with payment released upon completion." },
        ]
    },
    {
        step: 3,
        title: "Execute the Test Plan",
        description: "Your hired professional executes the test plan with precision, employing structured methodologies to provide comprehensive, actionable reports.",
        badgeText: "Cycle: 3-14 day projects",
        details: [
            { title: "Structured Testing", description: "Professionals follow your test cases and perform exploratory testing." },
            { title: "Comprehensive Reports", description: "Receive executive summaries and detailed bug reports with logs." },
            { title: "Test Case Validation", description: "Get a full report on which test cases passed, failed, or were blocked." },
            { title: "Daily Stand-ups", description: "Receive regular progress updates from your dedicated tester." },
        ]
    },
    {
        step: 4,
        title: "Launch with Certainty",
        description: "Collaborate on fixes and have the tester perform rigourous regression testing to ensure absolute quality. Approve the final milestone and launch your flawless app to the world.",
        badgeText: "Benefit: Guaranteed Quality",
        details: [
            { title: "Seamless Collaboration", description: "Use our platform to provide new builds and communicate on fixes." },
            { title: "Regression Testing", description: "The pro tester ensures your fixes haven't introduced new problems." },
            { title: "Final Sign-off", description: "Receive a final quality assurance report before you ship." },
            { title: "Secure Payment Release", description: "Approve the final milestone to release the tester." },
        ]
    }
];

export const demoUser: UserProfileData = {
    role: 'product_manager',
    companySize: '11-50',
    primaryGoal: 'hire_testers',
    monthlyBudget: '500+',
};

export const processSteps: ProcessStep[] = [
    { 
        icon: <Users className="w-5 h-5" />, 
        title: "Add Testers Group", 
        detailedDescription: `Navigate to your app's testing section and add our Google Group to enable our testers to access your app for the 14-day testing period.
        Add this Google Group:
        testers-community@googlegroups.com`,
        imageUrl: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=600&auto=format=fit=crop",
        dataAiHint: "team collaboration"
    },
    { 
        icon: <Globe className="w-5 h-5" />, 
        title: "Enable Global Testing", 
        detailedDescription: "Expand your app's reach by selecting all countries. This ensures our international team of testers can participate in your app testing.",
        imageUrl: "https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=600&auto=format=fit=crop",
        dataAiHint: "world map data"
    },
    { 
        icon: <FileCheck className="w-5 h-5" />, 
        title: "Submit for Review", 
        detailedDescription: "Once you've configured the testing settings, submit your changes to Google Play for review. This process is usually very quick.",
        imageUrl: "https://images.unsplash.com/photo-1584984792203-12a52a355642?q=80&w=600&auto=format=fit=crop",
        dataAiHint: "checklist document"
     },
    { 
        icon: <Power className="w-5 h-5" />, 
        title: "Activate Testing", 
        detailedDescription: "After Google approves your changes, publish them to activate the testing track and begin the 14-day testing period with our team.",
        imageUrl: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?q=80&w=600&auto=format=fit=crop",
        dataAiHint: "scientist laboratory"
    },
];
