import type { ReactNode } from "react";

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatarUrl: string;
    dataAiHint?: string;
  };
  date: string;
  imageUrl: string;
  dataAiHint?: string;
  tags: string[];
};

export type Testimonial = {
  name: string;
  role: string;
  avatar: string;
  dataAiHint?: string;
  comment: string;
};

export type RoadmapDetail = {
  title: string;
  description: string;
};

export type RoadmapStep = {
  step: number;
  title: string;
  description: string;
  badgeText: string;
  details: RoadmapDetail[];
};

export enum UserAuthType {
  EMAIL_PASSWORD = "EMAIL_PASSWORD",
  GOOGLE = "GOOGLE",
}

export enum UserProfileType {
  INDIVIDUAL = "INDIVIDUAL",
  COMPANY = "COMPANY",
  AGENCY = "AGENCY",
  CLIENT_MANAGER = "CLIENT_MANAGER",
}

export enum UserJobRole {
  DEVELOPER = "DEVELOPER",
  QA_TESTER = "QA_TESTER",
  PRODUCT_MANAGER = "PRODUCT_MANAGER",
  DESIGNER = "DESIGNER",
  BUSINESS_OWNER = "BUSINESS_OWNER",
  MARKETING = "MARKETING",
  SALES = "SALES",
  PROJECT_MANAGER = "PROJECT_MANAGER",
  STUDENT = "STUDENT",
  HOBBYIST = "HOBBYIST",
  AGENCY = "AGENCY",
  OTHER = "OTHER",
}

export enum UserCompanySize {
  SIZE_1 = "SIZE_1",
  SIZE_2_10 = "SIZE_2_10",
  SIZE_11_50 = "SIZE_11_50",
  SIZE_51_200 = "SIZE_51_200",
  SIZE_201_500 = "SIZE_201_500",
  SIZE_501_1000 = "SIZE_501_1000",
  SIZE_1001_5000 = "SIZE_1001_5000",
  SIZE_5001_10000 = "SIZE_5001_10000",
  SIZE_10000_PLUS = "SIZE_10000_PLUS",
}

export enum UserCompanyPosition {
  FOUNDER_CEO = "FOUNDER_CEO",
  CTO_TECH_LEAD = "CTO_TECH_LEAD",
  PRODUCT_MANAGER = "PRODUCT_MANAGER",
  PROJECT_MANAGER = "PROJECT_MANAGER",
  SOFTWARE_ENGINEER = "SOFTWARE_ENGINEER",
  QA_TESTER = "QA_TESTER",
  DESIGNER = "DESIGNER",
  MARKETING = "MARKETING",
  SALES_BUSINESS_DEV = "SALES_BUSINESS_DEV",
  OPERATIONS_ADMIN = "OPERATIONS_ADMIN",
  CUSTOMER_SUPPORT = "CUSTOMER_SUPPORT",
  OTHER = "OTHER",
}

export enum UserExperienceLevel {
  INTERN = "INTERN",
  JUNIOR = "JUNIOR",
  MID = "MID",
  SENIOR = "SENIOR",
  LEAD = "LEAD",
  DIRECTOR = "DIRECTOR",
  OTHER = "OTHER",
}

export enum UserTotalPublishedApps {
  PUB_0 = "PUB_0",
  PUB_1_5 = "PUB_1_5",
  PUB_6_10 = "PUB_6_10",
  PUB_11_20 = "PUB_11_20",
  PUB_21_50 = "PUB_21_50",
  PUB_51_PLUS = "PUB_51_PLUS",
}

export enum UserDevelopmentPlatform {
  NATIVE_IOS = "NATIVE_IOS",
  NATIVE_ANDROID = "NATIVE_ANDROID",
  FLUTTER = "FLUTTER",
  REACT_NATIVE = "REACT_NATIVE",
  UNITY = "UNITY",
  DRAG_AND_DROP = "DRAG_AND_DROP",
  OTHER = "OTHER",
}

export enum UserPublishFrequency {
  FIRST_APP = "FIRST_APP",
  OCCASIONAL = "OCCASIONAL",
  REGULAR = "REGULAR",
  FREQUENT = "FREQUENT",
  OTHER = "OTHER",
}

export enum UserTestingServiceReason {
  VERIFY_FUNCTIONALITY = "VERIFY_FUNCTIONALITY",
  USER_FEEDBACK = "USER_FEEDBACK",
  COMPLIANCE_GOOGLE_PLAY = "COMPLIANCE_GOOGLE_PLAY",
  SAVE_TIME = "SAVE_TIME",
  OTHER = "OTHER",
}

