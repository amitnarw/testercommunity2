

import type { BlogPost, Testimonial, RoadmapStep, UserProfileData, ProcessStep, CommunityApp, PointsPackage, FaqItem, Notification, Project } from './types';

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
    imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=600&auto=format=fit=crop',
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
        title: "Purchase a Package",
        description: "Fast-track your testing by purchasing a test package. This gives you one full, professional test cycle, allowing you to skip community testing entirely.",
        badgeText: "Time: 2 Mins • Cost: Varies",
        details: [
            { title: "Flexible Packages", description: "Choose a package that fits your project's budget and scope." },
            { title: "Instant Access", description: "No need to earn points; get started with professional testing right away." },
            { title: "Secure Payment", description: "All transactions are handled securely through our trusted payment processor." },
            { title: "Use Anytime", description: "Your purchased packages are yours to use whenever you're ready." },
        ]
    },
    {
        step: 2,
        title: "Submit & Forget",
        description: "Submit your app through the Developer Dashboard. Provide us with your build and instructions, and we'll handle the rest. Our project managers take over from here.",
        badgeText: "Requirement: 1 Package per App",
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
        description: "With the 14-day/20-tester requirement met and your app polished by experts, you can submit to the Google Play Store with the highest degree of confidence.",
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
        name: 'Todoist',
        icon: 'https://play-lh.googleusercontent.com/GK0SwEBVqlFBpRkPjY6y_1go6E6xZzAN0Ivzfgbuf28J4TTOoOsgWnqR4oJ_RhIhsg=s96-rw',
        dataAiHint: 'task list icon',
        category: 'Productivity',
        shortDescription: 'The #1 to-do list and task manager to organize your work and life.',
        points: 100,
        androidVersion: '10+',
        estimatedTime: '15-20 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.todoist',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/c6EgFHn_tZjMLPFUYA7ugHYpHHeUA_Km0u8iIDPIapV9HvmtzSPki6CNPz9tqZJQwSg=w5120-h2880-rw', alt: 'Todoist Screenshot 1', dataAiHint: 'task list interface' },
            { url: 'https://play-lh.googleusercontent.com/5GVvBM-QT83cTK7JXF_jthPrQkyKB6QkDppBJ2_uuT13KijJa11vkbfvbxL0tHtJ5A=w5120-h2880-rw', alt: 'Todoist Screenshot 2', dataAiHint: 'project board' }
        ],
        testingInstructions: 'Please focus on the new team collaboration feature. Try creating a project, inviting a team member, and assigning a task. Check for notification accuracy and any sync issues.',
        status: 'ongoing',
        progress: 60,
    },
    {
        id: 2,
        name: 'Brawl Stars',
        icon: 'https://play-lh.googleusercontent.com/algsmuhitlyCU_Y2_1l2Y3-pGg2uM8LTrE8G2aB-4C-Y00sR_Bof8omwbig3xV2Wabk=s96-rw',
        dataAiHint: 'game character icon',
        category: 'Games',
        shortDescription: 'Fast-paced 3v3 multiplayer and battle royale made for mobile!',
        points: 75,
        androidVersion: '9+',
        estimatedTime: '20-30 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.supercell.brawlstars',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/7sL_s3G-y3xDE_d2s-n2nI_p3t0aXpW2YPTz_cKiZG9xVlM6q-Jtrw8pSC7K9s2B-3I=w526-h296-rw', alt: 'Brawl Stars Screenshot 1', dataAiHint: 'gameplay screenshot' },
            { url: 'https://play-lh.googleusercontent.com/j-rnkkrY1Aa_eJ8v0ke_c_fcaq2NBdE3zXwPqK-9pT0e-mS8UW-c-yL-VRp7VuKkfw=w526-h296-rw', alt: 'Brawl Stars Screenshot 2', dataAiHint: 'game characters' }
        ],
        testingInstructions: 'Play the new "Gem Grab" mode. We are looking for feedback on matchmaking balance, performance during intense fights, and the new Brawler\'s abilities.',
        status: 'completed',
        completedDate: '2024-05-28',
    },
     {
        id: 3,
        name: 'AccuWeather',
        icon: 'https://play-lh.googleusercontent.com/U03_StX1YhEt2Hi-gEY53nLwYt6-mRglvT5Y3j7IJCg3nEJOa2v2-s24hB3wLgq_jA=s96-rw',
        dataAiHint: 'sun cloud icon',
        category: 'Weather',
        shortDescription: 'Live weather radar & forecast, severe weather alerts, and more.',
        points: 50,
        androidVersion: '11+',
        estimatedTime: '5-10 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.accuweather.android',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/2Uoj6wreTtrVA7-qXweWJ5AczgQG6K0pW4tqjGj8T8gZ-5uFhnpNT2w_4n5TqOSAx_U=w526-h296-rw', alt: 'AccuWeather Screenshot 1', dataAiHint: 'weather map' },
            { url: 'https://play-lh.googleusercontent.com/mO24j9y7dGDAXG7a2aPAn8e1B3I4iUgNVaHj-YSg2sRurG4HeqYfK1cQO-e5C46p4A=w526-h296-rw', alt: 'AccuWeather Screenshot 2', dataAiHint: 'hourly forecast' }
        ],
        testingInstructions: 'Check the "Minutecast" feature for your current location. Please verify if the precipitation forecast is accurate and report any UI issues with the radar map.',
        status: 'available',
    },
    {
        id: 4,
        name: 'Reddit',
        icon: 'https://play-lh.googleusercontent.com/J8k5q78xv4R8SmiMhOE2i38B99qQJgHjX9gH2e_S-c26w1aO3xV3T0l_DPDXJ2c=s96-rw',
        dataAiHint: 'alien robot icon',
        category: 'Social',
        shortDescription: 'Dive into anything. News, trends, and communities on every topic.',
        points: 120,
        androidVersion: '11+',
        estimatedTime: '25-35 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.reddit.frontpage',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/yF-C9YjGEnv2Fw5iSTs25i2RjQeWBzT0kHw-v55K-w5-y3vJ4m8v-U-ok_i5XQ-K0Q=w526-h296-rw', alt: 'Reddit Screenshot 1', dataAiHint: 'social feed' },
            { url: 'https://play-lh.googleusercontent.com/1-1250bGo3x2C9m8AtbrdnrW65Gz_I37Zg0ZpM1aHJW-46tY2zB3yAI5LdykGqC-Yg=w526-h296-rw', alt: 'Reddit Screenshot 2', dataAiHint: 'community page' }
        ],
        testingInstructions: 'Test the new video player controls. Try watching several videos, scrubbing, and changing the playback speed. Report any crashes or performance issues.',
        status: 'available',
    },
    {
        id: 5,
        name: 'Subway Surfers',
        icon: 'https://play-lh.googleusercontent.com/H9jdtLqCj9Js-2f_2224omx1Z-G0qf_9M2i3k2i42bTfG2Cu2T1HAm5S-v4_eA=s96-rw',
        dataAiHint: 'boy running',
        category: 'Games',
        shortDescription: 'An endless runner game. DASH as fast as you can! DODGE the oncoming trains!',
        points: 80,
        androidVersion: '8+',
        estimatedTime: '10-15 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.kiloo.subwaysurf',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/Z5oHmW82IqVv24eXnCj2Yg_tTSS-eLw9sDNIy_j0fO2o-2_s-i0L2aiwBqg0gVb0J-0=w526-h296-rw', alt: 'Subway Surfers Screenshot 1', dataAiHint: 'game character running' },
            { url: 'https://play-lh.googleusercontent.com/hYgAn5WgfzAbq_FkX2dO9s-p0nSvsKx53aJ5rT-1oXqjMUPHhJvO1s8KzdaFARvWYw=w526-h296-rw', alt: 'Subway Surfers Screenshot 2', dataAiHint: 'gameplay obstacles' }
        ],
        testingInstructions: 'Play the game until you can afford the new "Super Sneaker" power-up. We are looking for feedback on its price balance and overall usefulness.',
        status: 'available',
    },
    {
        id: 6,
        name: 'Notion',
        icon: 'https://play-lh.googleusercontent.com/9YA6bSrgj1ZNDsJ99aYqlVd-24o7jF0smV51T-I5CMEo90hG2pT0g1Ih_HwzJ-ggEg=s96-rw',
        dataAiHint: 'letter N block',
        category: 'Productivity',
        shortDescription: 'Write, plan, and get organized. Your connected workspace for docs, wikis, and projects.',
        points: 150,
        androidVersion: '12+',
        estimatedTime: '20-25 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=notion.id',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/lM3Gg-l2b7yv017ye2a8uR4NfUdfmMAg7X5b5Zl-4nCGFcSsCqDqG5jHq2M0N8-9oQ=w526-h296-rw', alt: 'Notion Screenshot 1', dataAiHint: 'project document' },
            { url: 'https://play-lh.googleusercontent.com/d9h4-S-8a1de2M-AlK28v5rQ43JymP_c0w4WRjP6T-l5VccgL-A_M7e0_XkM-4kNaSk=w526-h296-rw', alt: 'Notion Screenshot 2', dataAiHint: 'database table view' }
        ],
        testingInstructions: 'Create a new database, add at least 5 entries with different properties (text, date, select). Test the filtering and sorting functionality.',
        status: 'available',
    },
    {
        id: 7,
        name: 'Duolingo',
        icon: 'https://play-lh.googleusercontent.com/MmLHNN4_w_n_iwybVv5l_2n2tLg3yN6cI4z8Lg2j_X5_3eY2-0W-l_sR_S-G=s96-rw',
        dataAiHint: 'green bird cartoon',
        category: 'Education',
        shortDescription: 'Learn a new language with the world’s most-downloaded education app!',
        points: 40,
        androidVersion: '7+',
        estimatedTime: '5-10 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.duolingo',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/T0bHDE7-tLh8I-tQ0bYyegx9A5vOik_1I0X4gEtB3A_GjGNRl0i9v_NHI0S3Bcw0aw=w526-h296-rw', alt: 'Duolingo Screenshot 1', dataAiHint: 'language lesson' },
            { url: 'https://play-lh.googleusercontent.com/gKjG1o_P24KRAwBw29AYU0i5w6lT5b-9bC-b-9xKkza8w0j_XvW53DNj7E4GEv44uQ=w526-h296-rw', alt: 'Duolingo Screenshot 2', dataAiHint: 'learning path' }
        ],
        testingInstructions: 'Complete one full lesson in any language. Verify that the progress is saved correctly and check for any issues with audio playback during exercises.',
        status: 'available',
    },
    {
        id: 8,
        name: 'Spotify',
        icon: 'https://play-lh.googleusercontent.com/cShys-AmJ93dB0SV8kE6Fl5e4MbZJp25DILYfxNQuYFobIm9SRAlSwOO7sqcUY5U64w=s96-rw',
        dataAiHint: 'green circle logo',
        category: 'Music',
        shortDescription: 'Listen to music, podcasts & more. Find your favorite songs.',
        points: 90,
        androidVersion: '10+',
        estimatedTime: '15-20 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.spotify.music',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/Iykqbus64sB6194sgGjfGwbq-n0Xis0Q4M2kEpM231i-j0B0s-p-sLFHv9XqLRXzCg=w526-h296-rw', alt: 'Spotify Screenshot 1', dataAiHint: 'now playing screen' },
            { url: 'https://play-lh.googleusercontent.com/u_pP86nB4h0s5n1p-D43GjH5vQaKNCnKzB4flv2r2qC3Wb_93G28-Qp-w4jG_A=w526-h296-rw', alt: 'Spotify Screenshot 2', dataAiHint: 'music playlist' }
        ],
        testingInstructions: 'Test the "Blend" feature with a friend. Create a new Blend playlist and check if it updates correctly after both of you listen to more music.',
        status: 'available',
    },
    {
        id: 9,
        name: 'Netflix',
        icon: 'https://play-lh.googleusercontent.com/TBRwjS_qfJCSj1m7zZB93FnpJM5fSpMA_wUlFDLxWAb45T9RmWROIO-wPpLpDlJyPiA=s96-rw',
        dataAiHint: 'letter N red',
        category: 'Entertainment',
        shortDescription: 'Looking for the most talked about TV shows and movies from the around the world?',
        points: 110,
        androidVersion: '8+',
        estimatedTime: '15-20 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.netflix.mediaclient',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/x0I4cQ2sTNSj-Jc-2pDDh6c_zVdn2-v-b6pG0vM9O327u4jLg-IChEh4i6B-M0s_Lg=w526-h296-rw', alt: 'Netflix Screenshot 1', dataAiHint: 'movie selection screen' },
            { url: 'https://play-lh.googleusercontent.com/Kq-pT8G_g0-LA41Z2YhMnsy-Y2x3B2i2bQJg9l48t-v-CKi9s6M43yB0y76-Lh-VNg=w526-h296-rw', alt: 'Netflix Screenshot 2', dataAiHint: 'tv show profile page' }
        ],
        testingInstructions: 'Test the download feature for offline viewing. Download a show, put your phone in airplane mode, and try to play it. Report any issues.',
        status: 'ongoing',
        progress: 30,
    },
    {
        id: 10,
        name: 'Minecraft',
        icon: 'https://play-lh.googleusercontent.com/VSwHQjcAttxsLE47RuS4PqpC4LT7lCoSjE7Hx5AW_yCxtDvcnsHH42OUAF2Bka7SXWE=s96-rw',
        dataAiHint: 'pixelated grass block',
        category: 'Games',
        shortDescription: 'Explore infinite worlds and build everything from the simplest of homes to the grandest of castles.',
        points: 150,
        androidVersion: '9+',
        estimatedTime: '30-40 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.mojang.minecraftpe',
        screenshots: [
             { url: 'https://play-lh.googleusercontent.com/y-z3djrE-9Z2U3koJ2B-JpNa5bBSAlqu1YQ3I_z3uvch0iXqS2-i5c2lTC-2hdL-Ryk=w526-h296-rw', alt: 'Minecraft Screenshot 1', dataAiHint: 'game world' },
             { url: 'https://play-lh.googleusercontent.com/3Y-o2C_2jl_BqdJptY3y-DA6iV_jfpX-pG0vO_BCoXPaO199L2c_8W2Cs-O5k0V6iQ=w526-h296-rw', alt: 'Minecraft Screenshot 2', dataAiHint: 'underwater gameplay' }
        ],
        testingInstructions: 'Join a multiplayer server and play for at least 15 minutes. We are looking for any connection issues, lag, or graphical glitches during multiplayer sessions.',
        status: 'available',
    },
    {
        id: 11,
        name: 'TikTok',
        icon: 'https://play-lh.googleusercontent.com/Y-hStYw2yJz2fHh2-StSg98M12JPEhY22I8hWzGkXn49p_lE-ccpobf3z1J5B-R-6g=s96-rw',
        dataAiHint: 'music note logo',
        category: 'Social',
        shortDescription: 'TikTok is THE destination for mobile videos. On TikTok, short-form videos are exciting, spontaneous, and genuine.',
        points: 95,
        androidVersion: '10+',
        estimatedTime: '10-15 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/M3jcFp_6m-Zg-p-v3-q2YJS2I-V_mV1nZJ-J6eTjL_zHlQ-3-k3g-p-C-G-U-L-R-g=w526-h296-rw', alt: 'TikTok Screenshot 1', dataAiHint: 'video feed interface' },
            { url: 'https://play-lh.googleusercontent.com/yv-65V-T-7-I-fL-Y-f-k-w-z-y-f-k-w-z-y-f-k-w-z-y-f-k-w-z-y-f-k-w-z-y-f-k-w-z-y-f-k=w526-h296-rw', alt: 'TikTok Screenshot 2', dataAiHint: 'video creation tools' }
        ],
        testingInstructions: 'Test the new "Stitch" feature with a video from your "For You" page. Ensure the editing tools work as expected and the final video posts correctly.',
        status: 'available',
    },
    {
        id: 12,
        name: 'Amazon Shopping',
        icon: 'https://play-lh.googleusercontent.com/m21M0_yM2RssAD2iS-0c2yqKX-K_95TcK02D3_LgODp_T9-O-2T-L-2bSOcH5m_wog=s96-rw',
        dataAiHint: 'shopping cart arrow',
        category: 'Shopping',
        shortDescription: 'Amazon Shopping offers a wide range of products at great prices.',
        points: 60,
        androidVersion: '9+',
        estimatedTime: '10-15 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.amazon.mShop.android.shopping',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/9C6ZI_4h-4Yh-3-q7j-y_m-z-p-c-v-z-p-c-v-z-p-c-v-z-p-c-v-z-p-c-v-z-p-c-v-z-p-c=w526-h296-rw', alt: 'Amazon Screenshot 1', dataAiHint: 'product page' },
            { url: 'https://play-lh.googleusercontent.com/T-c-Y-Y-Q-A-Z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c=w526-h296-rw', alt: 'Amazon Screenshot 2', dataAiHint: 'home page deals' }
        ],
        testingInstructions: 'Add three different items to your cart and proceed to the checkout page. Do not complete the purchase. Report any UI issues or calculation errors in the subtotal.',
        status: 'completed',
        completedDate: '2024-06-15',
    },
    {
        id: 13,
        name: 'Microsoft Outlook',
        icon: 'https://play-lh.googleusercontent.com/3ZTk2DdxNttV4-w-1i_5bSPQk3v1n2R2CIIO-c-iTNKs-3YSU3n8ge-2Vv2S_F41iXU=s96-rw',
        dataAiHint: 'blue letter O',
        category: 'Productivity',
        shortDescription: 'Outlook for Android is the app that helps millions of users connect all their email accounts, calendars, and files in one convenient spot.',
        points: 125,
        androidVersion: '11+',
        estimatedTime: '15-20 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.microsoft.office.outlook',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/i9dNB_2-n20t72yFGbZgGZgTGV-YvZmzX_9tY-M-R-U-p-Q-L-f-G-I-R-g=w526-h296-rw', alt: 'Outlook Screenshot 1', dataAiHint: 'email inbox' },
            { url: 'https://play-lh.googleusercontent.com/t-T-I-q-g-Y-f-k-w-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c=w526-h296-rw', alt: 'Outlook Screenshot 2', dataAiHint: 'calendar view' }
        ],
        testingInstructions: 'Test the search functionality. Search for an email by sender and then by subject. Verify that the results are accurate and load quickly.',
        status: 'available',
    },
    {
        id: 14,
        name: 'Clash of Clans',
        icon: 'https://play-lh.googleusercontent.com/LByrur1mbl5a4i2NShAZveTgivTRxrIW-2I5Z_Drcv5NvgrPQcrUTu4u_M31Updfew=s96-rw',
        dataAiHint: 'barbarian character',
        category: 'Games',
        shortDescription: 'Join millions of players worldwide as you build your village, raise a clan, and compete in epic Clan Wars!',
        points: 100,
        androidVersion: '9+',
        estimatedTime: '20-30 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.supercell.clashofclans',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/f-p-g-Y-g-X-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z=w526-h296-rw', alt: 'Clash of Clans Screenshot 1', dataAiHint: 'village base' },
            { url: 'https://play-lh.googleusercontent.com/p-c-g-Y-g-X-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c=w526-h296-rw', alt: 'Clash of Clans Screenshot 2', dataAiHint: 'battle scene' }
        ],
        testingInstructions: 'Participate in a Clan War. Attack an enemy base and check if the replay functionality works correctly. Report any visual glitches during the battle.',
        status: 'available',
    },
    {
        id: 15,
        name: 'Google Photos',
        icon: 'https://play-lh.googleusercontent.com/pZqmEG309a-32Cpfb9g7sA59oHSu2-aOf2y2d0VBAqvw3UfQf2a-5Ea6sL-G90hUvA=s96-rw',
        dataAiHint: 'pinwheel colorful',
        category: 'Photos & Video',
        shortDescription: 'Google Photos is the home for all your photos and videos, automatically organized and easy to share.',
        points: 85,
        androidVersion: '10+',
        estimatedTime: '10-15 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.google.android.apps.photos',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/v-V-I-q-g-Y-f-k-w-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c=w526-h296-rw', alt: 'Google Photos Screenshot 1', dataAiHint: 'photo gallery' },
            { url: 'https://play-lh.googleusercontent.com/y-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z=w526-h296-rw', alt: 'Google Photos Screenshot 2', dataAiHint: 'photo editing' }
        ],
        testingInstructions: 'Use the "Memories" feature. View a few memories and try to customize one by adding or removing photos. Ensure the changes are saved correctly.',
        status: 'ongoing',
        progress: 80,
    },
    {
        id: 16,
        name: 'Uber',
        icon: 'https://play-lh.googleusercontent.com/r_t2KjSAI2Hh1B3i4V2G7lD0erYx0c7Qyv2U044_y0JfeZCCDjE-1lBIv_ZlqTZnzQ=s96-rw',
        dataAiHint: 'black app icon',
        category: 'Travel & Local',
        shortDescription: 'We’re committed to your safety at Uber. We’ve established a Door-to-Door Safety Standard to help you feel safe every time you ride.',
        points: 70,
        androidVersion: '9+',
        estimatedTime: '5-10 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.ubercab',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/g-I-j-Y-g-X-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z=w526-h296-rw', alt: 'Uber Screenshot 1', dataAiHint: 'map with car' },
            { url: 'https://play-lh.googleusercontent.com/Y-g-X-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c=w526-h296-rw', alt: 'Uber Screenshot 2', dataAiHint: 'ride options' }
        ],
        testingInstructions: 'Set a destination and view the different ride options (UberX, Comfort, etc.). Do not book a ride. Report any issues with the map display or price estimation.',
        status: 'available',
    },
    {
        id: 17,
        name: 'LinkedIn',
        icon: 'https://play-lh.googleusercontent.com/kMofEFLjobZy_bCuaiDogzBcUT-dz3BBbOrIEjJ-hqOabjK8ieuevGe6wlTD15QzOqw=s96-rw',
        dataAiHint: 'in logo blue',
        category: 'Social',
        shortDescription: 'Connect with your professional network, build your career, and find your next job.',
        points: 110,
        androidVersion: '10+',
        estimatedTime: '15-20 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.linkedin.android',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/p-I-j-Y-g-X-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z=w526-h296-rw', alt: 'LinkedIn Screenshot 1', dataAiHint: 'professional profile' },
            { url: 'https://play-lh.googleusercontent.com/I-j-Y-g-X-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z=w526-h296-rw', alt: 'LinkedIn Screenshot 2', dataAiHint: 'professional network feed' }
        ],
        testingInstructions: 'Update a section of your profile (e.g., add a new skill). Check that the changes are reflected correctly across the app. Then, view a job posting and save it.',
        status: 'completed',
        completedDate: '2024-07-01',
    },
    {
        id: 18,
        name: 'Zoom',
        icon: 'https://play-lh.googleusercontent.com/X6srKxT6nK7aOJ5vT5Y8AFpaFwJ5EaD2iQRHhB1-wsbCoGaQj_32hQWbS347vj2_0g=s96-rw',
        dataAiHint: 'video camera icon',
        category: 'Business',
        shortDescription: 'Work from anywhere with a single app that combines team chat, phone, whiteboard, meetings, and more.',
        points: 90,
        androidVersion: '9+',
        estimatedTime: '10-15 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=us.zoom.videomeetings',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/I-j-Y-g-X-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z=w526-h296-rw', alt: 'Zoom Screenshot 1', dataAiHint: 'video conference call' },
            { url: 'https://play-lh.googleusercontent.com/j-Y-g-X-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c=w526-h296-rw', alt: 'Zoom Screenshot 2', dataAiHint: 'meeting schedule' }
        ],
        testingInstructions: 'Start a new meeting with only yourself. Test the virtual background feature. Ensure that the background applies correctly and there is no significant performance drop.',
        status: 'available',
    },
    {
        id: 19,
        name: 'Discord',
        icon: 'https://play-lh.googleusercontent.com/0oO5sAneb9lJP6l8c6DH4aj6f85qNpplYpBYb3sfVTqk3SziUFCLhr21wGilD-iDpy2g=s96-rw',
        dataAiHint: 'game controller logo',
        category: 'Communication',
        shortDescription: 'Discord is where you can make a home for your communities and friends. Where you can stay close and have fun over text, voice, and video.',
        points: 130,
        androidVersion: '10+',
        estimatedTime: '20-25 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.discord',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/p-I-j-Y-g-X-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z=w526-h296-rw', alt: 'Discord Screenshot 1', dataAiHint: 'chat server interface' },
            { url: 'https://play-lh.googleusercontent.com/g-X-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z=w526-h296-rw', alt: 'Discord Screenshot 2', dataAiHint: 'voice channel' }
        ],
        testingInstructions: 'Join a voice channel in a server. Test the noise suppression feature by enabling it and speaking with background noise. Report on its effectiveness.',
        status: 'available',
    },
    {
        id: 20,
        name: 'Pinterest',
        icon: 'https://play-lh.googleusercontent.com/dVsv8Hc4TOUeLFAahxR8L2jB_8vLgZETIZzXpcCktrd9ZNe0b-v_keLAo26G_7u62w=s96-rw',
        dataAiHint: 'letter P red',
        category: 'Lifestyle',
        shortDescription: 'Pinterest is the place to explore inspiration. You can: Discover new ideas, save what inspires you, shop to make them yours, share what you love.',
        points: 75,
        androidVersion: '10+',
        estimatedTime: '10-15 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.pinterest',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/g-Y-g-X-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c=w526-h296-rw', alt: 'Pinterest Screenshot 1', dataAiHint: 'image grid feed' },
            { url: 'https://play-lh.googleusercontent.com/Y-g-X-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c=w526-h296-rw', alt: 'Pinterest Screenshot 2', dataAiHint: 'pin detail view' }
        ],
        testingInstructions: 'Create a new board and save at least 5 pins to it. Test the "More ideas" section on the board to see if the suggestions are relevant.',
        status: 'available',
    },
    {
        id: 21,
        name: 'Airbnb',
        icon: 'https://play-lh.googleusercontent.com/1-hPxafOxdYpYZEOKzNIkSP43sZxMA0GvtEDHOTdnSP8VvDeAqCAMVSOIdwoWw5fMA=s96-rw',
        dataAiHint: 'pink abstract logo',
        category: 'Travel & Local',
        shortDescription: 'Book places to stay and things to do.',
        points: 100,
        androidVersion: '9+',
        estimatedTime: '15-20 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.airbnb.android',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/p-g-Y-g-X-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z=w526-h296-rw', alt: 'Airbnb Screenshot 1', dataAiHint: 'home rental listing' },
            { url: 'https://play-lh.googleusercontent.com/c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c=w526-h296-rw', alt: 'Airbnb Screenshot 2', dataAiHint: 'map view with prices' }
        ],
        testingInstructions: 'Search for a stay in any city for a future date. Apply at least 3 filters (e.g., Wi-Fi, Kitchen, Price Range) and check if the results update correctly.',
        status: 'available',
    },
    {
        id: 22,
        name: 'Microsoft OneDrive',
        icon: 'https://play-lh.googleusercontent.com/6_SbV4MV-z-Y23DcwLaGgnqG9l6F2D40pW3h3b-A-1yXN8-_B3i00eD69-T5ThsWwA=s96-rw',
        dataAiHint: 'blue cloud',
        category: 'Productivity',
        shortDescription: 'Do more on the go with Microsoft OneDrive. Get to and share your documents, photos, and other files from your Android device.',
        points: 90,
        androidVersion: '10+',
        estimatedTime: '10-15 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.microsoft.skydrive',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/t-I-j-Y-g-X-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z=w526-h296-rw', alt: 'OneDrive Screenshot 1', dataAiHint: 'file browser' },
            { url: 'https://play-lh.googleusercontent.com/I-j-Y-g-X-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z=w526-h296-rw', alt: 'OneDrive Screenshot 2', dataAiHint: 'photo view' }
        ],
        testingInstructions: 'Upload a photo to your OneDrive. Then, try to share the link to that photo with another app (e.g., messaging app). Report any issues with the sharing process.',
        status: 'ongoing',
        progress: 50,
    },
    {
        id: 23,
        name: 'Audible',
        icon: 'https://play-lh.googleusercontent.com/y3WECKV1-kOAyf22IobD9xXjLSnSgIrdh2eX6p3HhE7C2-oFp-rQBlH3G-wFsbk0Jg=s96-rw',
        dataAiHint: 'orange app icon',
        category: 'Books & Reference',
        shortDescription: 'The home of storytelling. Find your next great listen. Audiobooks, podcasts, and exclusive Originals.',
        points: 80,
        androidVersion: '9+',
        estimatedTime: '10-15 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.audible.application',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/p-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c=w526-h296-rw', alt: 'Audible Screenshot 1', dataAiHint: 'audiobook player' },
            { url: 'https://play-lh.googleusercontent.com/c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c=w526-h296-rw', alt: 'Audible Screenshot 2', dataAiHint: 'library view' }
        ],
        testingInstructions: 'Listen to a sample of any audiobook. Test the sleep timer feature by setting it for 5 minutes. Verify that the playback stops after the set time.',
        status: 'available',
    },
    {
        id: 24,
        name: 'Google Maps',
        icon: 'https://play-lh.googleusercontent.com/Kf8WTct65hFJxBUDm5E-EpYsiDoLpdqCAQMh5U421C2de1HsoHcaA4UGFd1MOVEBA9Y=s96-rw',
        dataAiHint: 'map pin icon',
        category: 'Travel & Local',
        shortDescription: 'Navigate your world faster and easier with Google Maps. Over 220 countries and territories mapped and hundreds of millions of businesses and places on the map.',
        points: 90,
        androidVersion: '9+',
        estimatedTime: '10-15 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.google.android.apps.maps',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/g-I-j-Y-g-X-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z=w526-h296-rw', alt: 'Google Maps Screenshot 1', dataAiHint: 'navigation view' },
            { url: 'https://play-lh.googleusercontent.com/I-j-Y-g-X-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z=w526-h296-rw', alt: 'Google Maps Screenshot 2', dataAiHint: 'explore places' }
        ],
        testingInstructions: 'Find directions to a location using public transit. Check if the app provides multiple route options and accurate departure times. Report any discrepancies.',
        status: 'completed',
        completedDate: '2024-07-10',
    },
    {
        id: 25,
        name: 'Twitch',
        icon: 'https://play-lh.googleusercontent.com/QLQzL-MXtxKEDlbhrQLmafUoFDOhYQjoLeJ5kfqSEEuDk-rptK_b5scLW33U32S_cAs=s96-rw',
        dataAiHint: 'purple chat bubble',
        category: 'Entertainment',
        shortDescription: 'Twitch is where millions of people come together live every day to chat, interact, and make their own entertainment together.',
        points: 115,
        androidVersion: '10+',
        estimatedTime: '15-20 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=tv.twitch.android.app',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/p-I-j-Y-g-X-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z=w526-h296-rw', alt: 'Twitch Screenshot 1', dataAiHint: 'live stream view' },
            { url: 'https://play-lh.googleusercontent.com/j-Y-g-X-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c=w526-h296-rw', alt: 'Twitch Screenshot 2', dataAiHint: 'channel page' }
        ],
        testingInstructions: 'Watch a live stream and try using Channel Points to redeem a reward. Verify that the reward activates correctly and your points balance is updated.',
        status: 'available',
    },
    {
        id: 26,
        name: 'Shazam',
        icon: 'https://play-lh.googleusercontent.com/UIWRH-4o9NnsV-G29s4cK1sg1pM2sBw7D9zV2a4R2q3joVqg4ignrYgPj2P-tujWzQ=s96-rw',
        dataAiHint: 'blue s logo',
        category: 'Music & Audio',
        shortDescription: 'Shazam will identify any song in seconds. Discover, artists, lyrics, videos & playlists, all for free.',
        points: 50,
        androidVersion: '9+',
        estimatedTime: '5-10 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.shazam.android',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/I-j-Y-g-X-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z=w526-h296-rw', alt: 'Shazam Screenshot 1', dataAiHint: 'song identification screen' },
            { url: 'https://play-lh.googleusercontent.com/j-Y-g-X-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c=w526-h296-rw', alt: 'Shazam Screenshot 2', dataAiHint: 'song details page' }
        ],
        testingInstructions: 'Identify a song by playing music from another device. After identification, check if the lyrics are available and sync correctly with the song.',
        status: 'available',
    },
    {
        id: 27,
        name: 'Telegram',
        icon: 'https://play-lh.googleusercontent.com/ZU9cSsyIJZo6Oy7HTHiEPwZg0m2vpsEJcBQCqJK__HiptDRG9ZNlueaeXzRyLxcEA_w=s96-rw',
        dataAiHint: 'paper airplane icon',
        category: 'Communication',
        shortDescription: 'Telegram is a messaging app with a focus on speed and security, it’s super-fast, simple and free.',
        points: 95,
        androidVersion: '8+',
        estimatedTime: '10-15 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=org.telegram.messenger',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/p-g-Y-g-X-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z=w526-h296-rw', alt: 'Telegram Screenshot 1', dataAiHint: 'chat interface' },
            { url: 'https://play-lh.googleusercontent.com/c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c=w526-h296-rw', alt: 'Telegram Screenshot 2', dataAiHint: 'channel view' }
        ],
        testingInstructions: 'Create a new sticker pack by uploading an image. Ensure the sticker is created successfully and can be sent in a chat.',
        status: 'ongoing',
        progress: 20,
    },
    {
        id: 28,
        name: 'Signal Private Messenger',
        icon: 'https://play-lh.googleusercontent.com/y-3mZQRqTjW23H-pbtT0601fR2c2n84QLxGvI1g0iKPlh6y3JqXAPXv2nJt-AdHywA=s96-rw',
        dataAiHint: 'blue chat bubble',
        category: 'Communication',
        shortDescription: 'Millions of people use Signal every day for free and instantaneous communication anywhere in the world.',
        points: 80,
        androidVersion: '9+',
        estimatedTime: '10-15 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=org.thoughtcrime.securesms',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/I-j-Y-g-X-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z=w526-h296-rw', alt: 'Signal Screenshot 1', dataAiHint: 'encrypted chat' },
            { url: 'https://play-lh.googleusercontent.com/j-Y-g-X-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c-v-z-c=w526-h296-rw', alt: 'Signal Screenshot 2', dataAiHint: 'group call' }
        ],
        testingInstructions: 'Send a disappearing message with a custom timer. Verify that the message disappears for both you and the recipient after the timer expires.',
        status: 'available',
    },
];

