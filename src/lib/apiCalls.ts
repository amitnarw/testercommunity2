import axios from "axios";
import API_ROUTES from "./apiRoutes";
import { authClient } from "./auth-client";
import { decryptData } from "./encryptDecryptPayload";
import { UserProfleResponse } from "@/hooks/useUser";

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
      ...{ firstName, lastName, role: "user", authType: "EMAIL_PASSWORD" },
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
    // return true
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
    const response = await axios.get(
      API_ROUTES.USER + "/get-user-profile-data"
    );
    const result = await decryptData(response?.data?.data);
    if (!result) throw new Error("No user profile data returned");

    return result as UserProfleResponse;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

export const saveInitialProfileData = async () => {
  try {
    await axios.get(API_ROUTES.USER + "/initial-user-profile");
    return true;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

export async function fetchUser(id: string) {
  try {
    const response = await axios.get(`/api/user/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

// export async function updateProfile(profile) {
//   const response = await axios.post("/api/profile", profile);
//   return response.data;
// }
