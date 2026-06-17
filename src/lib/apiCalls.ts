import axios from "axios";
import API_ROUTES from "./apiRoutes";
import { authClient } from "./auth-client";
import { ROUTES } from "./routes";
import {
  AppCategoriesResponse,
  AppData,
  DashboardDataResponse,
  HubDataResponse,
  HubSubmittedAppResponse,
  NotificationResponse,
  PricingResponse,
  SessionResponse,
  SubmittedAppsCount,
  UserDataAttributes,
  UserProfileDataAttributes,
  UserWallerResponse,
  PaymentConfigResponse,
  BillingHistoryItem,
  CreateOrderResponse,
  PaymentVerificationPayload,
  PaymentVerificationResponse,
  TesterProjectResponse,
  PromoCodeResponse,
  TesterEarningsResponse,
  TesterEarningHistoryResponse,
  WithdrawalHistoryResponse,
  TesterActivitiesResponse,
  BillingInfo,
  RegionalPricingResponse,
  PlayStoreDeclaration,
} from "./types";
import api from "./axios";

export class AuthError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "AuthError";
  }
}

export const register = async ({
  email,
  password,
  firstName,
  lastName,
}: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  try {
    if (!email || !password || !firstName || !lastName) {
      throw new Error(
        "Please add email address, password, first and last name to register.",
      );
    }
    const response = await authClient?.signUp.email({
      email,
      password,
      name: firstName + " " + lastName,
      // callbackURL: "/",
      ...{
        first_name: firstName,
        last_name: lastName,
        role: "user",
        auth_type: "EMAIL_PASSWORD",
      },
    });
    if (response?.error) {
      throw new Error(response?.error?.message);
    }
    return { success: true, data: "User registered successfully" };
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error(
      error instanceof Error ? error?.message : JSON.stringify(error),
    );
  }
};

export const registerTester = async ({
  email,
  password,
  firstName,
  lastName,
  // About You
  years_of_experience,
  areas_of_expertise,
  bio,
  // Your Device
  device_company,
  device_model,
  ram,
  os,
  screen_resolution,
  language,
  network,
  // Preferences
  country,
  phone,
}: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  // About You
  years_of_experience: string;
  areas_of_expertise: string[];
  bio?: string;
  // Your Device
  device_company: string;
  device_model: string;
  ram: string;
  os: string;
  screen_resolution: string;
  language: string;
  network: string;
  // Preferences
  country: string;
  phone: string;
}) => {
  try {
    if (!email || !password || !firstName || !lastName) {
      throw new Error(
        "Please add email address, password, first and last name to register.",
      );
    }
    const response = await authClient?.signUp.email({
      email,
      password,
      name: firstName + " " + lastName,
      ...{
        first_name: firstName,
        last_name: lastName,
        role: "tester",
        auth_type: "EMAIL_PASSWORD",
        // About You
        years_of_experience,
        areas_of_expertise,
        bio,
        // Your Device
        device_company,
        device_model,
        ram,
        os,
        screen_resolution,
        language,
        network,
        // Preferences
        country,
        phone,
      },
    });
    if (response?.error) {
      throw new Error(response?.error?.message);
    }
    return { success: true, data: "Tester registered successfully" };
  } catch (error) {
    console.error("Error registering tester:", error);
    throw new Error(
      error instanceof Error ? error?.message : JSON.stringify(error),
    );
  }
};

export const login = async ({
  email,
  password,
  rememberMe,
}: {
  email: string;
  password: string;
  rememberMe: boolean;
}) => {
  try {
    const response = await authClient?.signIn.email({
      email,
      password,
      rememberMe,
    });

    if (response?.error) {
      throw new AuthError(
        response.error.code ?? "LOGIN_FAILED",
        response.error.message ?? "Login failed",
      );
    }

    await authClient.getSession();
    return { success: true, data: response };
  } catch (error) {
    console.error("Error logging in user: ", error);
    throw error;
  }
};

