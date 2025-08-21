
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
        name: 'Todoist',
        icon: 'https://play-lh.googleusercontent.com/99w5-oJ4Cw_Hq3-Nb56H-sP2vY1J5K5YpAFz5aZgDtb3e6nL-CX_w4_4Y_2I5p003w=w240-h480-rw',
        dataAiHint: 'task list icon',
        category: 'Productivity',
        shortDescription: 'The #1 to-do list and task manager to organize your work and life.',
        points: 100,
        androidVersion: '10+',
        estimatedTime: '15-20 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.todoist',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/lca2y0fOJPf2p1mIe6ms_J7XyPOtqgL-5u1mbt5_2Ml0ikLw1D-0g0N23sC2-XWFLg=w526-h296-rw', alt: 'Todoist Screenshot 1', dataAiHint: 'task list interface' },
            { url: 'https://play-lh.googleusercontent.com/v_g_ryH0Tsoi3mH-Bgy_nF9s0x5n4sgkE7n_03e-i9V_Kx86pG2Z-vnsyBvS-a3f2w=w526-h296-rw', alt: 'Todoist Screenshot 2', dataAiHint: 'project board' }
        ],
        testingInstructions: 'Please focus on the new team collaboration feature. Try creating a project, inviting a team member, and assigning a task. Check for notification accuracy and any sync issues.',
        status: 'ongoing',
        progress: 60,
    },
    {
        id: 2,
        name: 'Brawl Stars',
        icon: 'https://play-lh.googleusercontent.com/algsmuhitlyCU_Y2_1l2Y3-pGg2uM8LTrE8G2aB-4C-Y00sR_Bof8omwbig3xV2Wabk=w240-h480-rw',
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
        icon: 'https://play-lh.googleusercontent.com/U03_StX1YhEt2Hi-gEY53nLwYt6-mRglvT5Y3j7IJCg3nEJOa2v2-s24hB3wLgq_jA=w240-h480-rw',
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
        icon: 'https://play-lh.googleusercontent.com/J8k5q78xv4R8SmiMhOE2i38B99qQJgHjX9gH2e_S-c26w1aO3xV3T0l_DPDXJ2c=w240-h480-rw',
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
        icon: 'https://play-lh.googleusercontent.com/H9jdtLqCj9Js-2f_2224omx1Z-G0qf_9M2i3k2i42bTfG2Cu2T1HAm5S-v4_eA=w240-h480-rw',
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
        icon: 'https://play-lh.googleusercontent.com/9YA6bSrgj1ZNDsJ99aYqlVd-24o7jF0smV51T-I5CMEo90hG2pT0g1Ih_HwzJ-ggEg=w240-h480-rw',
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
        icon: 'https://play-lh.googleusercontent.com/MmLHNN4_w_n_iwybVv5l_2n2tLg3yN6cI4z8Lg2j_X5_3eY2-0W-l_sR_S-G=w240-h480-rw',
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
        icon: 'https://play-lh.googleusercontent.com/cShys-AmJ93dB0SV8kE6Fl5e4MbZJp25DILYfxNQuYFobIm9SRAlSwOO7sqcUY5U64w=w240-h480-rw',
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
      icon: "https://play-lh.googleusercontent.com/3_f3P-6o76y_R3IMSvEAnwe0-3-U9d_AFbTJSbifHCr20NlT0vj1V-r8-aUEg2z_4A=w240-h480-rw",
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
      icon: "https://play-lh.googleusercontent.com/y5NkHwARz7i_n1s-9X4h8gADg5y-2i24-cgJjDL1-hVIgJIL1L8m-98Yy18h-h2xUoM=w240-h480-rw",
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
      icon: "https://play-lh.googleusercontent.com/lV1itd-iif4I-6w0l29-03csI0QYpY9b0Kj3o3F-4z7cwsI6K20rZkOY0pIUNeAABg=w240-h480-rw",
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
      icon: "https://play-lh.googleusercontent.com/s_2334grImpi1J5Wr1p9s-0x2w9p50kNOu5Mw0YJcsW0Y2DO5ZasifL25sB2ORWBxQ=w240-h480-rw",
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
      id: 4,
      name: "Google Wallet",
      packageName: "com.google.android.apps.walletnfcrel",
      icon: "https://play-lh.googleusercontent.com/PymMg-2X7d-l-N-3lofsH_bGOJ2k8Cj-hM2WJp-5K2z-MIs-2-X91wB29-o7n_EwYg=w240-h480-rw",
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
      icon: "https://play-lh.googleusercontent.com/y4__fJ8K9y4l_G6LSb0s-1hsvNBb8XJ3vrf_f3i5mYp2l3gH2-Sj-cs-2KFaGq4bGA=w240-h480-rw",
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
  ]

    
