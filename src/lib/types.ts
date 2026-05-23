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
  views: number;
};

export type Testimonial = {
  name: string;
  role: string;
  avatar: string;
  dataAiHint?: string;
  comment: string;
  image?: string;
  appLink?: string;
  tags?: string[];
  rating?: number; // Adding rating just in case we want to show stars explicitly per review later, though we hardcoded 5 stars previously.
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

  device_company?: string;
  device_model?: string;
  ram?: string;
  os?: string;
  screen_resolution?: string;
  language?: string;
  network?: string;

  // About You fields (for testers)
  years_of_experience?: string;
  areas_of_expertise?: string[];
  bio?: string;

  initial: boolean;

  createdAt: string;
  updatedAt: string;
};

export type UserProfileData = UserProfileDataAttributes;

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
      | "AVAILABLE"
      | "ACCEPTED";
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
    | "AVAILABLE"
    | "ACCEPTED";
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
  feedback: {
    id: number;
    message: string;
    type: "BUG" | "SUGGESTION" | "PRAISE" | "OTHER";
    priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | null;
    testerId: string;
    dashboardAndHubId: number;
    createdAt: Date;
    updatedAt: Date;
    media: {
      type: "IMAGE" | "VIDEO";
      mime: string;
      category:
        | "APP_LOGO"
        | "SCREENSHOT"
        | "FEEDBACK_MEDIA"
        | "FEATURED_IMAGE"
        | "AUTHOR_IMAGE"
        | "OTHER";
      src: string;
      appId: number | null;
      blogId: number | null;
      feedbackId: number | null;
      notificationId: number | null;
      supportRequestId: number | null;
      supportMessageId: number | null;
      createdAt: Date;
      updatedAt: Date;
    };
    tester: {
      name: string;
      image: string | null;
    };
  }[];
  testerRelations: {
    id: number;
    testerId: string;
    tester: {
      name: string;
      email: string;
      image: string | null;
      createdAt: Date;
      userDetail: {
        country: string | null;
        profile_type: UserProfileType | null;
        job_role: UserJobRole | null;
        experience_level: UserExperienceLevel | null;
        device_company: string | null;
        device_model: string | null;
        ram: string | null;
        os: string | null;
        screen_resolution: string | null;
        language: string | null;
        network: string | null;
      } | null;
      ratings?: { rating: number }[];
    };
    isActive: boolean;
    assignmentSource?: TesterAssignmentSource;
    status:
      | "PENDING"
      | "IN_PROGRESS"
      | "COMPLETED"
      | "DROPPED"
      | "REMOVED"
      | "REJECTED";
    statusDetails: {
      title: string;
      description: string;
      image: string;
      video: string;
    } | null;
    daysCompleted: number;
    lastActivityAt?: string | Date;
    dailyVerifications?: {
      id: number;
      dayNumber: number;
      proofImageUrl: string;
      status: "PENDING" | "VERIFIED" | "REJECTED";
      verifiedAt: string;
      metaData?: any;
      rejectionReason?: string;
    }[];
  }[];
  paymentInfo?: {
    amountPaid: number;
    currency: string;
    isPersisted?: boolean;
  } | null;
  rewardMoney?: number;
  costMoney?: number;
  promoCode?: {
    id: number;
    code: string;
    discountType: string;
    discountValue: number;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface HubDataResponse {
  wallet: number;
  appsSubmitted: number;
  testersEngaged: number;
  testsCompleted: number;
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
  ACCEPTED: number; // Tester approved but testing not started (waiting for min testers)
};

export interface AppCategoriesResponse {
  id: number;
  name: string;
  isActive: true;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationResponse {
  id: number;
  userId: string | null;
  title: string;
  description: string;
  type:
    | "NEW_TEST"
    | "FEEDBACK_RECEIVED"
    | "TEST_COMPLETED"
    | "BUG_REPORT"
    | "POINTS_AWARDED"
    | "APP_SUBMISSION"
    | "OTHER";
  url: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type Notification = NotificationResponse;

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

export interface RegionalPricingResponse {
  id: number;
  country_code: string;
  country_name: string;
  currency_code: string;
  currency_symbol: string;
  amount: number;
  is_active: boolean;
  updatedAt: string;
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
  status:
    | "In Testing"
    | "In Review"
    | "Completed"
    | "Draft"
    | "Rejected"
    | "Approved"
    | "Available";
  appStatus?: string;
  testerStatus?: TesterStatus;
  testersStarted: number;
  testersCompleted: number;
  totalDays: number;
  currentDay: number;
  avgTestersPerDay: number;
  startedFrom: string;
  description: string;
  testingInstructions: string;
  androidVersion: string;
  pointsCost: number;
  rewardMoney?: number;
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
  dailyVerifications?: {
    id: number;
    dayNumber: number;
    proofImageUrl: string;
    status: "PENDING" | "VERIFIED" | "REJECTED";
    verifiedAt: string | null;
    rejectionReason: string | null;
    metaData: any;
  }[];
};

export type TesterAssignmentSource = "SELF_JOIN" | "ADMIN_ASSIGNED";

export type TesterProjectResponse = {
  id: number;
  appId: number;
  appName: string;
  appLogo: string;
  packageName: string;
  category: string;
  description: string | null;
  appScreenshot1: string;
  appScreenshot2: string;
  appType?: "PAID" | "FREE";
  assignmentSource: TesterAssignmentSource;
  appStatus:
    | "IN_REVIEW"
    | "DRAFT"
    | "REJECTED"
    | "IN_TESTING"
    | "COMPLETED"
    | "ON_HOLD"
    | "REQUESTED"
    | "AVAILABLE";
  testerStatus: TesterStatus | null;
  totalDay: number;
  currentDay: number;
  totalTester: number;
  currentTester: number;
  rewardPoints: number | null;
  costPoints: number | null;
  rewardMoney?: number | null;
  costMoney?: number | null;
  instructionsForTester: string | null;
  minimumAndroidVersion: number;
  daysCompleted: number;
  joinedAt: string | null;
  completedAt: string | null;
  lastActivityAt: string | null;
  dailyVerifications: {
    id: number;
    dayNumber: number;
    proofImageUrl: string;
    status: "PENDING" | "VERIFIED" | "REJECTED";
    verifiedAt: string | null;
    rejectionReason: string | null;
    metaData: any;
  }[];
  feedbackCount: number;
  totalTesters: number;
  testerRating?: number;
  createdAt: string;
  updatedAt: string;
};

export type CommunityApp = {
  id: number | string;
  name: string;
  icon: string;
  shortDescription: string;
  category: string;
  points?: number;
  rewardPoints?: number;
  androidVersion: string;
  estimatedTime: string;
  dataAiHint?: string;
  playStoreUrl?: string;
  screenshots?: {
    url: string;
    alt: string;
    dataAiHint?: string;
  }[];
  testingInstructions?: string;
  status?: string;
  progress?: number;
  totalDays?: number;
  completedDate?: string;
  rejectionReason?: string;
};

export interface BillingHistoryItem {
  id: string;
  invoiceId: string | null;
  orderId: number;
  razorpayOrderId: string;
  date: string;
  amount: number;
  currency: string;
  status: string;
  plan: string;
  packages: number;
  paymentMethod: string | null;
}

export interface PaymentConfigResponse {
  isConfigured: boolean;
  keyId?: string;
  currency?: string;
  name?: string;
  description?: string;
  image?: string;
  theme?: {
    color: string;
  };
}

export interface CreateOrderResponse {
  orderId: number;
  razorpayOrderId: string;
  razorpayKeyId: string;
  amount: number;
  currency: string;
  planName: string;
  packages: number;
  expiresAt?: string;
}

export interface PaymentVerificationPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  orderId: number;
  paymentId: number;
  invoiceId: string;
  packagesAwarded: number;
  totalPackages: number;
}

export interface PromoCodeResponse {
  id: number;
  code: string;
  discountType: string;
  discountValue: number;
  maxUses: number | null;
  usedCount: number;
  updatedAt: string;
}

export interface TesterEarningsResponse {
  availableBalance: number;
  pendingBalance: number;
  pendingProjectsCount: number;
  lifetimeEarnings: number;
}

export interface TesterEarningHistoryItem {
  id: number;
  date: string;
  project: string;
  amount: number;
  status: "CREDIT" | "DEBIT" | "HOLD";
  action: string | null;
}

export interface TesterEarningHistoryResponse {
  history: TesterEarningHistoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface WithdrawalHistoryItem {
  id: number;
  userId: string;
  amount: number;
  currency: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PAID";
  requestedAt: string;
  processedAt: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WithdrawalHistoryResponse {
  withdrawals: WithdrawalHistoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TesterActivityItem {
  id: number;
  actionType: string;
  description: string | null;
  status: "SUCCESS" | "FAIL";
  appName: string | null;
  appLogo: string | null;
  createdAt: string;
}

export interface TesterActivitiesResponse {
  activities: TesterActivityItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BillingInfo {
  id: number;
  userId: string;
  name: string;
  email: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country: string;
  gstin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceDetail {
  id: number;
  paymentId: number;
  userId: string;
  invoice_number: string;
  invoice_type: string;
  service_name: string;
  sac_code: string;
  period: string | null;
  quantity: number;
  unit_price: number | null;
  tax_rate: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  due_date: string | null;
  place_of_supply: string | null;
  supply_type: string | null;
  amount_in_words: string | null;
  lut_number: string | null;
  createdAt: string;
  payment: {
    id: number;
    razorpayPaymentId: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
    status: string;
    method: string | null;
    bank: string | null;
    fee: number | null;
    tax: number | null;
    order: {
      id: number;
      packageCount: number | null;
      plan: { name: string; package: number } | null;
    };
  };
  user: {
    id: string;
    name: string;
    email: string;
    billingInfo: BillingInfo | null;
    userDetail: {
      company_name: string | null;
    } | null;
  };
}

export interface FinanceDashboardData {
  totalRevenue: number;
  totalOrders: number;
  paidOrders: number;
  totalPayments: number;
  capturedPayments: number;
  totalInvoices: number;
  totalRefunds: number;
  ordersByStatus: Record<string, number>;
  packagesSold: number;
  pointsDistributed: number;
  testerEarnings: number;
  pendingWithdrawalsCount: number;
  pendingWithdrawalsAmount: number;
  refundsByStatus: Record<string, { count: number; amount: number }>;
  monthlyRevenue: Array<{ month: string; revenue: number; count: number }>;
}

export interface FinanceOrder {
  id: number;
  razorpayOrderId: string;
  receipt: string;
  amount: number;
  currency: string;
  status: string;
  invoiceId: string | null;
  packageCount: number | null;
  plan: { name: string; package: number } | null;
  user: { id: string; name: string; email: string; image: string | null };
  payment: {
    id: number;
    razorpayPaymentId: string;
    amount: number;
    status: string;
    method: string | null;
    createdAt: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface FinancePayment {
  id: number;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  amount: number;
  amount_inr: number | null;
  currency: string;
  status: string;
  method: string | null;
  bank: string | null;
  fee: number | null;
  tax: number | null;
  amountRefunded: number;
  refundStatus: string | null;
  captured: boolean;
  customer_name: string | null;
  customer_email: string | null;
  order: { id: number; razorpayOrderId: string; amount: number; status: string; invoiceId: string | null };
  user: { id: string; name: string; email: string; image: string | null } | null;
  refunds: Array<{ id: number; amount: number; status: string; reason: string | null }>;
  invoice: { id: number; invoice_number: string } | null;
  createdAt: string;
}

export interface FinanceInvoice {
  id: number;
  invoice_number: string;
  service_name: string;
  user: { id: string; name: string; email: string };
  payment: {
    id: number;
    razorpayPaymentId: string;
    amount: number;
    currency: string;
    status: string;
    method: string | null;
    createdAt: string;
  };
  createdAt: string;
}

export interface FinanceRefund {
  id: number;
  razorpayRefundId: string;
  razorpayPaymentId: string;
  amount: number;
  currency: string;
  status: string;
  reason: string | null;
  speed: string | null;
  payment: {
    id: number;
    razorpayPaymentId: string;
    amount: number;
    currency: string;
    status: string;
    method: string | null;
    user: { id: string; name: string; email: string } | null;
  };
  createdAt: string;
  processedAt: string | null;
}

export interface FinanceWithdrawal {
  id: number;
  amount: number;
  currency: string;
  status: string;
  note: string | null;
  user: { id: string; name: string; email: string; image: string | null };
  requestedAt: string;
  processedAt: string | null;
  createdAt: string;
}

export interface FinancePricing {
  id: number;
  country_code: string;
  country_name: string;
  currency_code: string;
  currency_symbol: string;
  amount: number;
  is_active: boolean;
  updatedAt: string;
}

export interface FinancePlan {
  id: string;
  name: string;
  price: number;
  package: number;
  features: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FinancePaymentMethod {
  method: string;
  count: number;
  totalAmount: number;
}

export interface FinancePagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FinanceUserWallet {
  wallet: { totalPoints: number; totalPackages: number; balanceMoney: number };
  transactions: Array<{
    id: number;
    action: string | null;
    points: number | null;
    package: number | null;
    transactionType: string;
    status: string;
    paymentMethod: string | null;
    createdAt: string;
  }>;
  withdrawals: Array<{
    id: number;
    amount: number;
    currency: string;
    status: string;
    note: string | null;
    requestedAt: string;
    processedAt: string | null;
  }>;
}

export interface PlayStoreDeclaration {
  id: number;
  dashboardAndHubId: number;
  appOwnerId: string;
  answers: DeclarationAnswers;
  autoGeneratedData: AutoGeneratedStats;
  status: "DRAFT" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
}

export interface CustomQuestion {
  id: string;
  question: string;
  answer: string;
}

export interface DeclarationAnswers {
  recruitmentMethod: string;
  recruitmentEase: string;
  testerEngagement: string;
  feedbackSummary: string;
  feedbackCollectionMethod: string;
  intendedAudience: string;
  valueDescription: string;
  expectedInstalls: string;
  changesMade: string;
  readinessRationale: string;
  customQuestions: CustomQuestion[];
  deletedQuestions?: string[];
}

export interface AutoGeneratedStats {
  totalTesters: number;
  completedTesters: number;
  totalDays: number;
  currentDay: number;
  bugs: number;
  suggestions: number;
  praise: number;
  totalFeedback: number;
  totalRatings: number;
  avgRating: number | null;
  appType: "PAID" | "FREE";
  hasCriticalBugs: boolean;
  testingStartDate: string | null;
  testingEndDate: string | null;
  packageName: string;
  category: string;
}
