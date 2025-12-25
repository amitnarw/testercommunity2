
import type { BlogPost, Testimonial, RoadmapStep, UserProfileData, ProcessStep, CommunityApp, PointsPackage, FaqItem, Notification, Project, TesterDetails } from './types';

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
    avatar: 'https://images.unsplash.com/photo-14947901083_77-be9c29b29330?q=80&w=400&auto=format=fit=crop',
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

export const demoUser: any = {
    name: 'Demo User',
    email: 'demo@example.com',
    bio: 'Just a demo user exploring the app!',
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
        totalDays: 14,
    },
    {
        id: 2,
        name: 'Brawl Stars',
        icon: 'https://play-lh.googleusercontent.com/vJkYN1DjWBfyvycAH4AipXaiqJ9i6Ug01zU-qhyFNLrhsMTElDzLNTJ_KBd4g9IKYYc=s96-rw',
        dataAiHint: 'game character icon',
        category: 'Games',
        shortDescription: 'Fast-paced 3v3 multiplayer and battle royale made for mobile!',
        points: 75,
        androidVersion: '9+',
        estimatedTime: '20-30 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.supercell.brawlstars',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/7cbF0CaotSfUmbK7UMt9NJdKP445eLN58Tf84P7qkyiS92gwnZg8A58Nkc45ZkAVOQ=w5120-h2880-rw', alt: 'Brawl Stars Screenshot 1', dataAiHint: 'gameplay screenshot' },
            { url: 'https://play-lh.googleusercontent.com/fI4YdE1laVv-hKex_etmpvr5_gSTIv9uGMua_KsFWb7lIxdGTdN82wESwewYzTt1bA=w5120-h2880-rw', alt: 'Brawl Stars Screenshot 2', dataAiHint: 'game characters' }
        ],
        testingInstructions: 'Play the new "Gem Grab" mode. We are looking for feedback on matchmaking balance, performance during intense fights, and the new Brawler\'s abilities.',
        status: 'completed',
        completedDate: '2024-05-28',
        totalDays: 16,
    },
     {
        id: 3,
        name: 'AccuWeather',
        icon: 'https://play-lh.googleusercontent.com/EgDT3XrIaJbhZjINCWsiqjzonzqve7LgAbim8kHXWgg6fZnQebqIWjE6UcGahJ6yugU=w480-h960-rw',
        dataAiHint: 'sun cloud icon',
        category: 'Weather',
        shortDescription: 'Live weather radar & forecast, severe weather alerts, and more.',
        points: 50,
        androidVersion: '11+',
        estimatedTime: '5-10 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.accuweather.android',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/OVNqxXWPyZUilt-abUeBHuML5_nrqJvFP7MTvhWS0JqIAyjUUgte7c0NKBdGakdF97JjPiGz0DgWNr05YMFkkOg=w5120-h2880-rw', alt: 'AccuWeather Screenshot 1', dataAiHint: 'weather map' },
            { url: 'https://play-lh.googleusercontent.com/iVDM63eIo8Gs74i1tD3I_oOubcxQZmapkrSQGj3UI0ECO-PoHDK7Rdicf4Ak2CK-S7Ua3EItYmnOGEZcJpi4RA=w5120-h2880-rw', alt: 'AccuWeather Screenshot 2', dataAiHint: 'hourly forecast' }
        ],
        testingInstructions: 'Check the "Minutecast" feature for your current location. Please verify if the precipitation forecast is accurate and report any UI issues with the radar map.',
        status: 'request_rejected',
        rejectionReason: 'Your account does not meet the minimum tester level required for this app.',
        totalDays: 20,
    },
    {
        id: 4,
        name: 'Reddit',
        icon: 'https://play-lh.googleusercontent.com/YlsjgA1pFEUqNaypaxE5ajushTBOt8IxVk_UEqzaXT7_n3JDgFq6KgtuE8tPBpvaCntB=w480-h960-rw',
        dataAiHint: 'alien robot icon',
        category: 'Social',
        shortDescription: 'Dive into anything. News, trends, and communities on every topic.',
        points: 120,
        androidVersion: '11+',
        estimatedTime: '25-35 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.reddit.frontpage',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/VuG8-L7VopdChWJSvh5HC_o4KZpoP_qVU_4NjsJ1KUWO1cmK2hchaZnyWEtmN38CeQ=w5120-h2880-rw', alt: 'Reddit Screenshot 1', dataAiHint: 'social feed' },
            { url: 'https://play-lh.googleusercontent.com/x7SelyleRNR8Un3SAKzpu9eKeX6tTEhZsM5EW5vxcHQG2KnM0_wmZkfa92SLwPraKFla=w5120-h2880-rw', alt: 'Reddit Screenshot 2', dataAiHint: 'community page' }
        ],
        testingInstructions: 'Test the new video player controls. Try watching several videos, scrubbing, and changing the playback speed. Report any crashes or performance issues.',
        status: 'available',
        totalDays: 14,
    },
    {
        id: 5,
        name: 'Subway Surfers',
        icon: 'https://play-lh.googleusercontent.com/x0gzuXNOIe_RISFYF9YeBI1h6Xxb7ZKFgyz0bl_nNd59turcpwrg4WOl2r_FNCzAwA=s96-rw',
        dataAiHint: 'boy running',
        category: 'Games',
        shortDescription: 'An endless runner game. DASH as fast as you can! DODGE the oncoming trains!',
        points: 80,
        androidVersion: '8+',
        estimatedTime: '10-15 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.kiloo.subwaysurf',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/MYxB6AedO95sOoYM5B3q7_DDbYAzonV_15V8tuabDEyhM9NQTmoL0y-oDA7NCnp6oMU=w1052-h592-rw', alt: 'Subway Surfers Screenshot 1', dataAiHint: 'game character running' },
            { url: 'https://play-lh.googleusercontent.com/sQPwy6UqraoYT-gL3Gvx6R0HXfEGOvKWs8buCzRLJYIyHlp9skdVwnnOcG3dwo33ChF6=w1052-h592-rw', alt: 'Subway Surfers Screenshot 2', dataAiHint: 'gameplay obstacles' }
        ],
        testingInstructions: 'Play the game until you can afford the new "Super Sneaker" power-up. We are looking for feedback on its price balance and overall usefulness.',
        status: 'available',
        totalDays: 15,
    },
    {
        id: 6,
        name: 'Notion',
        icon: 'https://play-lh.googleusercontent.com/vaxxIC1qaXOd1q1hmL7c66N-Mp4LXuQIuBZGM0dPIbwmyWcJAXbhIIZ8hNBWvar54c_j=w480-h960-rw',
        dataAiHint: 'letter N block',
        category: 'Productivity',
        shortDescription: 'Write, plan, and get organized. Your connected workspace for docs, wikis, and projects.',
        points: 150,
        androidVersion: '12+',
        estimatedTime: '20-25 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=notion.id',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/IDtkl9rmDFCaMHVpIHEUy6YvaQ7dZbc19v7zXU2637hJOqPzFo6-WS6TUaIe45L8dZrXURDBQMZGpOnZL8hNtA=w1052-h592-rw', alt: 'Notion Screenshot 1', dataAiHint: 'project document' },
            { url: 'https://play-lh.googleusercontent.com/oRlLXgugaEQwBZky-psvZuaPpJr-56kS6AhZULtHi2n_96qHj27EpE3OZqJtzBG2WoWxvb13OlN33DsWjHG5qQ=w1052-h592-rw', alt: 'Notion Screenshot 2', dataAiHint: 'database table view' }
        ],
        testingInstructions: 'Create a new database, add at least 5 entries with different properties (text, date, select). Test the filtering and sorting functionality.',
        status: 'available',
        totalDays: 14,
    },
    {
        id: 7,
        name: 'Duolingo',
        icon: 'https://play-lh.googleusercontent.com/Rz4JVKiQM7ZnLYTEzwzpvWROphw5Wo6kh3vnx8HhgHTaOzsknlTLmXUsknurSqTqUj0=w480-h960-rw',
        dataAiHint: 'green bird cartoon',
        category: 'Education',
        shortDescription: 'Learn a new language with the world’s most-downloaded education app!',
        points: 40,
        androidVersion: '7+',
        estimatedTime: '5-10 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.duolingo',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/bpbZj-0dChEpZ2X1pT83gZJi0CFHdVlK3Ja_nC1bDGzpX5aPTyCQDQ-s4gn6fBXmsQ=w1052-h592-rw', alt: 'Duolingo Screenshot 1', dataAiHint: 'language lesson' },
            { url: 'https://play-lh.googleusercontent.com/ERs3Y-33zoFG7aIaRYdg67QwHb6YOJB0lZdM9U8x3YMvT8m1XTXf5WRS-CzymdEoJw=w1052-h592-rw', alt: 'Duolingo Screenshot 2', dataAiHint: 'learning path' }
        ],
        testingInstructions: 'Complete one full lesson in any language. Verify that the progress is saved correctly and check for any issues with audio playback during exercises.',
        status: 'requested',
        totalDays: 18,
    },
    {
        id: 8,
        name: 'Spotify',
        icon: 'https://play-lh.googleusercontent.com/7ynvVIRdhJNAngCg_GI7i8TtH8BqkJYmffeUHsG-mJOdzt1XLvGmbsKuc5Q1SInBjDKN=w480-h960-rw',
        dataAiHint: 'green circle logo',
        category: 'Music',
        shortDescription: 'Listen to music, podcasts & more. Find your favorite songs.',
        points: 90,
        androidVersion: '10+',
        estimatedTime: '15-20 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.spotify.music',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/fOaUJKnuMPk02Gl5qu_B6ePw0myxaNJx3QZihKxsaAix5TYKl1NnfmvzZ52nSAc3w8nD=w1052-h592-rw', alt: 'Spotify Screenshot 1', dataAiHint: 'now playing screen' },
            { url: 'https://play-lh.googleusercontent.com/a7950Z_tJAMl7t9mh62ZBJianaWewvFqSXbpp4XqnrShHD1x4_JzB4ONSfM124rAvd3J=w1052-h592-rw', alt: 'Spotify Screenshot 2', dataAiHint: 'music playlist' }
        ],
        testingInstructions: 'Test the "Blend" feature with a friend. Create a new Blend playlist and check if it updates correctly after both of you listen to more music.',
        status: 'available',
        totalDays: 14,
    },
    {
        id: 9,
        name: 'Netflix',
        icon: 'https://play-lh.googleusercontent.com/TBRwjS_qfJCSj1m7zZB93FnpJM5fSpMA_wUlFDLxWAb45T9RmwBvQd5cWR5viJJOhkI=w480-h960-rw',
        dataAiHint: 'letter N red',
        category: 'Entertainment',
        shortDescription: 'Looking for the most talked about TV shows and movies from the around the world?',
        points: 110,
        androidVersion: '8+',
        estimatedTime: '15-20 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.netflix.mediaclient',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/Uev9_yBzAAhQJAxF2OH2chJM5ZtldwS2QLZuRna6Sxa-E8_V2DNTvhM1ErtO9Y-EovEW=w1052-h592-rw', alt: 'Netflix Screenshot 1', dataAiHint: 'movie selection screen' },
            { url: 'https://play-lh.googleusercontent.com/kgPN0hxOygJ0BvBKO_MppY5ffCxgjVby_4I8qZVOG3ZP1LkZsk6yR6kiACfo1G_jX3FA=w1052-h592-rw', alt: 'Netflix Screenshot 2', dataAiHint: 'tv show profile page' }
        ],
        testingInstructions: 'Test the download feature for offline viewing. Download a show, put your phone in airplane mode, and try to play it. Report any issues.',
        status: 'ongoing',
        progress: 30,
        totalDays: 20,
    },
    {
        id: 10,
        name: 'Minecraft',
        icon: 'https://play-lh.googleusercontent.com/27O5tpaYE82W6m30rJ_MX3-UvshlDM6O8oXDxb6GseYW2T7P8UNT19727MGmz-0q3w=s96-rw',
        dataAiHint: 'pixelated grass block',
        category: 'Games',
        shortDescription: 'Explore infinite worlds and build everything from the simplest of homes to the grandest of castles.',
        points: 150,
        androidVersion: '9+',
        estimatedTime: '30-40 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.mojang.minecraftpe',
        screenshots: [
             { url: 'https://play-lh.googleusercontent.com/TuldCmJnsld3yG9AG_vvVsWtJQhd0KGOekfZgZpjqGiT-CVQ3J5uuUyMEdF7e6X86W29=w1052-h592-rw', alt: 'Minecraft Screenshot 1', dataAiHint: 'game world' },
             { url: 'https://play-lh.googleusercontent.com/Oy0VBqSTujyHQdqbSPD4GvuKYb01OdY_36OAZV1JozE5J62e-Ok12BSwPCw4w72nU6c=w1052-h592-rw', alt: 'Minecraft Screenshot 2', dataAiHint: 'underwater gameplay' }
        ],
        testingInstructions: 'Join a multiplayer server and play for at least 15 minutes. We are looking for any connection issues, lag, or graphical glitches during multiplayer sessions.',
        status: 'available',
        totalDays: 25,
    },
    {
        id: 11,
        name: 'TikTok',
        icon: 'https://play-lh.googleusercontent.com/BmUViDVOKNJe0GYJe22hsr7juFndRVbvr1fGmHGXqHfJjNAXjd26bfuGRQpVrpJ6YbA=w480-h960-rw',
        dataAiHint: 'music note logo',
        category: 'Social',
        shortDescription: 'TikTok is THE destination for mobile videos. On TikTok, short-form videos are exciting, spontaneous, and genuine.',
        points: 95,
        androidVersion: '10+',
        estimatedTime: '10-15 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/xVRB5spVTzA2TX9R9E2XxcFmLncAQGUvR6N25-2D0f2LtZfOsOvUEMeJd8m3I9_Ytw=w1052-h592-rw', alt: 'TikTok Screenshot 1', dataAiHint: 'video feed interface' },
            { url: 'https://play-lh.googleusercontent.com/MzHRecSy-VSHfikBu1nWferUxTc9EJKE4BJODAffLQPiEpkjVKMvun02jn-KMKtIMQ=w1052-h592-rw', alt: 'TikTok Screenshot 2', dataAiHint: 'video creation tools' }
        ],
        testingInstructions: 'Test the new "Stitch" feature with a video from your "For You" page. Ensure the editing tools work as expected and the final video posts correctly.',
        status: 'available',
        totalDays: 14,
    },
    {
        id: 12,
        name: 'Amazon Shopping',
        icon: 'https://play-lh.googleusercontent.com/1Ns1T_qN0pEXMvZeZ5lQNAR8z4blP7ce2J2Nn5doXvt2T1g_W7VMORdWHaApkOooupI=s96-rw',
        dataAiHint: 'shopping cart arrow',
        category: 'Shopping',
        shortDescription: 'Amazon Shopping offers a wide range of products at great prices.',
        points: 60,
        androidVersion: '9+',
        estimatedTime: '10-15 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.amazon.mShop.android.shopping',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/Bt95BAHb_F8Wdn_Xt1z7sBjUXAD-UIYX_mqAhhRFIv5PobR3vpteXfzNC0ZYiVJPSgM=w1052-h592-rw', alt: 'Amazon Screenshot 1', dataAiHint: 'product page' },
            { url: 'https://play-lh.googleusercontent.com/q-3YfdVSQGgEJ9gj8KCnS17bu4fJmDZxkNzTeaR7bQg2p0lwHFSmBlYCUlW84g32A6w=w1052-h592-rw', alt: 'Amazon Screenshot 2', dataAiHint: 'home page deals' }
        ],
        testingInstructions: 'Add three different items to your cart and proceed to the checkout page. Do not complete the purchase. Report any issues with the UI or calculation errors in the subtotal.',
        status: 'completed',
        completedDate: '2024-06-15',
        totalDays: 14,
    },
    {
        id: 13,
        name: 'Microsoft OneDrive',
        icon: 'https://play-lh.googleusercontent.com/6AWr-qrhGT0ohjw0koq3bM8GHEFg1gTurald4FjCDg2RulTp4y_VVsYWUtw7Fo6lsQo=s96-rw',
        dataAiHint: 'blue cloud',
        category: 'Productivity',
        shortDescription: 'Do more on the go with Microsoft OneDrive. Get to and share your documents, photos, and other files from your Android device.',
        points: 90,
        androidVersion: '10+',
        estimatedTime: '10-15 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.microsoft.skydrive',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/z_Fhk7tBiw-Uj0kdr3xC0PcpGrf8QNo3theULld7m_S5TiPGs82vU_gLYkiPyOjkew=w1052-h592-rw', alt: 'OneDrive Screenshot 1', dataAiHint: 'file browser' },
            { url: 'https://play-lh.googleusercontent.com/6kpAhVXfEBoGHf3AF27S2lm99kUoA8p0X4Gjvphw4evsPE4aGO8iddyQjT0OwUQDE7xG=w1052-h592-rw', alt: 'OneDrive Screenshot 2', dataAiHint: 'photo view' }
        ],
        testingInstructions: 'Upload a photo to your OneDrive. Then, try to share the link to that photo with another app (e.g., messaging app). Report any issues with the sharing process.',
        status: 'ongoing',
        progress: 50,
        totalDays: 14,
    },
    {
        id: 14,
        name: 'Clash of Clans',
        icon: 'https://play-lh.googleusercontent.com/Z1f_1uaCTgQNPjTz7erPfKDjoSwsbIMcoAXU5MV5mI9_dkUsTP2I0Fha3NkKCZvydWatCPSoTCGzFYCguXUL3CQ=s96-rw',
        dataAiHint: 'barbarian character',
        category: 'Games',
        shortDescription: 'Join millions of players worldwide as you build your village, raise a clan, and compete in epic Clan Wars!',
        points: 100,
        androidVersion: '9+',
        estimatedTime: '20-30 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.supercell.clashofclans',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/NedHTUnKlJffJLyfv86IyDqyCwTfUSvr_5KldNbeWaZgtNe-aWlqwglcGcvRn_awTPA=w1052-h592-rw', alt: 'Clash of Clans Screenshot 1', dataAiHint: 'village base' },
            { url: 'https://play-lh.googleusercontent.com/jifDVIpK_477kQvBYnXknD4DtGAyzYhIM7zamo-QQdFDaT7uqQoCtljM5Bf_2DcixRlN=w1052-h592-rw', alt: 'Clash of Clans Screenshot 2', dataAiHint: 'battle scene' }
        ],
        testingInstructions: 'Participate in a Clan War. Attack an enemy base and check if the replay functionality works correctly. Report any visual glitches during the battle.',
        status: 'available',
        totalDays: 14,
    },
    {
        id: 15,
        name: 'Google Photos',
        icon: 'https://play-lh.googleusercontent.com/ZyWNGIfzUyoajtFcD7NhMksHEZh37f-MkHVGr5Yfefa-IX7yj9SMfI82Z7a2wpdKCA=w480-h960-rw',
        dataAiHint: 'pinwheel colorful',
        category: 'Photos & Video',
        shortDescription: 'Google Photos is the home for all your photos and videos, automatically organized and easy to share.',
        points: 85,
        androidVersion: '10+',
        estimatedTime: '10-15 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.google.android.apps.photos',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/txZg8DG_fuYDdhiH0haLYd6zHpokFpzXP9gb_3ljVHI8VeVzCkMy-YFZ9-fxXM_cHuwl=w1052-h592-rw', alt: 'Google Photos Screenshot 1', dataAiHint: 'photo gallery' },
            { url: 'https://play-lh.googleusercontent.com/-dmhCalMOHT7z0RyDFaMuSUy3C6dSoWQfJuyvgJiu0m6hCKhoP-iSm7o7Hrfcyucm2E=w1052-h592-rw', alt: 'Google Photos Screenshot 2', dataAiHint: 'photo editing' }
        ],
        testingInstructions: 'Use the "Memories" feature. View a few memories and try to customize one by adding or removing photos. Ensure the changes are saved correctly.',
        status: 'ongoing',
        progress: 80,
        totalDays: 14,
    },
    {
        id: 16,
        name: 'Uber',
        icon: 'https://play-lh.googleusercontent.com/AQtSF5Sl18yp3mQ2tcbOrBLekb7cyP3kyg5BB1uUuc55zfcnbkCDLHFTBwZfYiu1aDI=w480-h960-rw',
        dataAiHint: 'black app icon',
        category: 'Travel & Local',
        shortDescription: 'We’re committed to your safety at Uber. We’ve established a Door-to-Door Safety Standard to help you feel safe every time you ride.',
        points: 70,
        androidVersion: '9+',
        estimatedTime: '5-10 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.ubercab',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/JWzREHRyz1VttPQfiKXlMRYOAvz78h6SY_1RUoDjJvW4ClVYoHEZA3tkJ_1RaFe2JA=w1052-h592-rw', alt: 'Uber Screenshot 1', dataAiHint: 'map with car' },
            { url: 'https://play-lh.googleusercontent.com/cZUMicgTrQQkFashDnSRHl0yFl75_EAIJmCT6Sq6SeVbdh96ASMJBRAqZ0DLWBILWJ4=w1052-h592-rw', alt: 'Uber Screenshot 2', dataAiHint: 'ride options' }
        ],
        testingInstructions: 'Set a destination and view the different ride options (UberX, Comfort, etc.). Do not book a ride. Report any issues with the map display or price estimation.',
        status: 'available',
        totalDays: 14,
    },
    {
        id: 17,
        name: 'LinkedIn',
        icon: 'https://play-lh.googleusercontent.com/kMofEFLjobZy_bCuaiDogzBcUT-dz3BBbOrIEjJ-hqOabjK8ieuevGe6wlTD15QzOqw=w480-h960-rw',
        dataAiHint: 'in logo blue',
        category: 'Social',
        shortDescription: 'Connect with your professional network, build your career, and find your next job.',
        points: 110,
        androidVersion: '10+',
        estimatedTime: '15-20 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.linkedin.android',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/ERlslwKS3qgVxLm9KBkIPBg7JFexcing9c0oljWBZpdZb6gY_O5B08r_YqERKqdVUw=w1052-h592-rw', alt: 'LinkedIn Screenshot 1', dataAiHint: 'professional profile' },
            { url: 'https://play-lh.googleusercontent.com/fzAm6QzzZ0BPmtLdgaL6Au1aQWoYvGPQ-KPP621JRcKcL5nNujyYDUhhww4KyxpTDA=w1052-h592-rw', alt: 'LinkedIn Screenshot 2', dataAiHint: 'professional network feed' }
        ],
        testingInstructions: 'Update a section of your profile (e.g., add a new skill). Check that the changes are reflected correctly across the app. Then, view a job posting and save it.',
        status: 'completed',
        completedDate: '2024-07-01',
        totalDays: 14,
    },
    {
        id: 18,
        name: 'Zoom',
        icon: 'https://play-lh.googleusercontent.com/yZsmiNjmji3ZoOuLthoVvptLB9cZ0vCmitcky4OUXNcEFV3IEQkrBD2uu5kuWRF5_ERA=w480-h960-rw',
        dataAiHint: 'video camera icon',
        category: 'Business',
        shortDescription: 'Work from anywhere with a single app that combines team chat, phone, whiteboard, meetings, and more.',
        points: 90,
        androidVersion: '9+',
        estimatedTime: '10-15 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=us.zoom.videomeetings',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/cDeHHV-DBIdqrd7o--FYHbDjd845Uupm_lbCrSc-O7wSaHSjnsMo9CCzDHEQI3i9TnP-=w1052-h592-rw', alt: 'Zoom Screenshot 1', dataAiHint: 'video conference call' },
            { url: 'https://play-lh.googleusercontent.com/wf50ibsSuh3Y74yhgSjp_sF5hQuaQC4qaad7Z5_xPG0BPwR6D8wWlwDgHVTo0-ikfw=w1052-h592-rw', alt: 'Zoom Screenshot 2', dataAiHint: 'meeting schedule' }
        ],
        testingInstructions: 'Start a new meeting with only yourself. Test the virtual background feature. Ensure that the background applies correctly and there is no significant performance drop.',
        status: 'available',
        totalDays: 14,
    },
    {
        id: 19,
        name: 'Discord',
        icon: 'https://play-lh.googleusercontent.com/0oO5sAneb9lJP6l8c6DH4aj6f85qNpplQVHmPmbbBxAukDnlO7DarDW0b-kEIHa8SQ=s96-rw',
        dataAiHint: 'game controller logo',
        category: 'Communication',
        shortDescription: 'Discord is where you can make a home for your communities and friends. Where you can stay close and have fun over text, voice, and video.',
        points: 130,
        androidVersion: '10+',
        estimatedTime: '20-25 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.discord',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/zMi_TI6DqxBnylsqmO10TaKknp-su3HdHu5lpYQlxAUfTE13tAswW8KnB4UiUFCrH2s=w1052-h592-rw', alt: 'Discord Screenshot 1', dataAiHint: 'chat server interface' },
            { url: 'https://play-lh.googleusercontent.com/LUbhjBDsItfhj8FnM3mDhekkaUCecqF6s49T2AyhgRyZsFijrw7lcKd74gM2E9ctGQ=w1052-h592-rw', alt: 'Discord Screenshot 2', dataAiHint: 'voice channel' }
        ],
        testingInstructions: 'Join a voice channel in a server. Test the noise suppression feature by enabling it and speaking with background noise. Report on its effectiveness.',
        status: 'requested',
        totalDays: 14,
    },
    {
        id: 20,
        name: 'Pinterest',
        icon: 'https://play-lh.googleusercontent.com/6CFQQ0b9r5fzF1v6f0gIirWsOGL7sGWkJifuUQxxhbCMcBx5aSG_cNXpjDKDn5c1jwjq=w480-h960-rw',
        dataAiHint: 'letter P red',
        category: 'Lifestyle',
        shortDescription: 'Pinterest is the place to explore inspiration. You can: Discover new ideas, save what inspires you, shop to make them yours, share what you love.',
        points: 75,
        androidVersion: '10+',
        estimatedTime: '10-15 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.pinterest',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/utDtGKlNK8rh0D0NN0exEvS-utQ2r_1se_sjVPYH31oIBcQo0bkooPFH1Dd9IMhGJ3UpFMJtPcVf-9wHoePQ3g=w1052-h592-rw', alt: 'Pinterest Screenshot 1', dataAiHint: 'image grid feed' },
            { url: 'https://play-lh.googleusercontent.com/b7wC5dtsv1qdp-ys_GwoNNsvu2-CCFuntridk6sr13Wg_bX3r7UPKgOpWF9CXPzf36cdG1E06ID9EpKmxFSvyA=w1052-h592-rw', alt: 'Pinterest Screenshot 2', dataAiHint: 'pin detail view' }
        ],
        testingInstructions: 'Create a new board and save at least 5 pins to it. Test the "More ideas" section on the board to see if the suggestions are relevant.',
        status: 'available',
        totalDays: 14,
    },
    {
        id: 21,
        name: 'Airbnb',
        icon: 'https://play-lh.googleusercontent.com/5ZOQbuxacVOWK6AM4Env-adyEWRUCJt0VrUl9bWKW4Z4qLSjJUBuMP8-dALMy9oWu530=w480-h960-rw',
        dataAiHint: 'pink abstract logo',
        category: 'Travel & Local',
        shortDescription: 'Book places to stay and things to do.',
        points: 100,
        androidVersion: '9+',
        estimatedTime: '15-20 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.airbnb.android',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/Os5RuUgRRPskSEWwMOCgySW7wxUIBYuTYEP5DRxQi7naVkqdZmTrpB1z3ERPN_1RqO_j=w1052-h592-rw', alt: 'Airbnb Screenshot 1', dataAiHint: 'home rental listing' },
            { url: 'https://play-lh.googleusercontent.com/2QLnpUwoUtj9I3iTT0yd2nMJezAQD4YCk6FyCzsgrZTP74SgfxmE_Uyqs4fU7d4SlII=w1052-h592-rw', alt: 'Airbnb Screenshot 2', dataAiHint: 'map view with prices' }
        ],
        testingInstructions: 'Search for a stay in any city for a future date. Apply at least 3 filters (e.g., Wi-Fi, Kitchen, Price Range) and check if the results update correctly.',
        status: 'request_rejected',
        rejectionReason: 'The developer has paused new tester requests for this app.',
        totalDays: 14,
    },
    {
        id: 22,
        name: 'Microsoft OneDrive',
        icon: 'https://play-lh.googleusercontent.com/6AWr-qrhGT0ohjw0koq3bM8GHEFg1gTurald4FjCDg2RulTp4y_VVsYWUtw7Fo6lsQo=s96-rw',
        dataAiHint: 'blue cloud',
        category: 'Productivity',
        shortDescription: 'Do more on the go with Microsoft OneDrive. Get to and share your documents, photos, and other files from your Android device.',
        points: 90,
        androidVersion: '10+',
        estimatedTime: '10-15 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.microsoft.skydrive',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/z_Fhk7tBiw-Uj0kdr3xC0PcpGrf8QNo3theULld7m_S5TiPGs82vU_gLYkiPyOjkew=w1052-h592-rw', alt: 'OneDrive Screenshot 1', dataAiHint: 'file browser' },
            { url: 'https://play-lh.googleusercontent.com/6kpAhVXfEBoGHf3AF27S2lm99kUoA8p0X4Gjvphw4evsPE4aGO8iddyQjT0OwUQDE7xG=w1052-h592-rw', alt: 'OneDrive Screenshot 2', dataAiHint: 'photo view' }
        ],
        testingInstructions: 'Upload a photo to your OneDrive. Then, try to share the link to that photo with another app (e.g., messaging app). Report any issues with the sharing process.',
        status: 'ongoing',
        progress: 50,
        totalDays: 14,
    },
    {
        id: 23,
        name: 'Audible',
        icon: 'https://play-lh.googleusercontent.com/pwzZK-7oQexraeU0mOrQgFIck-QSS89rH0eWjehctp8XskRSpixPNVlA0YYlRXHbA2Iz=w480-h960-rw',
        dataAiHint: 'orange app icon',
        category: 'Books & Reference',
        shortDescription: 'The home of storytelling. Find your next great listen. Audiobooks, podcasts, and exclusive Originals.',
        points: 80,
        androidVersion: '9+',
        estimatedTime: '10-15 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.audible.application',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/EbBpHZ0sYqgZ2c6lbtldTrpnL2kL2fbI9aZjxodLi3p9shnIyRsoPOfK9ueieK4P6s4=w1052-h592-rw', alt: 'Audible Screenshot 1', dataAiHint: 'audiobook player' },
            { url: 'https://play-lh.googleusercontent.com/MdfmlSGUqETv3zLRTDflkFY5IG-70dGBUFNYarO4wEl9mqbAczJyr16pO3CZF0V5Mw8=w1052-h592-rw', alt: 'Audible Screenshot 2', dataAiHint: 'library view' }
        ],
        testingInstructions: 'Listen to a sample of any audiobook. Test the sleep timer feature by setting it for 5 minutes. Verify that the playback stops after the set time.',
        status: 'available',
        totalDays: 14,
    },
    {
        id: 24,
        name: 'Google Maps',
        icon: 'https://play-lh.googleusercontent.com/Kf8WTct65hFJxBUDm5E-EpYsiDoLQiGGbnuyP6HBNax43YShXti9THPon1YKB6zPYpA=w480-h960-rw',
        dataAiHint: 'map pin icon',
        category: 'Travel & Local',
        shortDescription: 'Navigate your world faster and easier with Google Maps. Over 220 countries and territories mapped and hundreds of millions of businesses and places on the map.',
        points: 90,
        androidVersion: '9+',
        estimatedTime: '10-15 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.google.android.apps.maps',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/s06uBXcm9aDF3xQsgFGuaMgtqEbeJi1WBw0P1mFYKPoBCiVTCv7DoW5RYXLEYNK_mRPp=w1052-h592-rw', alt: 'Google Maps Screenshot 1', dataAiHint: 'navigation view' },
            { url: 'https://play-lh.googleusercontent.com/UnOWNTXSmmaaQP2bFAnOZo0G77yUcauw_ce5RxoOIEAqjlLHmaIO8v8gxlEemuU14_U=w1052-h592-rw', alt: 'Google Maps Screenshot 2', dataAiHint: 'explore places' }
        ],
        testingInstructions: 'Find directions to a location using public transit. Check if the app provides multiple route options and accurate departure times. Report any discrepancies.',
        status: 'completed',
        completedDate: '2024-07-10',
        totalDays: 14,
    },
    {
        id: 25,
        name: 'Twitch',
        icon: 'https://play-lh.googleusercontent.com/Y6epalNGUKPgWyQpDCgVL621EgmOmXBWfQoJdaM8v0irKWEII5bEDvpaWp7Mey2MVg=w480-h960-rw',
        dataAiHint: 'purple chat bubble',
        category: 'Entertainment',
        shortDescription: 'Twitch is where millions of people come together live every day to chat, interact, and make their own entertainment together.',
        points: 115,
        androidVersion: '10+',
        estimatedTime: '15-20 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=tv.twitch.android.app',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/sSTOCmOjUM98O7Cx9ScaaNevgl3MT8vGqQ8J793xckZORDKGC3DYLVEQCNAwErWcSNg=w1052-h592-rw', alt: 'Twitch Screenshot 1', dataAiHint: 'live stream view' },
            { url: 'https://play-lh.googleusercontent.com/Pe2oAtIT8__GC7t_DSBHDySeRTsXtWDeasIJRYHRkppgTFlZZqwk7y-thE0GYctRCTk=w1052-h592-rw', alt: 'Twitch Screenshot 2', dataAiHint: 'channel page' }
        ],
        testingInstructions: 'Watch a live stream and try using Channel Points to redeem a reward. Verify that the reward activates correctly and your points balance is updated.',
        status: 'available',
        totalDays: 14,
    },
    {
        id: 26,
        name: 'Shazam',
        icon: 'https://play-lh.googleusercontent.com/mwTU9-4NX-_QlATb6lILSinKI47wAtOM38GjPYRPQSsQOG2hVRY4h9OfEhDxpf8ADQ=w480-h960-rw',
        dataAiHint: 'blue s logo',
        category: 'Music & Audio',
        shortDescription: 'Shazam will identify any song in seconds. Discover, artists, lyrics, videos & playlists, all for free.',
        points: 50,
        androidVersion: '9+',
        estimatedTime: '5-10 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.shazam.android',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/RmO2rsRpDZn_t4gvHS0AovZvm0Bf6wwsIDvPjGoKGhCbKBRvZuFOdqNiegftaopKuJUo=w1052-h592-rw', alt: 'Shazam Screenshot 1', dataAiHint: 'song identification screen' },
            { url: 'https://play-lh.googleusercontent.com/r2aQs5r_jnqEc1DQCRnfPjEhpH_Adqw60we7kReYylUssw23xN9c95MdxkiNcFYbOA=w1052-h592-rw', alt: 'Shazam Screenshot 2', dataAiHint: 'song details page' }
        ],
        testingInstructions: 'Identify a song by playing music from another device. After identification, check if the lyrics are available and sync correctly with the song.',
        status: 'available',
        totalDays: 14,
    },
    {
        id: 27,
        name: 'Telegram',
        icon: 'https://play-lh.googleusercontent.com/ZU9cSsyIJZo6Oy7HTHiEPwZg0m2Crep-d5ZrfajqtsH-qgUXSqKpNA2FpPDTn-7qA5Q=w480-h960-rw',
        dataAiHint: 'paper airplane icon',
        category: 'Communication',
        shortDescription: 'Telegram is a messaging app with a focus on speed and security, it’s super-fast, simple and free.',
        points: 95,
        androidVersion: '8+',
        estimatedTime: '10-15 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=org.telegram.messenger',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/wlwY1vowGxTrvQMRDHJD21iYBG7S_E09QbKPY-L6dqEc4UxCi0fDQiNuCBonFYED1yU=w1052-h592-rw', alt: 'Telegram Screenshot 1', dataAiHint: 'chat interface' },
            { url: 'https://play-lh.googleusercontent.com/NaeXtT-aGP9_R8LROs3XyWVc6eU7sxYuuywNwg3c99AjRtj6cCoPaJynhP0t8uynF6hm=w1052-h592-rw', alt: 'Telegram Screenshot 2', dataAiHint: 'channel view' }
        ],
        testingInstructions: 'Create a new sticker pack by uploading an image. Ensure the sticker is created successfully and can be sent in a chat.',
        status: 'ongoing',
        progress: 20,
        totalDays: 14,
    },
    {
        id: 28,
        name: 'Signal Private Messenger',
        icon: 'https://play-lh.googleusercontent.com/FtGKSwVtpmMxKoJrJuI837DkYGRsqlMdiVPAd8bomLQZ3_Hc55XokY_dYdXKgGagiYs=w480-h960-rw',
        dataAiHint: 'blue chat bubble',
        category: 'Communication',
        shortDescription: 'Millions of people use Signal every day for free and instantaneous communication anywhere in the world.',
        points: 80,
        androidVersion: '9+',
        estimatedTime: '10-15 min',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=org.thoughtcrime.securesms',
        screenshots: [
            { url: 'https://play-lh.googleusercontent.com/xRXui7PTkU-MrsnbuCPc0Y1ThX5uDUA-i0J5HGIxTM53aVL7ea_QdyO4jz8qXhNZODpu=w1052-h592-rw', alt: 'Signal Screenshot 1', dataAiHint: 'encrypted chat' },
            { url: 'https://play-lh.googleusercontent.com/oWgzBb5N9ktqX0VQRHwoZsLRDt4CTvhv-lCE30PUemIKm12kdFpYVa5z4Zs2XDkMFI8=w1052-h592-rw', alt: 'Signal Screenshot 2', dataAiHint: 'group call' }
        ],
        testingInstructions: 'Send a disappearing message with a custom timer. Verify that the message disappears for both you and the recipient after the timer expires.',
        status: 'available',
        totalDays: 14,
    },
];