export const pointsPackages: PointsPackage[] = [
    {
        name: "Booster",
        price: 699,
        points: 1,
        description: "Perfect for a quick professional test cycle for a single app.",
        features: [
            "1 Professional Test Package", 
            "Managed by inTesters team", 
            "Priority in testing queue",
            "Direct chat with project manager",
            "Community support"
        ],
    },
    {
        name: "Accelerator",
        price: 1799,
        points: 5,
        description: "Great value for teams with multiple apps or frequent releases.",
        features: [
            "5 Professional Test Packages",
            "Managed by inTesters team", 
            "Priority in testing queue",
            "Direct chat with project manager",
            "Community support"
        ],
    },
    {
        name: "Launchpad",
        price: 2899,
        points: 10,
        description: "For agencies and enterprises needing extensive testing.",
        features: [
            "10 Professional Test Packages",
            "Managed by inTesters team", 
            "Priority in testing queue",
            "Direct chat with project manager",
            "Community support"
        ],
    }
];

export const generalFaqs: FaqItem[] = [
    {
        question: "What is inTesters?",
        answer: "inTesters is a platform designed to help Android developers meet the Google Play Store's requirement of having their app tested by at least 20 people for 14 days. We offer two paths: a free, community-driven approach and a paid, professional service."
    },
    {
        question: "Who is inTesters for?",
        answer: "inTesters is for any Android developer, from solo indie devs to large companies, who need to fulfill Google's pre-launch testing requirements quickly and efficiently."
    },
     {
        question: "How do I get started?",
        answer: "Just sign up for a free account! From there, you can choose your path. You can start testing other apps to earn points via the Community Hub, or you can purchase a package and submit your app for professional testing via the Developer Dashboard."
    }
];

