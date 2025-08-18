
import type { BlogPost, Testimonial, RoadmapStep, UserProfileData, ProcessStep, CommunityApp, PointsPackage, FaqItem, Notification } from './types';

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
    comment: 'inTesters has revolutionized our QA process. The real-time feedback and detailed reports are game-changers. The platform isn\'t just functional, it\'s a joy to use!',
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
    comment: 'As a tester, the gamified reputation system is fantastic. It motivates me to do my best work and get recognized for it. I\'ve gotten more high-quality projects through inTesters than any other platform.',
  },
  {
    name: 'Maria Garcia',
    role: 'Mobile App Developer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format=fit=crop',
    dataAiHint: 'woman developer',
    comment: 'The community aspect is what sets inTesters apart. It\'s not just a service; it\'s a network of professionals passionate about quality. The collaboration tools are excellent.',
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
        title: "Purchase Points",
        description: "Fast-track your testing by purchasing a points package. This is your currency for all professional services on the platform, allowing you to skip community testing entirely.",
        badgeText: "Time: 2 Mins • Cost: Varies",
        details: [
            { title: "Flexible Packages", description: "Choose a points package that fits your project's budget and scope." },
            { title: "Instant Access", description: "No need to earn points; get started with professional testing right away." },
            { title: "Secure Payment", description: "All transactions are handled securely through our trusted payment processor." },
            { title: "Points Never Expire", description: "Your purchased points are yours to use whenever you're ready." },
        ]
    },
    {
        step: 2,
        title: "Submit & Forget",
        description: "Submit your app through the Developer Dashboard. Provide us with your build and instructions, and we'll handle the rest. Our project managers take over from here.",
        badgeText: "Requirement: Points Purchased",
        details: [
            { title: "Simple Submission", description: "A straightforward form to provide your app and testing requirements." },
            { title: "Managed Process", description: "Our team assigns the best-suited professional testers to your project." },
            { title: "Confidentiality", description: "Your project is handled under strict NDA by our vetted team." },
            { title: "Hassle-Free", description: "Focus on development while we manage the entire 14-day testing cycle." },
        ]
    },
    {
        step: 3,
        title: "Receive Pro Reports",
        description: "Our professional testers deliver structured, high-quality reports. Expect clear, actionable, and consistent feedback that makes debugging a breeze.",
        badgeText: "Typical: Daily Summaries",
        details: [
            { title: "Standardized Reports", description: "All feedback follows a consistent, easy-to-digest format." },
            { title: "Expert Analysis", description: "Our testers provide insights that go beyond simple bug reports." },
            { title: "Consolidated Feedback", description: "Receive daily or weekly summary reports from our project manager." },
            { title: "Guaranteed Coverage", description: "We ensure all specified areas of your app are thoroughly tested." },
        ]
    },
    {
        step: 4,
        title: "Launch with Certainty",
        description: "With the 14-day/12-tester requirement met and your app polished by experts, you can submit to the Google Play Store with the highest degree of confidence.",
        badgeText: "Cycle: Defined & Completed",
        details: [
            { title: "Official Confirmation", description: "Receive an official completion report for your records." },
            { title: "Peace of Mind", description: "Know that your app has passed a professional-grade QA check." },
            { title: "Faster Time-to-Market", description: "Avoid delays by ensuring testing requirements are met correctly the first time." },
            { title: "Ongoing Support", description: "Our team is available for any follow-up questions or re-testing needs." },
        ]
    },
];

export const demoUser: UserProfileData = {
    role: 'product_manager',
    companySize: '11-50',
    primaryGoal: 'hire_testers',
    monthlyBudget: '500+',
};

export const processSteps: ProcessStep[] = [
    { 
        title: "Grant Our Testers Access", 
        imageUrl: "/add-app-1.webp",
        dataAiHint: "team collaboration"
    },
    { 
        title: "Enable Global Reach", 
        imageUrl: "/add-app-2.webp",
        dataAiHint: "world map data"
    },
    { 
        title: "Submit for Google's Review", 
        imageUrl: "/add-app-3.webp",
        dataAiHint: "checklist document"
     },
    { 
        title: "Activate Your Test Cycle", 
        imageUrl: "/add-app-4.webp",
        dataAiHint: "scientist laboratory"
    },
];

