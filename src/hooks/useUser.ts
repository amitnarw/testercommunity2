import {
  doSessionLogoutAll,
  doSessionLogoutSingle,
  getAllPricingPlans,
  getAllSessions,
  getDasboardData,
  getHubData,
  getUserData,
  getUserNotifications,
  getUserProfileData,
  saveInitialProfileData,
  saveProfileData,
  saveUserData,
} from "@/lib/apiCalls";
import {
  DashboardDataResponse,
  HubDataResponse,
  NotificationReponse,
  PricingResponse,
  SessionResponse,
  UserDataAttributes,
  UserProfileDataAttributes,
} from "@/lib/types";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

export type CommonResponse = {
  success: true | false;
  data?: string;
  error?: string;
};

export function useUserData(options?: { enabled?: boolean }) {
  const query = useQuery<UserDataAttributes, Error>({
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

export function useUserProfileData() {
  const query = useQuery<UserProfileDataAttributes, Error>({
    queryFn: () => getUserProfileData(),
    queryKey: ["getUserProfileData"],
    enabled: false,
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

// Dashboard
export function useDashboardData() {
  const query = useQuery<DashboardDataResponse, Error>({
    queryFn: () => getDasboardData(),
    queryKey: ["useDashboardData"],
  });

  return query;
}

// Hub
export function useHubData() {
  const query = useQuery<HubDataResponse, Error>({
    queryFn: () => getHubData(),
    queryKey: ["useHubData"],
  });

  return query;
}

// Notification
export function useGetUserNotifications() {
  const query = useQuery<
    { result: NotificationReponse[]; totalNotifications: number },
    Error
  >({
    queryFn: () => getUserNotifications(),
    queryKey: ["useGetUserNotifications"],
  });

  return query;
}

// Misc
export function usePricingData() {
  const query = useQuery<PricingResponse[], Error>({
    queryFn: () => getAllPricingPlans(),
    queryKey: ["usePricingData"],
  });

  return query;
}

export function useSessionsData() {
  const query = useQuery<SessionResponse[], Error>({
    queryFn: () => getAllSessions(),
    queryKey: ["useSessionsData"],
  });

  return query;
}

export function useSessionLogoutSingle(
  options?: UseMutationOptions<any, any, any>
) {
  const mutation = useMutation({
    mutationFn: (payload) => doSessionLogoutSingle(payload),
    ...options,
  });

  return mutation;
}

export function useSessionLogoutAll(
  options?: UseMutationOptions<any, any, any>
) {
  const mutation = useMutation({
    mutationFn: () => doSessionLogoutAll(),
    ...options,
  });

  return mutation;
}
