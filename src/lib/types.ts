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
  OTHER = "OTHER",
}

export type UserProfileData = {
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

  service_usage?: UserTestingServiceReason[];

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

export type CommunityApp = {
  id: number;
  name: string;
  icon: string;
  dataAiHint?: string;
  category: string;
  shortDescription: string;
  points: number;
  androidVersion: string;
  estimatedTime: string;
  playStoreUrl?: string;
  screenshots: { url: string; alt: string; dataAiHint?: string }[];
  testingInstructions: string;
  status:
    | "available"
    | "ongoing"
    | "completed"
    | "requested"
    | "request_rejected";
  progress?: number;
  completedDate?: string;
  totalDays: number;
  rejectionReason?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type Notification = {
  id: number;
  title: string;
  description: string;
  date: string;
  type:
    | "new_test"
    | "feedback_received"
    | "test_completed"
    | "bug_report"
    | "points_awarded";
  read: boolean;
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

export type Project = {
  id: number;
  name: string;
  packageName: string;
  icon: string;
  dataAiHint?: string;
  category: string;
  status: "In Testing" | "Completed" | "In Review" | "Draft" | "Rejected";
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
  feedbackBreakdown: {
    total: number;
    critical: number;
    high: number;
    low: number;
  };
  performanceMetrics: {
    avgStartupTime: string;
    frozenFrames: string;
  };
  deviceCoverage: {
    device: string;
    testers: number;
  }[];
  osCoverage: {
    version: string;
    testers: number;
  }[];
  topGeographies: {
    country: string;
    testers: number;
    flag: string;
  }[];
  feedback: ProjectFeedback[];
  chartData: { date: string; bugs: number }[];
  reviewNotes?: string;
  rejectionReason?: {
    title: string;
    description: string;
    imageUrl?: string;
    dataAiHint?: string;
  };
  testers: TesterDetails[];
};

export type SubmittedFeedback = {
  id: number;
  type: "Bug" | "Suggestion" | "Praise";
  comment: string;
  screenshot: string | null;
  tester: string;
  severity: "Critical" | "High" | "Medium" | "Low" | "N/A";
};

export interface ControlRoomResponse {
  createdAt: string;
  updatedAt: string;
  id?: number | undefined;
  profileSurveyPoints?: number | null | undefined;
  pointsWithdrawalLimit?: number | null | undefined;
  pointsWithdrawalThreshold?: number | null | undefined;
}