export const communityFaqs: FaqItem[] = [
    {
        question: "How does the 'Community Path' work?",
        answer: "It's a reciprocal ecosystem. You test apps submitted by other community members. For each valid test you complete, you earn points. You must have enough points to submit your own app for free testing by the community."
    },
    {
        question: "Is the Community Path really free?",
        answer: "Yes, in terms of money. It requires your time and effort to test other apps, which is how you contribute to the community and earn your own testing credits (points). You cannot buy points for community testing; they must be earned."
    },
    {
        question: "What kind of feedback can I expect from the community?",
        answer: "You'll receive feedback from a diverse range of real users on real devices. This often uncovers usability issues, device-specific bugs, and general feedback that you might not find in a controlled environment."
    }
];

export const pricingFaqs: FaqItem[] = [
    {
        question: "What is a Professional Testing Package?",
        answer: "A package is what you buy to get one app fully tested by our professional, vetted QA team. It covers one complete testing cycle (14 days, 20+ testers) to meet Google's requirements. This is separate from the community points system."
    },
    {
        question: "Do my purchased packages expire?",
        answer: "No, your packages never expire. You can use them whenever you're ready to start a new professional testing cycle for an app."
    },
    {
        question: "What is the difference between packages and points?",
        answer: "Packages are purchased for the Professional Path to have our team test your app. Points are earned for free on the Community Path by testing other apps, and are used to have the community test your app. They are two separate systems."
    },
    {
        question: "Can I get a refund on purchased packages?",
        answer: "Unused packages are eligible for a refund within 14 days of purchase. Please contact our support team for assistance."
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
            description = 'A new app, "Notion", is available for testing in the Productivity category.';
            break;
        case 'feedback_received':
            title = 'You have new feedback!';
            description = 'A tester has submitted new feedback for your project "Canva".';
            break;
        case 'test_completed':
            title = 'Test Cycle Completed';
            description = 'Congratulations! Your app "Figma" has completed its 14-day test cycle.';
            break;
        case 'bug_report':
            title = 'New Bug Reported';
            description = 'A critical bug has been reported for "Slack".';
            break;
        case 'points_awarded':
            title = `You've earned ${i % 2 === 0 ? 100 : 75} points!`;
            description = `Thanks for your feedback on "${i % 2 === 0 ? 'Todoist' : 'Brawl Stars'}". Your points have been added.`;
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

const generateFeedback = (projectName: string) => {
    const feedbackTypes: ProjectFeedback['type'][] = ['Bug', 'Suggestion', 'Praise', 'Bug', 'Bug'];
    const comments = {
        'Bug': `Found a crash in ${projectName} when trying to open the settings page.`,
        'Suggestion': `It would be great if ${projectName} had a dark mode option.`,
        'Praise': `The new update for ${projectName} is fantastic! The UI is so much smoother.`
    }
    const severities: ProjectFeedback['severity'][] = ['Critical', 'Low', 'N/A', 'High', 'Medium'];
    const statuses: ProjectFeedback['status'][] = ['New', 'Closed', 'Closed', 'In Progress', 'Resolved'];

    return Array.from({ length: 15 }, (_, i) => {
        const type = feedbackTypes[i % feedbackTypes.length];
        return {
            id: i + 1,
            tester: `Tester${100 + i}`,
            type: type,
            severity: type === 'Bug' ? severities[i % severities.length] : 'N/A',
            status: statuses[i % statuses.length],
            comment: comments[type] || `Generic feedback item #${i+1}`,
            date: `2024-08-${20- (i % 10)}`
        }
    });
};

const generateChartData = (baseBugs: number) => {
    return Array.from({length: 14}, (_, i) => ({
        date: `Day ${i+1}`,
        bugs: Math.max(0, baseBugs - i * Math.floor(Math.random() * 3 + 1) + Math.floor(Math.random() * 5 - 2))
    }));
};

export const projects: Project[] = [
    {
      id: 1,
      name: "Canva",
      packageName: "com.canva.editor",
      icon: "https://play-lh.googleusercontent.com/3_f3P-6o76y_R3IMSvEAnwe0-3-U9d_AFbTJSbifHCr20NlT0vj1V-r8-aUEg2z_4A=s96-rw",
      dataAiHint: "design logo",
      status: "In Testing",
      testersStarted: 14,
      testersCompleted: 8,
      totalDays: 14,
      avgTestersPerDay: 1.2,
      startedFrom: "22 Aug 2024",
      description: "Canva makes design and video editing amazingly simple (and fun)! Create stunning designs with your photos and videos—even if you’re not a design expert!",
      crashFreeRate: 99.8,
      feedbackBreakdown: { total: 45, critical: 3, high: 12, low: 30 },
      performanceMetrics: { avgStartupTime: "350ms", frozenFrames: "0.2%" },
      deviceCoverage: [
        { device: "Google Pixel", testers: 5 },
        { device: "Samsung Galaxy", testers: 4 },
        { device: "OnePlus", testers: 3 },
        { device: "Other", testers: 2 },
      ],
      osCoverage: [
        { version: "Android 14", testers: 8 },
        { version: "Android 13", testers: 4 },
        { version: "Android 12", testers: 2 },
      ],
      topGeographies: [
          { country: "USA", testers: 4, flag: "🇺🇸" },
          { country: "India", testers: 3, flag: "🇮🇳" },
          { country: "Germany", testers: 2, flag: "🇩🇪" },
      ],
      feedback: generateFeedback("Canva"),
      chartData: generateChartData(20)
    },
    {
      id: 2,
      name: "Figma",
      packageName: "com.figma.mirror",
      icon: "https://play-lh.googleusercontent.com/y5NkHwARz7i_n1s-9X4h8gADg5y-2i24-cgJjDL1-hVIgJIL1L8m-98Yy18h-h2xUoM=s96-rw",
      dataAiHint: "geometric shapes",
      status: "In Testing",
      testersStarted: 12,
      testersCompleted: 10,
      totalDays: 10,
      avgTestersPerDay: 1.0,
      startedFrom: "15 Jul 2024",
      description: "Figma is the all-in-one design platform for teams. Brainstorm, design, and build better products—from start to finish.",
      crashFreeRate: 99.9,
      feedbackBreakdown: { total: 30, critical: 1, high: 5, low: 24 },
      performanceMetrics: { avgStartupTime: "450ms", frozenFrames: "0.1%" },
       deviceCoverage: [
        { device: "Google Pixel", testers: 3 },
        { device: "Samsung Galaxy", testers: 6 },
        { device: "Xiaomi", testers: 2 },
        { device: "Other", testers: 1 },
      ],
      osCoverage: [
        { version: "Android 14", testers: 5 },
        { version: "Android 13", testers: 6 },
        { version: "Android 12", testers: 1 },
      ],
       topGeographies: [
          { country: "Brazil", testers: 5, flag: "🇧🇷" },
          { country: "USA", testers: 3, flag: "🇺🇸" },
          { country: "Nigeria", testers: 2, flag: "🇳🇬" },
      ],
      feedback: generateFeedback("Figma"),
      chartData: generateChartData(15)
    },
    {
      id: 3,
      name: "Slack",
      packageName: "com.Slack",
      icon: "https://play-lh.googleusercontent.com/lV1itd-iif4I-6w0l29-03csI0QYpY9b0Kj3o3F-4z7cwsI6K20rZkOY0pIUNeAABg=s96-rw",
      dataAiHint: "colorful hash",
      status: "Completed",
      testersStarted: 20,
      testersCompleted: 20,
      totalDays: 14,
      avgTestersPerDay: 1.4,
      startedFrom: "01 Jun 2024",
      description: "Slack brings team communication and collaboration into one place so you can get more work done, whether you belong to a large enterprise or a small business.",
      crashFreeRate: 100,
      feedbackBreakdown: { total: 15, critical: 0, high: 2, low: 13 },
      performanceMetrics: { avgStartupTime: "250ms", frozenFrames: "0.05%" },
      deviceCoverage: [
        { device: "Google Pixel", testers: 8 },
        { device: "Samsung Galaxy", testers: 8 },
        { device: "OnePlus", testers: 4 },
      ],
      osCoverage: [
        { version: "Android 14", testers: 10 },
        { version: "Android 13", testers: 10 },
      ],
       topGeographies: [
          { country: "UK", testers: 8, flag: "🇬🇧" },
          { country: "Canada", testers: 7, flag: "🇨🇦" },
          { country: "Australia", testers: 5, flag: "🇦🇺" },
      ],
      feedback: generateFeedback("Slack"),
      chartData: generateChartData(5)
    },
     {
      id: 6,
      name: "Asana",
      packageName: "com.asana.app",
      icon: "https://play-lh.googleusercontent.com/s_2334grImpi1J5Wr1p9s-0x2w9p50kNOu5Mw0YJcsW0Y2DO5ZasifL25sB2ORWBxQ=s96-rw",
      dataAiHint: "three dots logo",
      status: "In Review",
      testersStarted: 0,
      testersCompleted: 0,
      totalDays: 0,
      avgTestersPerDay: 0,
      startedFrom: "28 Aug 2024",
      description: "Asana is the easiest way to manage team projects and your individual tasks. From the small stuff to the big picture, Asana organizes work so you and your teams are clear on what to do, why it matters, and how to get it done.",
      reviewNotes: "Initial review in progress. Checking for policy compliance and testability.",
      crashFreeRate: 100,
      feedbackBreakdown: { total: 0, critical: 0, high: 0, low: 0 },
      performanceMetrics: { avgStartupTime: "N/A", frozenFrames: "N/A" },
       deviceCoverage: [],
      osCoverage: [],
       topGeographies: [],
      feedback: [],
      chartData: []
    },
    {
      id: 7,
      name: "SoundWave",
      packageName: "com.soundwave.beta",
      icon: "https://images.unsplash.com/photo-1549492423-4002122c3954?w=50&h=50&fit=crop",
      dataAiHint: "sound wave",
      status: "Draft",
      testersStarted: 0,
      testersCompleted: 0,
      totalDays: 0,
      avgTestersPerDay: 0,
      startedFrom: "N/A",
      description: "AI-powered music creation studio. Describe a mood or a scene and let our AI generate a unique soundtrack for you.",
      reviewNotes: "Submission is incomplete.",
      crashFreeRate: 100,
      feedbackBreakdown: { total: 0, critical: 0, high: 0, low: 0 },
      performanceMetrics: { avgStartupTime: "N/A", frozenFrames: "N/A" },
       deviceCoverage: [],
      osCoverage: [],
       topGeographies: [],
      feedback: [],
      chartData: []
    },
    {
      id: 4,
      name: "Google Wallet",
      packageName: "com.google.android.apps.walletnfcrel",
      icon: "https://play-lh.googleusercontent.com/PymMg-2X7d-l-N-3lofsH_bGOJ2k8Cj-hM2WJp-5K2z-MIs-2-X91wB29-o7n_EwYg=s96-rw",
      dataAiHint: "colorful wallet",
      status: "Completed",
      testersStarted: 15,
      testersCompleted: 15,
      totalDays: 14,
      avgTestersPerDay: 1.1,
      startedFrom: "10 May 2024",
      description: "Google Wallet gives you fast, secure access to your everyday essentials. Tap to pay everywhere Google Pay is accepted, board a flight, go to a movie, and more - all with just your phone.",
      crashFreeRate: 99.95,
      feedbackBreakdown: { total: 22, critical: 2, high: 8, low: 12 },
      performanceMetrics: { avgStartupTime: "150ms", frozenFrames: "0.01%" },
       deviceCoverage: [
        { device: "Google Pixel", testers: 10 },
        { device: "Samsung Galaxy", testers: 5 },
      ],
      osCoverage: [
        { version: "Android 14", testers: 15 },
      ],
       topGeographies: [
          { country: "USA", testers: 10, flag: "🇺🇸" },
          { country: "Germany", testers: 5, flag: "🇩🇪" },
      ],
      feedback: generateFeedback("Google Wallet"),
      chartData: generateChartData(12)
    },
      {
      id: 5,
      name: "Trello",
      packageName: "com.trello",
      icon: "https://play-lh.googleusercontent.com/y4__fJ8K9y4l_G6LSb0s-1hsvNBb8XJ3vrf_f3i5mYp2l3gH2-Sj-cs-2KFaGq4bGA=s96-rw",
      dataAiHint: "blue squares",
      status: "Archived",
      testersStarted: 25,
      testersCompleted: 25,
      totalDays: 14,
      avgTestersPerDay: 1.8,
      startedFrom: "05 Apr 2024",
      description: "Trello is the visual tool that empowers your team to manage any type of project, workflow, or task tracking. Add files, checklists, or even automation: Customize it all for how your team works best.",
      crashFreeRate: 98.5,
      feedbackBreakdown: { total: 88, critical: 15, high: 40, low: 33 },
      performanceMetrics: { avgStartupTime: "600ms", frozenFrames: "1.5%" },
       deviceCoverage: [
        { device: "Google Pixel", testers: 5 },
        { device: "Samsung Galaxy", testers: 10 },
        { device: "Xiaomi", testers: 5 },
        { device: "Other", testers: 5 },
      ],
      osCoverage: [
        { version: "Android 13", testers: 10 },
        { version: "Android 12", testers: 8 },
        { version: "Android 11", testers: 7 },
      ],
       topGeographies: [
          { country: "USA", testers: 8, flag: "🇺🇸" },
          { country: "Japan", testers: 7, flag: "🇯🇵" },
          { country: "South Korea", testers: 5, flag: "🇰🇷" },
      ],
      feedback: generateFeedback("Trello"),
      chartData: generateChartData(40)
    },
    ...communityApps.map(app => {
      const isCompleted = app.status === 'completed';
      const isOngoing = app.status === 'ongoing';
      const testersCompleted = isCompleted ? 15 + (app.id % 5) : (isOngoing ? 5 + (app.id % 5) : 0);
      const testersStarted = testersCompleted + (isOngoing ? 5 : 0) + (app.status === 'available' ? 2 : 0)
      return {
        id: app.id + 100, // Use a high offset to avoid ID conflicts
        name: app.name,
        packageName: `com.example.${app.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        icon: app.icon,
        dataAiHint: app.dataAiHint,
        status: isCompleted ? "Completed" : (isOngoing ? "In Testing" : "In Review"),
        testersStarted: testersStarted,
        testersCompleted: testersCompleted,
        totalDays: 14,
        avgTestersPerDay: (testersStarted / 14),
        startedFrom: "15 Aug 2024",
        description: app.shortDescription,
        crashFreeRate: 99.5 - (app.id % 10)/10,
        feedbackBreakdown: { total: testersCompleted * 3, critical: Math.floor(testersCompleted/5), high: Math.floor(testersCompleted/3), low: testersCompleted * 2 },
        performanceMetrics: { avgStartupTime: `${300 + (app.id % 10) * 10}ms`, frozenFrames: `0.${app.id % 10}%` },
        deviceCoverage: [
          { device: "Google Pixel", testers: Math.floor(testersStarted / 2) },
          { device: "Samsung Galaxy", testers: Math.floor(testersStarted / 3) },
          { device: "Other", testers: testersStarted - Math.floor(testersStarted / 2) - Math.floor(testersStarted / 3) },
        ],
        osCoverage: [
          { version: "Android 14", testers: Math.floor(testersStarted / 2) },
          { version: "Android 13", testers: Math.floor(testersStarted / 2) },
        ],
        topGeographies: [
            { country: "USA", testers: Math.floor(testersStarted / 2), flag: "🇺🇸" },
            { country: "India", testers: Math.floor(testersStarted / 4), flag: "🇮🇳" },
            { country: "Germany", testers: Math.floor(testersStarted / 4), flag: "🇩🇪" },
        ],
        feedback: generateFeedback(app.name),
        chartData: generateChartData(testersCompleted),
        reviewNotes: app.status === 'available' ? "Pending tester availability." : undefined,
      }
    })
  ]
    



    
