import axios from "axios";
import API_ROUTES from "./apiRoutes";
import { authClient } from "./auth-client";
import {
  AppCategoriesResponse,
  AppData,
  ControlRoomResponse,
  DashboardDataResponse,
  HubDataResponse,
  HubSubmittedAppResponse,
  NotificationReponse,
  PricingResponse,
  SessionResponse,
  SubmittedAppsCount,
  UserDataAttributes,
  UserProfileDataAttributes,
  UserWallerResponse,
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
        "Please add email address, password, first and last name to register."
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
      error instanceof Error ? error?.message : JSON.stringify(error)
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
        response.error.message ?? "Login failed"
      );
    }
    return { success: true, data: response };
  } catch (error) {
    console.error("Error logging in user: ", error);
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
      error instanceof Error ? error?.message : JSON.stringify(error)
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
        responseData?.message || error.message || "Unknown Axios error"
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
      payload
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error registering user:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error"
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
        API_ROUTES.USER + "/get-user-profile-data"
      );
      return response?.data?.data;
    } catch (error) {
      console.error("Error getting user profile:", error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const responseData = error.response?.data;
        console.error("Axios error:", status, responseData);

        throw new Error(
          responseData?.message || error.message || "Unknown Axios error"
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
        responseData?.message || error.message || "Unknown Axios error"
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
      payload
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error registering user:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error"
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
};

export async function getControlRoomData(): Promise<ControlRoomResponse> {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/get-control-room-data`);
    return response.data;
  } catch (error) {
    console.error("Error fetching control room:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

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

// Dashboard
export async function getDasboardData(): Promise<DashboardDataResponse> {
  try {
    const response = await api.get(
      API_ROUTES.DASHBOARD + `/get-dashboard-stats`
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

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
        responseData?.message || error.message || "Unknown Axios error"
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
        responseData?.message || error.message || "Unknown Axios error"
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
        responseData?.message || error.message || "Unknown Axios error"
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getHubSubmittedApp(
  type: string
): Promise<HubSubmittedAppResponse[]> {
  try {
    const response = await api.get(
      API_ROUTES.HUB + `/submitted/get-hub-apps/${type}`
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching submitted hub apps:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

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

export async function getSubmittedAppsCount(): Promise<SubmittedAppsCount> {
  try {
    const response = await api.get(
      API_ROUTES.HUB + "/submitted/get-apps-count"
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching app categories:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

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

export async function getHubApps(
  type: string
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
        responseData?.message || error.message || "Unknown Axios error"
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
        responseData?.message || error.message || "Unknown Axios error"
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getSingleHubAppDetails(
  id: string
): Promise<HubSubmittedAppResponse> {
  try {
    const response = await api.get(API_ROUTES.HUB + `/get-app-details/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching single hub app details:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

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

export async function addHubAppTestingRequest(payload: { hub_id: string }) {
  try {
    const response = await api.post(
      API_ROUTES.HUB + `/add-hub-testing-request`,
      payload
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error adding hub app testing request:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

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

// Notifications
export async function getUserNotifications(): Promise<{
  result: NotificationReponse[];
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
        responseData?.message || error.message || "Unknown Axios error"
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
        responseData?.message || error.message || "Unknown Axios error"
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
        responseData?.message || error.message || "Unknown Axios error"
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
        responseData?.message || error.message || "Unknown Axios error"
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
      payload
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error while logging out single session:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

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
        responseData?.message || error.message || "Unknown Axios error"
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}
