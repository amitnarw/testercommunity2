import axios from "axios";
import API_ROUTES from "./apiRoutes";
import { authClient } from "./auth-client";

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
    const response = await authClient?.signUp.email({
      email,
      password,
      name: firstName + " " + lastName,
      callbackURL: "/auth/register/check-email",
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
    return response;
  } catch (error) {
    console.error("Error registering user:", error);
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

export const getProfileSetupData = async () => {
  //   try {
  //     const response = await axios.get(API_ROUTES?.AUTH);
  //   } catch (error) {
  //     console.error("Error registering user:", error);
  //   }
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
