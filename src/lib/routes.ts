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

  // Admin
  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin/dashboard",
    AUTH: {
      LOGIN: "/admin/auth/login",
    },
  },

  // Tester
  TESTER: {
    ROOT: "/tester",
    DASHBOARD: "/tester/dashboard",
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
  },
} as const;