export const transactionHistory = [
    { id: 'TXN-001', date: '2024-08-22', type: 'Package Purchase', description: 'Bought Accelerator Package', amount: '₹1,799', change: '+5 Packages', status: 'Completed', changeType: 'positive' },
    { id: 'TXN-002', date: '2024-08-20', type: 'Points Earned', description: 'Completed test for "QuantumLeap CRM"', amount: '+150 Points', change: '+150 Points', status: 'Completed', changeType: 'positive' },
    { id: 'TXN-003', date: '2024-08-18', type: 'Package Used', description: 'Submitted "Project Phoenix"', amount: '-1 Package', change: '-1 Package', status: 'Completed', changeType: 'negative' },
    { id: 'TXN-004', date: '2024-08-15', type: 'Points Spent', description: 'Submitted "Starlight Editor" to community', amount: '-1200 Points', change: '-1200 Points', status: 'Completed', changeType: 'negative' },
    { id: 'TXN-005', date: '2024-08-12', type: 'Points Earned', description: 'Completed test for "Helios Platform"', amount: '+100 Points', change: '+100 Points', status: 'Completed', changeType: 'positive' },
    { id: 'TXN-006', date: '2024-08-10', type: 'Package Purchase', description: 'Bought Booster Package', amount: '₹699', change: '+1 Package', status: 'Completed', changeType: 'positive' },
    { id: 'TXN-007', date: '2024-08-05', type: 'Points Earned', description: 'High-quality bug report on "Nexus Browser"', amount: '+50 Points', change: '+50 Points', status: 'Completed', changeType: 'positive' },
];


