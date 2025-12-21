import {
  getUserData,
  getUserProfileData,
  saveInitialProfileData,
  saveProfileData,
} from "@/lib/apiCalls";
import { UserDataAttributes, UserProfileDataAttributes } from "@/lib/types";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

export type UserProfleResponse = {
  success: true | false;
  data?: string;
  error?: string;
};

export function useUserData(options?: { enabled?: boolean }) {
  const query = useQuery<UserProfleResponse, Error, UserDataAttributes>({
    queryFn: () => getUserData(),
    queryKey: ["getUserData"],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useUserDataSave(options?: UseMutationOptions<any, any, any>) {
  const mutation = useMutation({
    mutationFn: (payload) => saveUserData(payload),
    onSuccess: (data) => {
      console.log("User data saved successfully: " + data);
    },
    onError: (data) => {
      console.log("User data saving failed: " + data);
    },
    ...options,
  });

  return mutation;
}

export function useUserProfileData(options?: { enabled?: boolean }) {
  const query = useQuery<UserProfleResponse, Error, UserProfileDataAttributes>({
    queryFn: () => getUserProfileData(),
    queryKey: ["getUserProfileData"],
    enabled: options?.enabled ?? true,
    retry: false,
    staleTime: 0,
  });

  return query;
}

export function useUserProfileInitial(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryFn: () => saveInitialProfileData(),
    queryKey: ["useUserProfileInitial"],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useProfileDataSave(
  options?: UseMutationOptions<any, any, any>
) {
  const mutation = useMutation({
    mutationFn: (payload) => saveProfileData(payload),
    onSuccess: (data) => {
      console.log("Profile data saved successfully: " + data);
    },
    onError: (data) => {
      console.log("Profile data saving failed: " + data);
    },
    ...options,
  });

  return mutation;
}