export const communityApps: CommunityApp[] = [
    {
        id: 1,
        name: 'Finance Tracker',
        icon: 'https://placehold.co/128x128.png',
        dataAiHint: 'finance app icon',
        category: 'Productivity',
        shortDescription: 'A simple way to track your income and expenses on the go.',
        points: 100,
        androidVersion: '10+',
        estimatedTime: '15-20 min',
        playStoreUrl: '#',
        screenshots: [
            { url: 'https://placehold.co/400x800.png', alt: 'Screenshot 1', dataAiHint: 'app screenshot' },
            { url: 'https://placehold.co/400x800.png', alt: 'Screenshot 2', dataAiHint: 'app interface' }
        ],
        testingInstructions: 'Please focus on the new budgeting feature. Try creating a monthly budget, adding several expenses, and see if the summary view is correct. Check for any visual glitches or crashes.',
        status: 'ongoing',
        progress: 60,
    },
    {
        id: 2,
        name: 'Pixel Adventure',
        icon: 'https://placehold.co/128x128.png',
        dataAiHint: 'pixel art game',
        category: 'Games',
        shortDescription: 'A retro-style platformer with challenging levels and epic boss fights.',
        points: 75,
        androidVersion: '9+',
        estimatedTime: '20-30 min',
        playStoreUrl: '#',
        screenshots: [
            { url: 'https://placehold.co/800x400.png', alt: 'Screenshot 1', dataAiHint: 'gameplay screenshot' },
            { url: 'https://placehold.co/800x400.png', alt: 'Screenshot 2', dataAiHint: 'game level' }
        ],
        testingInstructions: 'Play through the first three levels. We are looking for feedback on game difficulty, control responsiveness, and any performance issues on older devices.',
        status: 'completed',
        completedDate: '2024-05-28',
    },
     {
        id: 3,
        name: 'Weatherly',
        icon: 'https://placehold.co/128x128.png',
        dataAiHint: 'weather app icon',
        category: 'Utilities',
        shortDescription: 'Clean, simple, and accurate weather forecasts at your fingertips.',
        points: 50,
        androidVersion: '11+',
        estimatedTime: '5-10 min',
        playStoreUrl: '#',
        screenshots: [
            { url: 'https://placehold.co/400x800.png', alt: 'Screenshot 1', dataAiHint: 'weather forecast' },
            { url: 'https://placehold.co/400x800.png', alt: 'Screenshot 2', dataAiHint: 'weather details' }
        ],
        testingInstructions: 'Check the weather for your current location and at least two other cities. Please verify if the hourly forecast seems accurate and report any UI issues.',
        status: 'available',
    },
    {
        id: 4,
        name: 'Connect Social',
        icon: 'https://placehold.co/128x128.png',
        dataAiHint: 'social network',
        category: 'Social',
        shortDescription: 'A new way to connect with friends and share your life moments.',
        points: 120,
        androidVersion: '11+',
        estimatedTime: '25-35 min',
        playStoreUrl: '#',
        screenshots: [
            { url: 'https://placehold.co/400x800.png', alt: 'Screenshot 1', dataAiHint: 'social feed' },
            { url: 'https://placehold.co/400x800.png', alt: 'Screenshot 2', dataAiHint: 'user profile' }
        ],
        testingInstructions: 'Test the photo upload and sharing functionality. Try adding filters and tagging friends. Report any crashes or slow performance.',
        status: 'available',
    },
    {
        id: 5,
        name: 'Galaxy Runner',
        icon: 'https://placehold.co/128x128.png',
        dataAiHint: 'space game',
        category: 'Games',
        shortDescription: 'An endless runner game set in the depths of space. Dodge asteroids and collect power-ups!',
        points: 80,
        androidVersion: '8+',
        estimatedTime: '10-15 min',
        playStoreUrl: '#',
        screenshots: [
            { url: 'https://placehold.co/800x400.png', alt: 'Screenshot 1', dataAiHint: 'space background' },
            { url: 'https://placehold.co/800x400.png', alt: 'Screenshot 2', dataAiHint: 'spaceship character' }
        ],
        testingInstructions: 'Play the game for at least 10 minutes. We are looking for feedback on the new power-ups and overall game balance.',
        status: 'available',
    },
    {
        id: 6,
        name: 'TaskMaster Pro',
        icon: 'https://placehold.co/128x128.png',
        dataAiHint: 'to-do list',
        category: 'Productivity',
        shortDescription: 'Organize your life with the most powerful to-do list and project manager.',
        points: 150,
        androidVersion: '12+',
        estimatedTime: '20-25 min',
        playStoreUrl: '#',
        screenshots: [
            { url: 'https://placehold.co/400x800.png', alt: 'Screenshot 1', dataAiHint: 'task list' },
            { url: 'https://placehold.co/400x800.png', alt: 'Screenshot 2', dataAiHint: 'project board' }
        ],
        testingInstructions: 'Create a new project, add at least 5 tasks with sub-tasks, and assign due dates. Check if reminders are working correctly.',
        status: 'available',
    },
    {
        id: 7,
        name: 'Unit Converter Ultimate',
        icon: 'https://placehold.co/128x128.png',
        dataAiHint: 'ruler calculator',
        category: 'Utilities',
        shortDescription: 'A comprehensive unit converter for all your needs, from currency to cooking.',
        points: 40,
        androidVersion: '7+',
        estimatedTime: '5-10 min',
        playStoreUrl: '#',
        screenshots: [
            { url: 'https://placehold.co/400x800.png', alt: 'Screenshot 1', dataAiHint: 'conversion screen' },
            { url: 'https://placehold.co/400x800.png', alt: 'Screenshot 2', dataAiHint: 'currency exchange' }
        ],
        testingInstructions: 'Test at least 5 different unit conversions, including currency. Verify the accuracy of the conversions.',
        status: 'available',
    },
    {
        id: 8,
        name: 'Karaoke King',
        icon: 'https://placehold.co/128x128.png',
        dataAiHint: 'microphone icon',
        category: 'Social',
        shortDescription: 'Sing your heart out and share your performances with the world.',
        points: 90,
        androidVersion: '10+',
        estimatedTime: '15-20 min',
        playStoreUrl: '#',
        screenshots: [
            { url: 'https://placehold.co/400x800.png', alt: 'Screenshot 1', dataAiHint: 'song list' },
            { url: 'https://placehold.co/400x800.png', alt: 'Screenshot 2', dataAiHint: 'recording screen' }
        ],
        testingInstructions: 'Record one song and apply a voice effect. Share it to the feed and check if it plays back correctly for others.',
        status: 'available',
    }
];