export const professionalPathFeatures: string[] = [
    "14-Day Testing Cycle",
    "20+ Vetted Testers",
    "Managed by inTesters Team",
    "Detailed Bug Reports",
    "Device & OS Coverage Stats",
    "Google Play Compliance Check",
];


export const pointsPackages: PointsPackage[] = [
    {
        name: "Booster",
        price: 699,
        points: 1,
        description: "Perfect for a single app.",
    },
    {
        name: "Accelerator",
        price: 1799,
        points: 5,
        description: "Great value for teams.",
    },
    {
        name: "Launchpad",
        price: 2899,
        points: 10,
        description: "For agencies & enterprises.",
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
    const feedbackTypes: ('Bug' | 'Suggestion' | 'Praise')[] = ['Bug', 'Suggestion', 'Praise', 'Bug', 'Bug'];
    const comments = {
        'Bug': `Found a crash in ${projectName} when trying to open the settings page.`,
        'Suggestion': `It would be great if ${projectName} had a dark mode option.`,
        'Praise': `The new update for ${projectName} is fantastic! The UI is so much smoother.`
    }
    const severities: ('Critical' | 'High' | 'Medium' | 'Low' | 'N/A')[] = ['Critical', 'Low', 'N/A', 'High', 'Medium'];
    const statuses: ('New' | 'In Progress' | 'Resolved' | 'Closed')[] = ['New', 'Closed', 'Closed', 'In Progress', 'Resolved'];

    return Array.from({ length: 15 }, (_, i) => {
        const type = feedbackTypes[i % feedbackTypes.length];
        const hasScreenshot = i % 3 === 0;
        const hasVideo = i % 5 === 0;
        return {
            id: i + 1,
            tester: `Tester${100 + i}`,
            type: type,
            severity: type === 'Bug' ? severities[i % severities.length] : 'N/A',
            status: statuses[i % statuses.length],
            comment: comments[type as keyof typeof comments] || `Generic feedback item #${i+1}`,
            date: `2024-08-${20- (i % 10)}`,
            screenshot: hasScreenshot ? `https://picsum.photos/seed/${projectName.length + i}/400/800` : null,
            videoUrl: hasVideo ? 'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4' : null,
        }
    });
};

const generateTesters = (count: number): TesterDetails[] => {
    const devices = ["Pixel 8 Pro", "Galaxy S24 Ultra", "OnePlus 12", "Xiaomi 14", "Pixel 7a"];
    const countries = [{c: "USA", s: "California"}, {c: "India", s: "Maharashtra"}, {c: "Germany", s: "Berlin"}, {c: "Brazil", s: "São Paulo"}, {c: "Nigeria", s: "Lagos"}];
    const languages = ["en-US", "en-GB", "es-ES", "hi-IN", "pt-BR"];

    return Array.from({length: count}, (_, i) => ({
        id: `tester-${101 + i}`,
        name: `Tester ${101+i}`,
        avatar: `https://i.pravatar.cc/150?u=tester${101+i}`,
        country: countries[i % countries.length].c,
        state: countries[i % countries.length].s,
        device: devices[i % devices.length],
        ram: `${[4, 6, 8, 12][i % 4]}GB`,
        os: `Android ${12 + (i % 3)}`,
        screenSize: `${['1080x2400', '1440x3120', '1080x2340'][i % 3]}`,
        language: languages[i % languages.length],
        network: i % 3 === 0 ? 'Cellular' : 'WiFi',
        rating: Math.round((3.5 + Math.random() * 1.5) * 2) / 2, // 3.5 to 5.0 in 0.5 increments
    }));
}


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
      icon: "https://play-lh.googleusercontent.com/3aWGqSf3T_p3F6wc8FFvcZcnjWlxpZdNaqFVEvPwQ1gTOPkVoZwq6cYvfK9eCkwCXbRY=s96-rw",
      dataAiHint: "design logo",
      category: "Art & Design",
      status: "In Testing",
      testersStarted: 14,
      testersCompleted: 8,
      totalDays: 14,
      avgTestersPerDay: 1.2,
      startedFrom: "22 Aug 2024",
      description: "Canva makes design and video editing amazingly simple (and fun)! Create stunning designs with your photos and videos—even if you’re not a design expert!",
      testingInstructions: "Please focus on the new video export feature. Try exporting a short video with animations and text overlays. Report any issues with export quality or speed.",
      androidVersion: "11+",
      pointsCost: 1400,
      crashFreeRate: 99.8,
      overallRating: 4.2,
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
      chartData: generateChartData(20),
      testers: generateTesters(14),
    },
    {
      id: 2,
      name: "Figma",
      packageName: "com.figma.mirror",
      icon: "https://play-lh.googleusercontent.com/hoVBnPBRehmXsCqESLXRH2E3OTxklkwKZlb1psn7imm0VUSobn2nevS9RRFWb9GM4-o=s96-rw",
      dataAiHint: "geometric shapes",
      category: "Productivity",
      status: "In Review",
      testersStarted: 12,
      testersCompleted: 10,
      totalDays: 10,
      avgTestersPerDay: 1.0,
      startedFrom: "15 Jul 2024",
      description: "Figma is the all-in-one design platform for teams. Brainstorm, design, and build better products—from start to finish.",
      testingInstructions: "Test the prototyping links. Create a simple prototype with a few screens and share the link. Verify that it opens correctly on different devices.",
      androidVersion: "10+",
      pointsCost: 1200,
      crashFreeRate: 99.9,
      overallRating: 4.8,
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
      chartData: generateChartData(15),
      reviewNotes: "Initial review in progress. Checking for policy compliance and testability.",
      testers: generateTesters(12),
    },
    {
      id: 3,
      name: "Slack",
      packageName: "com.Slack",
      icon: "https://play-lh.googleusercontent.com/mzJpTCsTW_FuR6YqOPaLHrSEVCSJuXzCljdxnCKhVZMcu6EESZBQTCHxMh8slVtnKqo=w480-h960-rw",
      dataAiHint: "colorful hash",
      category: "Business",
      status: "Completed",
      testersStarted: 20,
      testersCompleted: 20,
      totalDays: 14,
      avgTestersPerDay: 1.4,
      startedFrom: "01 Jun 2024",
      description: "Slack brings team communication and collaboration into one place so you can get more work done, whether you belong to a large enterprise or a small business.",
      testingInstructions: "Please check the notification settings. Configure custom notifications for a specific channel and verify that you receive them as expected.",
      androidVersion: "9+",
      pointsCost: 2000,
      crashFreeRate: 100,
      overallRating: 4.5,
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
      chartData: generateChartData(5),
      testers: generateTesters(20),
    },
     {
      id: 6,
      name: "Asana",
      packageName: "com.asana.app",
      icon: "https://play-lh.googleusercontent.com/SWbS8z3NqFVHCEQc_6l-ZDdDj5qPGrWSK8hEWRSPHYm9s8958y6nTnoLolVHXlgKfXw=s96-rw",
      dataAiHint: "three dots logo",
      category: "Productivity",
      status: "In Review",
      testersStarted: 0,
      testersCompleted: 0,
      totalDays: 0,
      avgTestersPerDay: 0,
      startedFrom: "28 Aug 2024",
      description: "Asana is the easiest way to manage team projects and your individual tasks. From the small stuff to the big picture, Asana organizes work so you and your teams are clear on what to do, why it matters, and how to get it done.",
      testingInstructions: "We are launching a new 'Goals' feature. Please try creating a new goal, linking it to a project, and updating its status. We're interested in feedback on the UI and ease of use.",
      androidVersion: "12+",
      pointsCost: 1500,
      reviewNotes: "Initial review in progress. Checking for policy compliance and testability.",
      crashFreeRate: 100,
      overallRating: 0,
      feedbackBreakdown: { total: 0, critical: 0, high: 0, low: 0 },
      performanceMetrics: { avgStartupTime: "N/A", frozenFrames: "N/A" },
       deviceCoverage: [],
      osCoverage: [],
       topGeographies: [],
      feedback: [],
      chartData: [],
      testers: [],
    },
    {
      id: 7,
      name: "Brain Waves - Binaural Beats",
      packageName: "net.luizmello.brainwaves",
      icon: "https://play-lh.googleusercontent.com/VH5xLXzIfJadh3Wfb5s7GMq5kfpGsib8qfu1Qexu-P84klFc4s5AMbNC4Gp-BXhrg1s=w480-h960-rw",
      dataAiHint: "sound wave",
      category: "Health & Fitness",
      status: "Draft",
      testersStarted: 0,
      testersCompleted: 0,
      totalDays: 0,
      avgTestersPerDay: 0,
      startedFrom: "N/A",
      description: "With this app, you can easily generate pure tones that help stimulate focus, meditation, or deep relaxation.",
      testingInstructions: "",
      androidVersion: "",
      pointsCost: 0,
      reviewNotes: "Submission is incomplete.",
      crashFreeRate: 100,
      overallRating: 0,
      feedbackBreakdown: { total: 0, critical: 0, high: 0, low: 0 },
      performanceMetrics: { avgStartupTime: "N/A", frozenFrames: "N/A" },
       deviceCoverage: [],
      osCoverage: [],
       topGeographies: [],
      feedback: [],
      chartData: [],
      testers: [],
    },
    {
      id: 4,
      name: "Google Wallet",
      packageName: "com.google.android.apps.walletnfcrel",
      icon: "https://play-lh.googleusercontent.com/DHBlQKvUNbopIS-VjQb3fUKQ_QH0Em-Q66AwG6LwD1Sach3lUvEWDb6hh8xNvKGmctU=w480-h960-rw",
      dataAiHint: "colorful wallet",
      category: "Finance",
      status: "Completed",
      testersStarted: 15,
      testersCompleted: 15,
      totalDays: 14,
      avgTestersPerDay: 1.1,
      startedFrom: "10 May 2024",
      description: "Google Wallet gives you fast, secure access to your everyday essentials. Tap to pay everywhere Google Pay is accepted, board a flight, go to a movie, and more - all with just your phone.",
      testingInstructions: "Test adding a new loyalty card by searching for a merchant. Also, try reordering the cards in your wallet.",
      androidVersion: "9+",
      pointsCost: 1500,
      crashFreeRate: 99.95,
      overallRating: 3.9,
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
      chartData: generateChartData(12),
      testers: generateTesters(15),
    },
      {
      id: 5,
      name: "Trello",
      packageName: "com.trello",
      icon: "https://play-lh.googleusercontent.com/Tt-6ZaQDUAjfSNSeLz4XyYkPsEQfVVp0lBtwrnuyqubhCna0LKu5OZxKgegBJIrEhz8=s96-rw",
      dataAiHint: "blue squares",
      category: "Productivity",
      status: "Rejected",
      testersStarted: 25,
      testersCompleted: 25,
      totalDays: 14,
      avgTestersPerDay: 1.8,
      startedFrom: "05 Apr 2024",
      description: "Trello is the visual tool that empowers your team to manage any type of project, workflow, or task tracking. Add files, checklists, or even automation: Customize it all for how your team works best.",
      testingInstructions: "Focus on the automation feature (Butler). Create a rule that moves a card to a different list when a label is added. Verify it works as expected.",
      androidVersion: "10+",
      pointsCost: 2500,
      crashFreeRate: 98.5,
      overallRating: 3.5,
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
      chartData: generateChartData(40),
      rejectionReason: {
        title: "App Not Available in All Regions",
        description: "Our review found that the app is currently restricted to North America. To ensure our global community of testers can access your app, please make it available in all countries/regions within your Google Play Console settings. This allows for diverse testing across different devices and network conditions.",
        imageUrl: "https://images.unsplash.com/photo-1601034913836-a1f43e143611?q=50&w=500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        dataAiHint: "world map",
      },
      testers: generateTesters(25),
    },
    ...[
        { id: 101, status: 'In Testing', name: 'Todoist' },
        { id: 109, status: 'In Testing', name: 'Netflix' },
        { id: 115, status: 'In Testing', name: 'Google Photos' },
        { id: 122, status: 'In Testing', name: 'Microsoft OneDrive' },
        { id: 127, status: 'In Testing', name: 'Telegram' },
        { id: 102, status: 'In Testing', name: 'Brawl Stars' },
        { id: 103, status: 'In Testing', name: 'AccuWeather' },
    ].map((override, index) => {
      const baseApp = communityApps.find(app => app.name === override.name) || communityApps[index % communityApps.length];
      const isCompleted = override.status === 'Completed';
      const isOngoing = override.status === 'In Testing';
      const testersCompleted = isCompleted ? 15 + (override.id % 5) : (isOngoing ? 5 + (override.id % 5) : 0);
      const testersStarted = testersCompleted + (isOngoing ? 5 : 0) + (override.status === 'In Review' ? 2 : 0)
      return {
        id: override.id,
        name: baseApp.name,
        packageName: `com.example.${baseApp.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        icon: baseApp.icon,
        dataAiHint: baseApp.dataAiHint,
        category: baseApp.category,
        status: override.status as "In Testing" | "Completed" | "In Review" | "Draft" | "Rejected",
        testersStarted: testersStarted,
        testersCompleted: testersCompleted,
        totalDays: baseApp.totalDays,
        avgTestersPerDay: (testersStarted / baseApp.totalDays),
        startedFrom: "15 Aug 2024",
        description: baseApp.shortDescription,
        testingInstructions: baseApp.testingInstructions,
        androidVersion: baseApp.androidVersion,
        pointsCost: testersStarted * 80,
        crashFreeRate: 99.5 - (override.id % 10)/10,
        overallRating: 4.0 + (override.id % 10)/10,
        feedbackBreakdown: { total: testersCompleted * 3, critical: Math.floor(testersCompleted/5), high: Math.floor(testersCompleted/3), low: testersCompleted * 2 },
        performanceMetrics: { avgStartupTime: `${300 + (override.id % 10) * 10}ms`, frozenFrames: `0.${override.id % 10}%` },
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
        feedback: generateFeedback(baseApp.name),
        chartData: generateChartData(testersCompleted),
        reviewNotes: override.status === 'In Review' ? "Pending tester availability." : undefined,
        testers: generateTesters(testersStarted),
      }
    })
  ]
    



    



    

    

    








