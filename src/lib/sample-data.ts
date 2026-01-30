// Sample data for the sample preview pages (no login required)
// These simulate real app testing scenarios

// === FREE COMMUNITY HUB SAMPLE ===
export const sampleCommunityAppDetails = {
  id: "sample-free-app",
  status: "IN_TESTING",
  totalDay: 14,
  currentDay: 6,
  rewardPoints: 150,
  minimumAndroidVersion: "10",
  averageTimeTesting: "15-20 min",
  instructionsForTester:
    "Please test all core features of the app including signup, browsing, and search functionality. Report any crashes, UI bugs, or performance issues you encounter. Try using the app on both WiFi and mobile data.",
  currentTester: 12,
  totalTester: 14,
  androidApp: {
    appName: "TaskFlow Pro",
    appLogoUrl:
      "https://play-lh.googleusercontent.com/vaxxIC1qaXOd1q1hmL7c66N-Mp4LXuQIuBZGM0dPIbwmyWcJAXbhIIZ8hNBWvar54c_j=w480-h960-rw",
    packageName: "com.taskflow.productivity",
    description:
      "TaskFlow Pro is a powerful task management and productivity app designed to help you organize your work and personal life. Features include smart task scheduling, habit tracking, team collaboration, and seamless integration with your calendar. Stay focused with our Pomodoro timer and track your productivity trends over time.",
    appCategory: {
      name: "Productivity",
    },
  },
  appOwner: {
    name: "Alex Developer",
    email: "alex@taskflow.app",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    emailVerified: true,
    createdAt: "2024-06-15T00:00:00.000Z",
  },
  testerRelations: [
    {
      status: "ACCEPTED",
      daysCompleted: 6,
      lastActivityAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      dailyVerifications: [
        {
          id: 1,
          dayNumber: 1,
          proofImageUrl:
            "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600",
          status: "VERIFIED",
          verifiedAt: "2026-01-24T10:30:00.000Z",
          metaData: { ipAddress: "192.168.1.1", automated: true },
        },
        {
          id: 2,
          dayNumber: 2,
          proofImageUrl:
            "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600",
          status: "VERIFIED",
          verifiedAt: "2026-01-25T11:15:00.000Z",
          metaData: { ipAddress: "192.168.1.1", automated: true },
        },
        {
          id: 3,
          dayNumber: 3,
          proofImageUrl:
            "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600",
          status: "VERIFIED",
          verifiedAt: "2026-01-26T09:45:00.000Z",
          metaData: { ipAddress: "192.168.1.1", automated: true },
        },
        {
          id: 4,
          dayNumber: 4,
          proofImageUrl:
            "https://images.unsplash.com/photo-1596742578443-7682ef5251cd?w=600",
          status: "VERIFIED",
          verifiedAt: "2026-01-27T14:20:00.000Z",
          metaData: { ipAddress: "192.168.1.1", automated: true },
        },
        {
          id: 5,
          dayNumber: 5,
          proofImageUrl:
            "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600",
          status: "VERIFIED",
          verifiedAt: "2026-01-28T16:00:00.000Z",
          metaData: { ipAddress: "192.168.1.1", automated: true },
        },
        {
          id: 6,
          dayNumber: 6,
          proofImageUrl:
            "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600",
          status: "VERIFIED",
          verifiedAt: "2026-01-29T10:00:00.000Z",
          metaData: { ipAddress: "192.168.1.1", automated: true },
        },
      ],
    },
  ],
  feedback: [
    {
      id: 1,
      message:
        "App crashes when trying to add a task with an empty title. The app should show a validation message instead.",
      type: "BUG",
      priority: "HIGH",
      testerId: "tester-1",
      dashboardAndHubId: 1,
      createdAt: new Date("2026-01-26T14:30:00.000Z"),
      updatedAt: new Date("2026-01-26T14:30:00.000Z"),
      media: {
        type: "IMAGE",
        mime: "image/jpeg",
        category: "FEEDBACK_MEDIA",
        src: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600",
        appId: null,
        blogId: null,
        feedbackId: 1,
        notificationId: null,
        supportRequestId: null,
        supportMessageId: null,
        createdAt: new Date("2026-01-26T14:30:00.000Z"),
        updatedAt: new Date("2026-01-26T14:30:00.000Z"),
      },
      tester: {
        name: "Sarah M.",
      },
    },
    {
      id: 2,
      message:
        "It would be great to have a dark mode option. The current white theme is too bright for nighttime use.",
      type: "SUGGESTION",
      priority: "LOW",
      testerId: "tester-2",
      dashboardAndHubId: 1,
      createdAt: new Date("2026-01-27T09:15:00.000Z"),
      updatedAt: new Date("2026-01-27T09:15:00.000Z"),
      media: {
        type: "IMAGE",
        mime: "image/jpeg",
        category: "FEEDBACK_MEDIA",
        src: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=600",
        appId: null,
        blogId: null,
        feedbackId: 2,
        notificationId: null,
        supportRequestId: null,
        supportMessageId: null,
        createdAt: new Date("2026-01-27T09:15:00.000Z"),
        updatedAt: new Date("2026-01-27T09:15:00.000Z"),
      },
      tester: {
        name: "Mike R.",
      },
    },
    {
      id: 3,
      message:
        "Love the intuitive UI and smooth animations! The onboarding flow was really helpful.",
      type: "PRAISE",
      priority: null,
      testerId: "tester-3",
      dashboardAndHubId: 1,
      createdAt: new Date("2026-01-28T11:00:00.000Z"),
      updatedAt: new Date("2026-01-28T11:00:00.000Z"),
      tester: {
        name: "Emma L.",
      },
    },
    {
      id: 4,
      message:
        "Found a typo in the settings menu under 'Notifications'. It says 'Notofications'.",
      type: "BUG",
      priority: "LOW",
      testerId: "tester-4",
      dashboardAndHubId: 1,
      createdAt: new Date("2026-01-29T10:00:00.000Z"),
      updatedAt: new Date("2026-01-29T10:00:00.000Z"),
      tester: {
        name: "David K.",
      },
    },
    {
      id: 5,
      message:
        "The homescreen widgets are fantastic! Really useful for quick access.",
      type: "PRAISE",
      priority: null,
      testerId: "tester-5",
      dashboardAndHubId: 1,
      createdAt: new Date("2026-01-29T15:00:00.000Z"),
      updatedAt: new Date("2026-01-29T15:00:00.000Z"),
      media: {
        type: "IMAGE",
        mime: "image/jpeg",
        category: "FEEDBACK_MEDIA",
        src: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600",
        appId: null,
        blogId: null,
        feedbackId: 5,
        notificationId: null,
        supportRequestId: null,
        supportMessageId: null,
        createdAt: new Date("2026-01-29T15:00:00.000Z"),
        updatedAt: new Date("2026-01-29T15:00:00.000Z"),
      },
      tester: {
        name: "Alex P.",
      },
    },
  ],
};