export const pointsPackages: PointsPackage[] = [
    {
        name: "Booster",
        price: 499,
        points: 500,
        description: "Perfect for a quick test cycle for a small app or feature.",
        features: ["Fund one small project", "Basic bug reports", "Community support"],
        pricePerPoint: 499 / 500
    },
    {
        name: "Accelerator",
        price: 1999,
        points: 2500,
        description: "Great for medium-sized projects or a few rounds of testing.",
        features: ["Fund multiple test cycles", "More detailed reports", "Priority in queue"],
        pricePerPoint: 1999 / 2500
    },
    {
        name: "Launchpad",
        price: 4999,
        points: 7500,
        description: "Ideal for large apps or extensive pre-launch testing.",
        features: ["Sufficient for major releases", "Highest queue priority", "Dedicated community manager"],
        pricePerPoint: 4999 / 7500
    }
];

export const pricingFaqs: FaqItem[] = [
    {
        question: "What can I use points for?",
        answer: "Points are the currency of inTesters. You use them to 'pay' community members for testing your app. The more points you offer for your project, the more attractive it is to testers, and the faster you'll likely receive feedback."
    },
    {
        question: "Do my purchased points expire?",
        answer: "No, your points never expire. You can use them whenever you're ready to start a new testing cycle for your app."
    },
    {
        question: "What's the difference between earning and buying points?",
        answer: "Earning points is free—you contribute your time and skill by testing other apps. Buying points is a shortcut that lets you fund your projects immediately without having to test other apps first. It's perfect for when you're on a tight deadline."
    },
    {
        question: "Can I get a refund on purchased points?",
        answer: "Points that have not been spent on a testing project are eligible for a refund within 14 days of purchase. Please contact our support team for assistance."
    }
];

export const notifications: Notification[] = Array.from({ length: 25 }, (_, i) => {
    const types: Notification['type'][] = ['new_test', 'feedback_received', 'test_completed', 'bug_report', 'points_awarded'];
    const type = types[i % types.length];
    const date = new Date();
    date.setDate(date.getDate() - i);

    let title = '';
    let description = '';

    switch (type) {
        case 'new_test':
            title = 'New Testing Opportunity!';
            description = 'A new app, "PhotoSnap Editor", is available for testing in the Productivity category.';
            break;
        case 'feedback_received':
            title = 'You have new feedback!';
            description = 'A tester has submitted new feedback for your project "Project Phoenix".';
            break;
        case 'test_completed':
            title = 'Test Cycle Completed';
            description = 'Congratulations! Your app "SocialConnect" has completed its 14-day test cycle.';
            break;
        case 'bug_report':
            title = 'New Bug Reported';
            description = 'A critical bug has been reported for "E-commerce Platform".';
            break;
        case 'points_awarded':
            title = `You've earned ${i % 2 === 0 ? 100 : 75} points!`;
            description = `Thanks for your feedback on "${i % 2 === 0 ? 'Finance Tracker' : 'Pixel Adventure'}". Your points have been added.`;
            break;
    }

    return {
        id: i + 1,
        title,
        description,
        date: date.toISOString(),
        type,
        read: i > 4, // Mark the first 5 as unread
    };
});