export const googleLogin = async () => {
  try {
    const response = await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}${ROUTES.AUTH.LOGIN}`,
    });

    if (response?.error) {
      throw new AuthError(
        response.error.code ?? "LOGIN_FAILED",
        response.error.message ?? "Login failed",
      );
    }
    return { success: true, data: response };
  } catch (error) {
    console.error("Error logging in user: ", error);
    throw error;
  }
};

export const testerLogin = async ({
  email,
  password,
  rememberMe,
}: {
  email: string;
  password: string;
  rememberMe: boolean;
}) => {
  try {
    const response = await authClient?.signIn.email({
      email,
      password,
      rememberMe,
    });

    if (response?.error) {
      throw new AuthError(
        response.error.code ?? "LOGIN_FAILED",
        response.error.message ?? "Login failed",
      );
    }

    await authClient.getSession();
    return { success: true, data: response };
  } catch (error) {
    console.error("Error logging in tester: ", error);
    throw error;
  }
};

export const googleTesterLogin = async () => {
  try {
    const response = await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}${ROUTES.TESTER.AUTH.LOGIN}`,
    });

    if (response?.error) {
      throw new AuthError(
        response.error.code ?? "LOGIN_FAILED",
        response.error.message ?? "Login failed",
      );
    }
    return { success: true, data: response };
  } catch (error) {
    console.error("Error logging in tester via Google: ", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await authClient?.signOut({
      fetchOptions: {
        onSuccess: () => {
          console.log("logout done");
        },
      },
    });
    return response;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const resendEmailVerification = async ({ email }: { email: string }) => {
  try {
    if (!email) {
      return new Error("Email is required to send verification");
    }
    const response = await authClient.sendVerificationEmail({
      email,
    });
    return response;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const emailVerification = async ({ token }: { token: string }) => {
  try {
    if (!token) {
      throw new Error("Please send token to verify email address.");
    }

    const response = await authClient.verifyEmail({
      query: {
        token,
      },
    });

    if (response?.error) {
      throw new Error(response?.error?.message);
    }
    return { success: true, data: "Email address verified successfully" };
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error(
      error instanceof Error ? error?.message : JSON.stringify(error),
    );
  }
};

export const getUserData = async (): Promise<UserDataAttributes> => {
  try {
    const response = await api.get(API_ROUTES.USER + `/get-user-data`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
};

export const saveUserData = async (payload: UserDataAttributes) => {
  try {
    if (!payload) {
      throw new Error("Payload is undefined");
    }
    const response = await api.post(
      API_ROUTES.USER + "/save-user-data",
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error registering user:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
};

export const getUserProfileData =
  async (): Promise<UserProfileDataAttributes> => {
    try {
      const response = await api.get(
        API_ROUTES.USER + "/get-user-profile-data",
      );
      return response?.data?.data;
    } catch (error) {
      console.error("Error getting user profile:", error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const responseData = error.response?.data;
        console.error("Axios error:", status, responseData);

        throw new Error(
          responseData?.message || error.message || "Unknown Axios error",
        );
      } else if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(JSON.stringify(error));
      }
    }
  };

export const saveInitialProfileData = async () => {
  try {
    await api.get(API_ROUTES.USER + "/initial-user-profile");
    return true;
  } catch (error) {
    console.error("Error saving intial value of user-detail:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
};

export const saveDiscoverySource = async (discovery_source: string) => {
  try {
    await api.put(API_ROUTES.USER + "/discovery-source", {
      discovery_source,
    });
    return true;
  } catch (error) {
    console.error("Error saving discovery source:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
};

// export async function fetchUser(id: string) {
//   try {
//     const response = await api.get(API_ROUTES.USER + `/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     if (axios.isAxiosError(error)) {
//       const status = error.response?.status;
//       const responseData = error.response?.data;
//       console.error("Axios error:", status, responseData);

//       throw new Error(
//         responseData?.message || error.message || "Unknown Axios error"
//       );
//     } else if (error instanceof Error) {
//       throw new Error(error.message);
//     } else {
//       throw new Error(JSON.stringify(error));
//     }
//   }
// }

export const saveProfileData = async (payload: UserProfileDataAttributes) => {
  try {
    if (!payload) {
      throw new Error("Payload is undefined");
    }
    const response = await api.post(
      API_ROUTES.USER + "/save-profile-data",
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error registering user:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
};

// Dashboard
export async function getDasboardData(): Promise<DashboardDataResponse> {
  try {
    const response = await api.get(
      API_ROUTES.DASHBOARD + `/get-dashboard-stats`,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function addDashboardAppSubmit(
  payload: AppData,
): Promise<DashboardDataResponse> {
  try {
    const response = await api.post(
      API_ROUTES.DASHBOARD + `/add-dashboard-app-submit`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function addDashboardAppDraft(
  payload: AppData,
): Promise<AppData | null> {
  try {
    const response = await api.post(
      API_ROUTES.DASHBOARD + `/add-dashboard-app-draft`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error saving dashboard app draft:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getDashboardAppsCount(): Promise<SubmittedAppsCount> {
  try {
    const response = await api.get(API_ROUTES.DASHBOARD + `/get-apps-count`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching dashboard apps count:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getDashboardApps(
  type: string,
): Promise<HubSubmittedAppResponse[]> {
  try {
    const response = await api.get(
      API_ROUTES.DASHBOARD + `/get-dashboard-apps/${type}`,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching dashboard apps:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function deleteDashboardApp(id: string): Promise<void> {
  try {
    const response = await api.delete(
      API_ROUTES.DASHBOARD + `/delete-dashboard-app/${id}`,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error deleting dashboard app:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getDashboardAppById(
  id: string,
): Promise<HubSubmittedAppResponse> {
  try {
    const response = await api.get(
      API_ROUTES.DASHBOARD + `/get-dashboard-app/${id}`,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching dashboard app by ID:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

// Hub
export async function getHubData(): Promise<HubDataResponse> {
  try {
    const response = await api.get(API_ROUTES.HUB + `/get-hub-stats`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching hub data:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getAppCategories(): Promise<AppCategoriesResponse[]> {
  try {
    const response = await api.get(API_ROUTES.HUB + `/get-app-categories`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching app categories:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function addHubApp(payload: AppData) {
  try {
    const response = await api.post(API_ROUTES.HUB + `/add-hub-app`, payload);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching app categories:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function resubmitHubApp(payload: any) {
  try {
    const response = await api.post(API_ROUTES.HUB + `/resubmit-hub-app`, payload);
    return response?.data?.data;
  } catch (error) {
    console.error("Error resubmitting hub app:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function validatePromoCode(payload: { code: string }) {
  try {
    const response = await api.post(
      API_ROUTES.HUB + `/validate-promo`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error validating promo code:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getHubSubmittedApp(
  type: string,
): Promise<HubSubmittedAppResponse[]> {
  try {
    const response = await api.get(
      API_ROUTES.HUB + `/submitted/get-hub-apps/${type}`,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching submitted hub apps:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getSubmittedAppsCount(): Promise<SubmittedAppsCount> {
  try {
    const response = await api.get(
      API_ROUTES.HUB + "/submitted/get-apps-count",
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching app categories:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getHubApps(
  type: string,
): Promise<HubSubmittedAppResponse[]> {
  try {
    const response = await api.get(API_ROUTES.HUB + `/get-hub-apps/${type}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching hub apps:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getTesterProjects(
  status?: string,
  appType?: string,
): Promise<TesterProjectResponse[]> {
  try {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (appType) params.set("appType", appType);
    const queryString = params.toString();
    const query = queryString ? `?${queryString}` : "";
    const response = await api.get(
      API_ROUTES.TESTER + `/get-projects${query}`,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching tester projects:", error);
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function updateTesterAvailability(availability: string) {
  try {
    const response = await api.put(API_ROUTES.TESTER + `/availability`, {
      availability,
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating tester availability:", error);
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function rateApp(payload: { appId: number; rating: number }) {
  try {
    const response = await api.post(API_ROUTES.TESTER + `/rate-app`, payload);
    return response?.data?.data;
  } catch (error) {
    console.error("Error rating app:", error);
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getHubAppsCount(): Promise<SubmittedAppsCount> {
  try {
    const response = await api.get(API_ROUTES.HUB + "/get-apps-count");
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching hub apps count:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getSingleHubAppDetails(
  id: string,
  view?: string,
): Promise<HubSubmittedAppResponse> {
  try {
    const url = view
      ? API_ROUTES.HUB + `/get-app-details/${id}?view=${view}`
      : API_ROUTES.HUB + `/get-app-details/${id}`;
    const response = await api.get(url);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching single hub app details:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function addHubAppTestingRequest(payload: { hub_id: string }) {
  try {
    const response = await api.post(
      API_ROUTES.HUB + `/add-hub-testing-request`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error adding hub app testing request:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function acceptHubAppTestingRequest(payload: {
  hub_id: string;
  tester_id: string;
}) {
  try {
    if (!payload.hub_id || !payload.tester_id) {
      throw new Error("Invalid payload");
    }
    const response = await api.post(
      API_ROUTES.HUB + `/accept-hub-testing-request`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error accepting hub app testing request:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function rejectHubAppTestingRequest(payload: {
  hub_id: string;
  tester_id: string;
  title: string;
  description: string;
  image?: string;
  video?: string;
}) {
  try {
    const response = await api.post(
      API_ROUTES.HUB + `/reject-hub-testing-request`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error rejecting hub app testing request:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function addHubAppFeedback(payload: {
  hub_id: string;
  message: string;
  type: string;
  priority?: string | null;
  image?: string;
  video?: string;
}) {
  try {
    const response = await api.post(
      API_ROUTES.HUB + `/add-hub-feedback`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error adding hub app feedback:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function updateHubAppFeedback(payload: {
  id: number;
  message: string;
  type: string;
  priority?: string | null;
  image?: string | null;
  video?: string | null;
}) {
  try {
    const response = await api.post(
      API_ROUTES.HUB + `/update-hub-feedback`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating hub app feedback:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function deleteHubAppFeedback(id: number) {
  try {
    const response = await api.delete(
      API_ROUTES.HUB + `/delete-feedback/${id}`,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error deleting hub app feedback:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function completeHostedApp(payload: { appId: number | string }) {
  try {
    const response = await api.post(
      API_ROUTES.HUB + `/complete-hosted-app`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error completing hosted app:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function startHubAppTesting(payload: { appId: number | string }) {
  try {
    const response = await api.post(
      API_ROUTES.HUB + `/start-testing`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error starting hub app testing:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

// Notifications
export async function getUserNotifications(): Promise<{
  notifications: NotificationResponse[];
  totalNotifications: number;
}> {
  try {
    const response = await api.get(API_ROUTES.USER + `/get-notifications`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching user notifications data:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

// Wallet
export async function getUserWallet(): Promise<UserWallerResponse> {
  try {
    const response = await api.get(API_ROUTES.USER + `/get-user-wallet`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching user wallet data:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

// User Transactions
export interface UserTransaction {
  id: string;
  date: string;
  type: string;
  description: string;
  amount: string;
  change: string;
  status: string;
  changeType: "positive" | "negative";
  transactionType: string;
  action: string | null;
  points: number | null;
  package: number | null;
  /** null for legacy rows created before the paymentMethod column was added */
  paymentMethod: "POINTS" | "PACKAGE" | "PROMO_FREE" | null;
}


export interface UserTransactionsResponse {
  transactions: UserTransaction[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export async function getUserTransactions(params?: {
  type?: string;
  limit?: number;
  offset?: number;
}): Promise<UserTransactionsResponse> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append("type", params.type);
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());

    const queryString = queryParams.toString();
    const url =
      API_ROUTES.USER +
      `/get-user-transactions${queryString ? `?${queryString}` : ""}`;

    const response = await api.get(url);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

// R2
export async function createUploadUrl(payload: {
  filename: string;
  contentType: string;
  size: number;
  type: string;
}) {
  try {
    const response = await api.post(
      API_ROUTES.R2 + `/create-upload-url`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error creating upload URL:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function uploadFileToR2(
  file: File,
  uploadUrl: string,
  onProgress?: (percent: number) => void,
) {
  try {
    await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
      // Track progress
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percentCompleted);
        }
      },
    });
  } catch (error) {
    console.error("Error uploading file to R2:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

// Misc
export async function getAllPricingPlans(): Promise<PricingResponse[]> {
  try {
    const response = await api.get(API_ROUTES.USER + `/get-all-pricing-plans`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching all plans data:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getAllSessions(): Promise<SessionResponse[]> {
  try {
    const response = await api.get(API_ROUTES.USER + `/get-all-sessions`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching all sessions:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function doSessionLogoutSingle(payload: { session_id: string }) {
  try {
    if (!payload) {
      throw new Error("Payload is undefined");
    }
    const response = await api.post(
      API_ROUTES.USER + `/logout-single-session`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error while logging out single session:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function doSessionLogoutAll() {
  try {
    const response = await api.post(API_ROUTES.USER + `/logout-all-sessions`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error while logging out all sessions:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getEarnPoints(): Promise<{
  surveyPoints: number;
  surveyDone: boolean;
}> {
  try {
    const response = await api.get(API_ROUTES.USER + `/get-earn-points`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching all sessions:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function submitDailyVerification(payload: {
  hubId: number | string;
  proofImage: string;
  metaData?: any;
}) {
  try {
    const response = await api.post(
      API_ROUTES.HUB + `/submit-daily-verification`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error submitting daily verification:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

// Billing
export async function getPaymentConfig(): Promise<PaymentConfigResponse> {
  try {
    const response = await api.get(API_ROUTES.BILLING + `/config`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching payment config:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getBillingHistory(): Promise<BillingHistoryItem[]> {
  try {
    const response = await api.get(API_ROUTES.BILLING + `/history`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching billing history:", error);
    throw error;
  }
}

export async function getBillingInfo(): Promise<BillingInfo | null> {
  try {
    const response = await api.get(API_ROUTES.BILLING + `/info`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching billing info:", error);
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(responseData?.message || "Failed to fetch billing info");
    }
    throw error;
  }
}

export async function saveBillingInfo(payload: Partial<BillingInfo>): Promise<BillingInfo> {
  try {
    const response = await api.post(API_ROUTES.BILLING + `/info`, payload);
    return response?.data?.data;
  } catch (error) {
    console.error("Error saving billing info:", error);
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(responseData?.message || "Failed to save billing info");
    }
    throw error;
  }
}

export async function createOrder(payload: {
  planId: string;
}): Promise<CreateOrderResponse> {
  try {
    const response = await api.post(
      API_ROUTES.BILLING + `/create-order`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error creating order:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      const errorMessage = responseData?.message || error.message || "Unknown Axios error";
      const customError: any = new Error(errorMessage);
      if (responseData?.data?.billingInfoMissing || responseData?.billingInfoMissing) {
        customError.billingInfoMissing = true;
      }
      throw customError;
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function verifyPayment(
  payload: PaymentVerificationPayload,
): Promise<PaymentVerificationResponse> {
  try {
    const response = await api.post(
      API_ROUTES.BILLING + `/verify-payment`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error verifying payment:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getPendingOrders(): Promise<CreateOrderResponse[]> {
  try {
    const response = await api.get(API_ROUTES.BILLING + `/pending-orders`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function assignTestersToApp(payload: {
  id: string; // DashboardAndHub ID
  testerIds: string[];
}) {
  try {
    const response = await api.post(
      API_ROUTES.ADMIN + "/tester-applications/assign",
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error assigning testers to app:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function unassignTesterFromApp(payload: {
  id: string; // DashboardAndHub ID
  testerId: string;
}) {
  try {
    const response = await api.post(
      API_ROUTES.ADMIN + "/tester-applications/unassign",
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error unassigning tester from app:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}
export async function getPromoCodes(): Promise<PromoCodeResponse[]> {
  try {
    const response = await api.get(API_ROUTES.BILLING + "/promo-codes");
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching promo codes:", error);
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getTesterEarnings(): Promise<TesterEarningsResponse> {
  try {
    const response = await api.get(API_ROUTES.TESTER + "/earnings");
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching tester earnings:", error);
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getTesterEarningHistory(
  page = 1,
  limit = 10,
): Promise<TesterEarningHistoryResponse> {
  try {
    const response = await api.get(
      API_ROUTES.TESTER + `/earning-history?page=${page}&limit=${limit}`,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching tester earning history:", error);
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function requestWithdrawal(payload: {
  amount: number;
  note?: string;
}): Promise<{ id: number; status: string }> {
  try {
    const response = await api.post(API_ROUTES.TESTER + "/withdrawal", payload);
    return response?.data?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getWithdrawalHistory(
  page = 1,
  limit = 10,
): Promise<WithdrawalHistoryResponse> {
  try {
    const response = await api.get(
      API_ROUTES.TESTER + `/withdrawal-history?page=${page}&limit=${limit}`,
    );
    return response?.data?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getTesterActivities(
  page = 1,
  limit = 10,
  actionType?: string,
): Promise<TesterActivitiesResponse> {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (actionType) params.set("actionType", actionType);
    const response = await api.get(
      API_ROUTES.TESTER + `/activities?${params.toString()}`,
    );
    return response?.data?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function updateDailyVerificationStatus(payload: {
  id: string;
  status: "VERIFIED" | "REJECTED";
  reason?: string;
}) {
  try {
    const response = await api.post(
      API_ROUTES.ADMIN + "/update-verification-status",
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating verification status:", error);
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function adminCompleteApp(payload: { id: number }) {
  try {
    const response = await api.post(
      API_ROUTES.ADMIN + "/admin-complete-app",
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error completing app as admin:", error);
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

// ==========================================
// SYSTEM LOGS
// ==========================================

export async function fetchAdminLogs() {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/logs`);
    return response?.data?.data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function fetchAdminLogContent(filename: string) {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/logs/${filename}`);
    return response?.data?.data || { content: "", filename };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function deleteAdminLog(filename: string) {
  try {
    const response = await api.delete(API_ROUTES.ADMIN + `/logs/${filename}`);
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function deleteAdminLogsBatch(filenames: string[]) {
  try {
    const response = await api.post(API_ROUTES.ADMIN + `/logs/batch-delete`, {
      filenames,
    });
    return response?.data?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function deleteAdminLogEntry(filename: string, index: number) {
  try {
    const response = await api.delete(
      API_ROUTES.ADMIN + `/logs/${filename}/entry/${index}`
    );
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(
        responseData?.message || error.message || "Unknown Axios error"
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

// ==========================================
// PUBLIC BLOG APIs
// ==========================================

export interface PublicBlog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorName: string;
  authorAvatarUrl: string;
  authorDataAiHint?: string;
  imageUrl: string;
  dataAiHint?: string;
  tags: string[];
  category: string;
  viewCount: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export async function getPublicBlogs(category?: string): Promise<PublicBlog[]> {
  try {
    const url = category
      ? `${API_ROUTES.BLOG}/blogs?category=${encodeURIComponent(category)}`
      : `${API_ROUTES.BLOG}/blogs`;
    const response = await api.get(url);
    return response?.data?.data || [];
  } catch (error) {
    console.error("Error fetching public blogs:", error);
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(
        responseData?.message || error.message || "Unknown Axios error"
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getPublicBlogBySlug(
  slug: string
): Promise<PublicBlog | null> {
  try {
    const response = await api.get(`${API_ROUTES.BLOG}/blogs/${slug}`);
    return response?.data?.data || null;
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(
        responseData?.message || error.message || "Unknown Axios error"
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getPublicBlogTags(): Promise<string[]> {
  try {
    const response = await api.get(`${API_ROUTES.BLOG}/tags`);
    return response?.data?.data || [];
  } catch (error) {
    console.error("Error fetching blog tags:", error);
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(
        responseData?.message || error.message || "Unknown Axios error"
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

// ==================== GUIDES (Public) ====================

export interface PublicGuideCategory {
  id: number;
  slug: string;
  title: string;
  description: string;
  iconName: string;
  colorKey: string;
  bgColorKey: string;
  sortOrder: number;
  isActive: boolean;
}

export interface PublicGuide {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  readTime: string;
  views: number;
  publishedAt: string;
  isActive: boolean;
  categoryId: number;
  category: PublicGuideCategory;
}

export async function getPublicGuides(): Promise<PublicGuide[]> {
  try {
    const response = await api.get(`${API_ROUTES.BLOG}/guides`);
    return response?.data?.data || [];
  } catch (error) {
    console.error("Error fetching public guides:", error);
    return [];
  }
}

export async function getPublicGuideCategories(): Promise<PublicGuideCategory[]> {
  try {
    const response = await api.get(`${API_ROUTES.BLOG}/guides/categories`);
    return response?.data?.data || [];
  } catch (error) {
    console.error("Error fetching guide categories:", error);
    return [];
  }
}

export async function getPublicGuidesByCategory(categorySlug: string): Promise<{ category: PublicGuideCategory; guides: PublicGuide[] } | null> {
  try {
    const response = await api.get(`${API_ROUTES.BLOG}/guides/category/${categorySlug}`);
    return response?.data?.data || null;
  } catch (error) {
    console.error("Error fetching guides by category:", error);
    return null;
  }
}

export async function getPublicGuideBySlug(slug: string): Promise<PublicGuide | null> {
  try {
    const response = await api.get(`${API_ROUTES.BLOG}/guides/${slug}`);
    return response?.data?.data || null;
  } catch (error) {
    console.error("Error fetching guide by slug:", error);
    return null;
  }
}

export async function searchPublicGuides(query: string): Promise<PublicGuide[]> {
  try {
    const response = await api.get(`${API_ROUTES.BLOG}/guides/search`, { params: { q: query } });
    return response?.data?.data || [];
  } catch (error) {
    console.error("Error searching guides:", error);
    return [];
  }
}

export async function getPublicPopularGuides(limit?: number): Promise<PublicGuide[]> {
  try {
    const response = await api.get(`${API_ROUTES.BLOG}/guides/popular`, { params: { limit } });
    return response?.data?.data || [];
  } catch (error) {
    console.error("Error fetching popular guides:", error);
    return [];
  }
}

// ==================== REVIEWS (User/Tester) ====================

export async function createReview(payload: {
  rating: number;
  comment: string;
  appId?: number;
}) {
  try {
    const response = await api.post(API_ROUTES.REVIEW, payload);
    return response?.data?.data;
  } catch (error) {
    console.error("Error creating review:", error);
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(
        responseData?.message || error.message || "Unknown Axios error"
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getMyReviews() {
  try {
    const response = await api.get(API_ROUTES.REVIEW + `/my`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching my reviews:", error);
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(
        responseData?.message || error.message || "Unknown Axios error"
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function updateReview(payload: {
  id: number;
  rating?: number;
  comment?: string;
}) {
  try {
    const response = await api.put(API_ROUTES.REVIEW + `/${payload.id}`, payload);
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating review:", error);
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(
        responseData?.message || error.message || "Unknown Axios error"
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function deleteMyReview(id: number) {
  try {
    const response = await api.delete(API_ROUTES.REVIEW + `/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error deleting review:", error);
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(
        responseData?.message || error.message || "Unknown Axios error"
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getPublishedReviews() {
  try {
    const response = await api.get(API_ROUTES.BLOG + `/reviews`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching published reviews:", error);
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      throw new Error(
        responseData?.message || error.message || "Unknown Axios error"
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getRegionalPricing(): Promise<RegionalPricingResponse> {
  try {
    const response = await api.get(API_ROUTES.BILLING + `/pricing`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching regional pricing:", error);
    throw error;
  }
}

export async function getInvoice(invoiceNumber: string) {
  try {
    const response = await api.get(API_ROUTES.BILLING + `/invoice/${invoiceNumber}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching invoice:", error);
    throw error;
  }
}

export async function getMyInvoices() {
  try {
    const response = await api.get(API_ROUTES.BILLING + `/my-invoices`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching my invoices:", error);
    throw error;
  }
}



// Support API Calls
export const createSupportTicket = async (payload: {
  subject: string;
  description: string;
  category?: string;
}) => {
  try {
    const response = await api.post(API_ROUTES.SUPPORT + "/tickets", payload);
    return response?.data?.data;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

// ==========================================
// HUMAN LIVE CHAT API CALLS
// ==========================================

export const requestHumanChat = async (payload?: { aiChatRequestId?: number }) => {
  try {
    const response = await api.post(API_ROUTES.SUPPORT + "/human-chat/request", payload || {});
    return response?.data?.data;
  } catch (error) {
    console.error("Error requesting human chat:", error);
    throw error;
  }
};

export const getActiveHumanChat = async () => {
  try {
    const response = await api.get(API_ROUTES.SUPPORT + "/human-chat/active");
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching active human chat:", error);
    return null;
  }
};

export const getHumanChatMessages = async (chatId: number, since?: string) => {
  try {
    const params = since ? `?since=${encodeURIComponent(since)}` : "";
    const response = await api.get(
      API_ROUTES.SUPPORT + `/human-chat/${chatId}/messages${params}`
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching human chat messages:", error);
    return [];
  }
};

// ==========================================
// ADMIN SUPPORT API CALLS
// ==========================================

export const getControlRoom = async () => {
  try {
    const response = await api.get(API_ROUTES.ADMIN + "/get-control-room-data");
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching control room:", error);
    return null;
  }
};

export const getPublicStats = async () => {
  try {
    const response = await api.get(API_ROUTES.BLOG + "/stats");
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching public stats:", error);
    return null;
  }
};

export const updateControlRoom = async (payload: { humanChatEnabled: boolean }) => {
  try {
    const response = await api.post(API_ROUTES.ADMIN + "/control-room", payload);
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating control room:", error);
    throw error;
  }
};

export const getSupportStats = async () => {
  try {
    const response = await api.get(API_ROUTES.ADMIN + "/support/stats");
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching support stats:", error);
    return null;
  }
};

export const getHumanChatQueue = async () => {
  try {
    const response = await api.get(API_ROUTES.ADMIN + "/support/queue");
    return response?.data?.data || [];
  } catch (error) {
    console.error("Error fetching queue:", error);
    return [];
  }
};

// ==========================================
// NEW CONVERSATION API CALLS
// ==========================================

export const getAdminConversations = async (params?: { type?: string; status?: string }) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.set("type", params.type);
    if (params?.status) searchParams.set("status", params.status);
    const qs = searchParams.toString();
    const response = await api.get(API_ROUTES.ADMIN + `/support/conversations${qs ? `?${qs}` : ""}`);
    return response?.data?.data || [];
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};

export const getAdminConversationById = async (id: number) => {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/support/conversations/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return null;
  }
};

export const assignConversation = async (id: number) => {
  try {
    const response = await api.post(API_ROUTES.ADMIN + `/support/conversations/${id}/assign`, {});
    return response?.data?.data;
  } catch (error) {
    console.error("Error assigning conversation:", error);
    throw error;
  }
};

export const closeConversation = async (id: number) => {
  try {
    const response = await api.post(API_ROUTES.ADMIN + `/support/conversations/${id}/close`, {});
    return response?.data?.data;
  } catch (error) {
    console.error("Error closing conversation:", error);
    throw error;
  }
};

export const getAgentStatuses = async () => {
  try {
    const response = await api.get(API_ROUTES.ADMIN + "/support/agent-statuses");
    return response?.data?.data || [];
  } catch (error) {
    console.error("Error fetching agent statuses:", error);
    return [];
  }
};

export const setMyStatus = async (status: "ONLINE" | "AWAY" | "OFFLINE") => {
  try {
    const response = await api.post(API_ROUTES.ADMIN + "/support/agents/status", { status });
    return response?.data?.data;
  } catch (error) {
    console.error("Error setting agent status:", error);
    throw error;
  }
};

export const getDeclaration = async (
  appId: string | number,
): Promise<PlayStoreDeclaration> => {
  try {
    const response = await api.get(API_ROUTES.DECLARATION + `/${appId}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching declaration:", error);
    throw error;
  }
};

export const updateDeclaration = async ({
  appId,
  answers,
  status,
}: {
  appId: string | number;
  answers?: Partial<PlayStoreDeclaration["answers"]>;
  status?: string;
}): Promise<PlayStoreDeclaration> => {
  try {
    const response = await api.put(API_ROUTES.DECLARATION + `/${appId}`, {
      answers,
      status,
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating declaration:", error);
    throw error;
  }
};

export const regenerateDeclaration = async (
  appId: string | number,
): Promise<PlayStoreDeclaration> => {
  try {
    const response = await api.post(
      API_ROUTES.DECLARATION + `/${appId}/regenerate`,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error regenerating declaration:", error);
    throw error;
  }
};

// ==========================================
// ADMIN DECLARATION
// ==========================================

export const getAdminDeclaration = async (
  appId: string | number,
): Promise<PlayStoreDeclaration> => {
  try {
    const response = await api.get(
      API_ROUTES.ADMIN + `/declarations/${appId}`,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching admin declaration:", error);
    throw error;
  }
};

export const updateAdminDeclaration = async ({
  appId,
  adminAnswers,
}: {
  appId: string | number;
  adminAnswers: { questions: Array<{ id: string; question: string; answer: string; createdAt: string }> };
}): Promise<PlayStoreDeclaration> => {
  try {
    const response = await api.put(
      API_ROUTES.ADMIN + `/declarations/${appId}`,
      { adminAnswers },
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating admin declaration:", error);
    throw error;
  }
};

export async function getPublicFaqs(category?: string): Promise<any[]> {
  try {
    const params = category ? `?category=${category}` : "";
    const response = await api.get(`${API_ROUTES.FAQ}/faqs${params}`);
    return response?.data?.data || [];
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    throw error;
  }
}

export const publishAdminDeclaration = async (
  appId: string | number,
): Promise<PlayStoreDeclaration> => {
  try {
    const response = await api.post(
      API_ROUTES.ADMIN + `/declarations/${appId}/publish`,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error publishing admin declaration:", error);
    throw error;
  }
};
