/**
 * Centralized route constants — single source of truth for all route paths.
 * Import from here instead of hardcoding route strings.
 */
export const ROUTES = {
  // Public auth
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REGISTER_CHECK_EMAIL: "/auth/register/check-email",
    VERIFICATION: "/auth/verification",
  },

  // Public
  PUBLIC: {
    HOME: "/",
    OFFERS: "/offers",
    HOW_IT_WORKS: "/how-it-works",
    PRICING: "/pricing",
    REVIEWS: "/reviews",
    BLOG: "/blog",
    SUPPORT: "/support",
  },

  // Admin
  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin/dashboard",
    FINANCE: "/admin/finance",
    INVOICE: "/admin/invoice",
    USERS: "/admin/users",
    SUBMISSIONS_PAID: "/admin/submissions-paid",
    SUBMISSIONS_FREE: "/admin/submissions-free",
    SUBMISSIONS: "/admin/submissions",
    APPLICATIONS: "/admin/applications",
    SUGGESTIONS: "/admin/suggestions",
    NOTIFICATIONS: "/admin/notifications",
    PROMO_CODES: "/admin/promo-codes",
    REVIEWS: "/admin/reviews",
    USER_REVIEWS: "/admin/user-reviews",
    BLOG_AUTHORS: "/admin/blog-authors",
    BLOG_MANAGEMENT: "/admin/blog-management",
    LOGS: "/admin/logs",
    SUPPORT: "/admin/support",
    PROFILE: "/admin/profile",
    FEEDBACK: "/admin/feedback",
    AUTH: {
      LOGIN: "/admin/auth/login",
    },
  },

  // Tester
  TESTER: {
    ROOT: "/tester",
    DASHBOARD: "/tester/dashboard",
    PROJECTS: "/tester/projects",
    COMMUNITY_TASKS: "/tester/community-tasks",
    SETUP: "/tester/setup",
    ACTIVITIES: "/tester/activities",
    EARNINGS: "/tester/earnings",
    NOTIFICATIONS: "/tester/notifications",
    SUPPORT: "/tester/support",
    PROFILE: "/tester/profile",
    SETTINGS: "/tester/settings",
    AUTH: {
      LOGIN: "/tester/auth/login",
      REGISTER: "/tester/auth/register",
    },
  },

  // Authenticated user routes
  AUTHENTICATED: {
    DASHBOARD: "/dashboard",
    COMMUNITY_DASHBOARD: "/community-dashboard",
    NOTIFICATIONS: "/notifications",
    PROFILE: "/profile",
    PROFILE_SETUP: "/profile/profile-setup",
    WALLET: "/wallet",
    BILLING: "/billing",
    SETTINGS: "/settings",
  },
} as const;