export enum UserCommunicationMethod {
  EMAIL = "EMAIL",
  PHONE = "PHONE",
  WHATSAPP = "WHATSAPP",
  TELEGRAM = "TELEGRAM",
  SLACK = "SLACK",
  OTHER = "OTHER",
}

export enum UserNotificationPreference {
  APP_SUBMITTED = "APP_SUBMITTED",
  TEST_COMPLETED = "TEST_COMPLETED",
  TEST_ASSIGNED = "TEST_ASSIGNED",
  COMMENT_ADDED = "COMMENT_ADDED",
  PROMOTIONS = "PROMOTIONS",
  APP_SUBMISSION = "APP_SUBMISSION",
  OTHER = "OTHER",
}

export enum TesterStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  DROPPED = "DROPPED",
  REMOVED = "REMOVED",
  REJECTED = "REJECTED",
}

export type UserDataAttributes = {
  id: number;
  name: string;
  email: string;
  emailVerified: string;
  image: string;

  createdAt: string;
  updatedAt: string;
};

export type UserProfileDataAttributes = {
  id: number;
  userId: string;
  first_name: string;
  last_name: string;
  phone?: string;
  auth_type: UserAuthType;

  roleId: number;
  banned?: boolean;
  ban_reason?: string;
  country?: string;

  profile_type?: UserProfileType;
  job_role?: UserJobRole;
  company_name?: string;
  company_size?: UserCompanySize;
  position_in_company?: UserCompanyPosition;
  company_website?: string;

  experience_level?: UserExperienceLevel;
  total_published_apps?: UserTotalPublishedApps;
  platform_development?: UserDevelopmentPlatform;
  publish_frequency?: UserPublishFrequency;

  service_usage?: UserTestingServiceReason;

  communication_methods?: UserCommunicationMethod[];
  notification_preference?: UserNotificationPreference[];

  device_company?: String;
  device_model?: String;
  ram?: String;
  os?: String;
  screen_resolution?: String;
  language?: String;
  network?: String;

  initial: Boolean;

  createdAt: string;
  updatedAt: string;
};

export type PointsPackage = {
  name: string;
  price: number;
  points: number;
  description: string;
};

export type ProcessStep = {
  title: string;
  imageUrl: string;
  dataAiHint: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ProjectFeedback = {
  id: number;
  tester: string;
  type: "Bug" | "Suggestion" | "Praise";
  severity: "Critical" | "High" | "Medium" | "Low" | "N/A";
  status: "New" | "In Progress" | "Resolved" | "Closed";
  comment: string;
  date: string;
  screenshot?: string | null;
  videoUrl?: string | null;
};

export type TesterDetails = {
  id: string;
  name: string;
  avatar: string;
  country: string;
  state: string;
  device: string;
  ram: string;
  os: string;
  screenSize: string;
  language: string;
  network: "WiFi" | "Cellular";
  rating: number;
};

export type SubmittedFeedback = {
  id: number;
  type: "Bug" | "Suggestion" | "Praise";
  comment: string;
  screenshot: string | null;
  tester: string;
  severity: "Critical" | "High" | "Medium" | "Low" | "N/A";
  videoUrl?: string | null;
};

export interface ControlRoomResponse {
  createdAt: string;
  updatedAt: string;
  id?: number | undefined;
  profileSurveyPoints?: number | null | undefined;
  pointsWithdrawalLimit?: number | null | undefined;
  pointsWithdrawalThreshold?: number | null | undefined;
}

export interface DashboardDataResponse {
  wallet: number;
  inReviewApps: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    appId: number;
    appOwnerId: string;
    currentTester: number;
    totalTester: number;
    currentDay: number;
    totalDay: number;
    instructionsForTester: string | null;
    rewardPoints: number | null;
    costPoints: number | null;
    averageTimeTesting: string | null;
    status:
      | "IN_REVIEW"
      | "DRAFT"
      | "REJECTED"
      | "IN_TESTING"
      | "COMPLETED"
      | "ON_HOLD"
      | "REQUESTED"
      | "AVAILABLE";
  }[];
  statusCounts: {
    _count: {
      _all: number;
    };
  }[];
}