// === PAID DASHBOARD SAMPLE ===
export const samplePaidProjectDetails = {
  id: 101,
  name: "CloudSync Manager",
  packageName: "com.cloudsync.manager",
  icon: "https://play-lh.googleusercontent.com/DHBlQKvUNbopIS-VjQb3fUKQ_QH0Em-Q66AwG6LwD1Sach3lUvEWDb6hh8xNvKGmctU=w480-h960-rw",
  dataAiHint: "cloud storage app",
  category: "Productivity",
  description:
    "CloudSync Manager is your all-in-one cloud storage solution. Seamlessly sync files across all your devices, collaborate with teams in real-time, and never worry about losing important documents again. Features include automatic backup, version history, and enterprise-grade security.",
  status: "In Testing" as const,
  testersStarted: 12,
  testersCompleted: 8,
  totalDays: 14,
  avgTestersPerDay: 0.85,
  startedFrom: "15 Jan 2026",
  overallRating: 4.3,
  androidVersion: "12.0",
  pointsCost: 100,
  crashFreeRate: 99.8,
  performanceMetrics: {
    avgStartupTime: "1.2s",
    frozenFrames: "0.5%",
  },
  feedbackBreakdown: {
    total: 12,
    critical: 1,
    high: 3,
    low: 8,
  },
  chartData: [
    { date: "Jan 15", bugs: 0 },
    { date: "Jan 16", bugs: 2 },
    { date: "Jan 17", bugs: 1 },
    { date: "Jan 18", bugs: 3 },
    { date: "Jan 19", bugs: 1 },
    { date: "Jan 20", bugs: 0 },
  ],
  testingInstructions:
    "Please test the file upload and sync functionality across multiple devices. Check the real-time collaboration features and report any sync conflicts or delays. Test with various file types and sizes.",
  deviceCoverage: [
    { device: "Samsung Galaxy", testers: 5 },
    { device: "Google Pixel", testers: 4 },
    { device: "OnePlus", testers: 2 },
    { device: "Xiaomi", testers: 1 },
  ],
  osCoverage: [
    { version: "Android 14", testers: 6 },
    { version: "Android 13", testers: 4 },
    { version: "Android 12", testers: 2 },
  ],
  testers: [
    {
      id: 1,
      name: "John Smith",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      country: "United States",
      device: "Samsung Galaxy S23",
      os: "Android 14",
      screenSize: "6.1 inch",
      language: "English",
      ram: "8GB",
      network: "WiFi",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Maria Garcia",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      country: "Spain",
      device: "Google Pixel 8",
      os: "Android 14",
      screenSize: "6.2 inch",
      language: "Spanish",
      ram: "12GB",
      network: "5G",
      rating: 4.8,
    },
    {
      id: 3,
      name: "Akira Tanaka",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      country: "Japan",
      device: "OnePlus 12",
      os: "Android 14",
      screenSize: "6.7 inch",
      language: "Japanese",
      ram: "16GB",
      network: "WiFi",
      rating: 4.2,
    },
    {
      id: 4,
      name: "Sophie Martin",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      country: "France",
      device: "Samsung Galaxy A54",
      os: "Android 13",
      screenSize: "6.4 inch",
      language: "French",
      ram: "8GB",
      network: "4G",
      rating: 4.6,
    },
    {
      id: 5,
      name: "David Chen",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      country: "Canada",
      device: "Google Pixel 7",
      os: "Android 13",
      screenSize: "6.3 inch",
      language: "English",
      ram: "8GB",
      network: "WiFi",
      rating: 4.4,
    },
    {
      id: 6,
      name: "Lisa Anderson",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      country: "Australia",
      device: "Samsung Galaxy S22",
      os: "Android 13",
      screenSize: "6.1 inch",
      language: "English",
      ram: "8GB",
      network: "5G",
      rating: 4.7,
    },
  ],
  feedback: [
    {
      id: 1,
      type: "Bug",
      title: "Sync fails on large files",
      description:
        "When uploading files larger than 500MB, the sync process hangs at 95% and eventually times out. This happens consistently on both WiFi and mobile data.",
      rating: 4,
      createdAt: "2026-01-26T14:30:00.000Z",
      screenshot:
        "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600",
      tester: {
        name: "John Smith",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      },
    },
    {
      id: 2,
      type: "Bug",
      title: "Notification badge not clearing",
      description:
        "After viewing new shared files, the notification badge on the app icon doesn't clear. Have to force close and reopen the app.",
      rating: 3,
      createdAt: "2026-01-27T10:15:00.000Z",
      tester: {
        name: "Maria Garcia",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      },
    },
    {
      id: 3,
      type: "Suggestion",
      title: "Add offline mode",
      description:
        "It would be great to have an offline mode where we can mark files for offline access. Essential for travel.",
      rating: 5,
      createdAt: "2026-01-28T09:00:00.000Z",
      tester: {
        name: "Akira Tanaka",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      },
    },
    {
      id: 4,
      type: "Praise",
      title: "Beautiful UI",
      description:
        "The interface is clean and intuitive. Love the file preview feature and the smooth animations throughout the app.",
      rating: 5,
      createdAt: "2026-01-28T16:20:00.000Z",
      tester: {
        name: "Sophie Martin",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      },
    },
  ],
  topGeographies: [
    { country: "United States", testers: 4, flag: "🇺🇸" },
    { country: "Germany", testers: 5, flag: "🇩🇪" },
    { country: "Japan", testers: 3, flag: "🇯🇵" },
  ],
};
