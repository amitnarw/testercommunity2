import axios from "axios";
import API_ROUTES from "./apiRoutes";
import { authClient } from "./auth-client";
import { UserProfleResponse } from "@/hooks/useUser";
import { ControlRoomResponse, UserProfileData } from "./types";
import api from "./axios";

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
      throw new Error(response?.error?.message);
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

export const getUserProfileData = async (): Promise<UserProfleResponse> => {
  try {
    const response = await api.get(API_ROUTES.USER + "/get-user-profile-data");
    const result = response?.data?.data;
    if (!result) throw new Error("No user profile data returned");

    return result as UserProfleResponse;
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

export const saveProfileData = async (payload: UserProfileData) => {
  try {
    if (!payload) {
      throw new Error("Payload can't be undefined");
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

export async function fetchUser(id: string) {
  try {
    const response = await api.get(API_ROUTES.USER + `/${id}`);
    return response.data;
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
}

// export async function updateProfile(profile) {
//   const response = await axios.post("/api/profile", profile);
//   return response.data;
// }

export async function getControlRoomData(): Promise<ControlRoomResponse> {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/get-control-room-data`);
    return response.data;
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
}