export interface AppData {
  id: number;
  appId: number;
  appOwnerId: string;
  appType: "PAID" | "FREE";
  currentTester: string;
  totalTester: number;
  currentDay: number;
  totalDay: number;
  instructionsForTester: string | null;
  rewardPoints: number | null;
  costPoints: number | null;
  averageTimeTesting: string | null;
  minimumAndroidVersion: number;
  status:
    | "IN_REVIEW"
    | "DRAFT"
    | "REJECTED"
    | "IN_TESTING"
    | "COMPLETED"
    | "ON_HOLD"
    | "REQUESTED"
    | "AVAILABLE";
  createdAt: Date;
  updatedAt: Date;
}

export interface AppCategory {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  isActive: boolean;
}

export interface AndroidApp {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  appName: string;
  appLogoUrl: string;
  appScreenshotUrl1: string;
  appScreenshotUrl2: string;
  packageName: string;
  description: string | null;
  appCategoryId: number;
  appCategory: AppCategory;
}

export interface HubSubmittedAppResponse {
  androidApp: AndroidApp;
  id: number;
  appId: number;
  appOwnerId: string;
  appOwner: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
  };
  appType: AppData["appType"];
  currentTester: number;
  totalTester: number;
  currentDay: number;
  totalDay: number;
  instructionsForTester: string | null;
  rewardPoints: number | null;
  costPoints: number | null;
  averageTimeTesting: string | null;
  minimumAndroidVersion: number;
  status: AppData["status"];
  statusDetails: {
    title: string;
    description: string;
    image: string;
    video: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface HubDataResponse {
  wallet: number;
  availableApps: AppData[];
  statusCounts: {
    _count: {
      _all: number;
    };
  }[];
}

export type SubmittedAppsCount = {
  IN_REVIEW: number;
  DRAFT: number;
  REJECTED: number;
  IN_TESTING: number;
  COMPLETED: number;
  ON_HOLD: number;
  REQUESTED: number;
  AVAILABLE: number;
};

export interface AppCategoriesResponse {
  id: number;
  name: string;
  isActive: true;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationReponse {
  id: number;
  userId: string | null;
  title: string;
  description: string;
  type:
    | "NEW_TEST"
    | "FEEDBACK_RECEIVED"
    | "TEST_COMPLETED"
    | "BUG_REPORT"
    | "BUG_REPORT"
    | "POINTS_AWARDED"
    | "APP_SUBMISSION"
    | "OTHER";
  url: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWallerResponse {
  id: number;
  userId: string;
  totalPoints: number;
  totalPackages: number;
  lastUpdated: Date;
  createdAt: Date;
}

export interface PricingResponse {
  id: string;
  name: string;
  price: number;
  package: number;
  features: string[];
  isActive: true;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionResponse {
  id: string;
  userId: string;
  token: null;
  expiresAt: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
  isCurrent: boolean;
  city: string;
  region: string;
  country: string;
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  deviceBrand: string;
  deviceModel: string;
  deviceType: "desktop" | "mobile" | "tablet";
  lastLogin: string;
}

export type DeviceCoverage = {
  device: string;
  testers: number;
};

export type OSCoverage = {
  version: string;
  testers: number;
};

export type Geography = {
  country: string;
  testers: number;
  flag: string;
};

export type FeedbackBreakdown = {
  total: number;
  critical: number;
  high: number;
  low: number;
};

export type PerformanceMetrics = {
  avgStartupTime: string;
  frozenFrames: string;
};

export type ChartData = {
  date: string;
  bugs: number;
};

export type Project = {
  id: number;
  name: string;
  packageName: string;
  icon: string;
  dataAiHint?: string;
  category: string;
  status: "In Testing" | "In Review" | "Completed" | "Draft" | "Rejected";
  testerStatus?: TesterStatus;
  testersStarted: number;
  testersCompleted: number;
  totalDays: number;
  avgTestersPerDay: number;
  startedFrom: string;
  description: string;
  testingInstructions: string;
  androidVersion: string;
  pointsCost: number;
  crashFreeRate: number;
  overallRating: number;
  feedbackBreakdown: FeedbackBreakdown;
  performanceMetrics: PerformanceMetrics;
  deviceCoverage: DeviceCoverage[];
  osCoverage: OSCoverage[];
  topGeographies: Geography[];
  feedback: ProjectFeedback[];
  chartData: ChartData[];
  reviewNotes?: string;
  testers: TesterDetails[];
  rejectionReason?: {
    title: string;
    description: string;
    imageUrl: string;
    dataAiHint: string;
  };
};

export type CommunityApp = {
  id: number | string;
  name: string;
  icon: string;
  shortDescription: string;
  category: string;
  rewardPoints: number;
  androidVersion: string;
  estimatedTime: string;
  dataAiHint?: string;
};
