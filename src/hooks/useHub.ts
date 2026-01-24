import {
  addHubApp,
  addHubAppTestingRequest,
  acceptHubAppTestingRequest,
  rejectHubAppTestingRequest,
  getAppCategories,
  getHubApps,
  getHubAppsCount,
  getHubData,
  getHubSubmittedApp,
  getSingleHubAppDetails,
  getSubmittedAppsCount,
  addHubAppFeedback,
} from "@/lib/apiCalls";
import {
  AppCategoriesResponse,
  HubDataResponse,
  HubSubmittedAppResponse,
  SubmittedAppsCount,
} from "@/lib/types";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

// Hub
export function useHubData() {
  const query = useQuery<HubDataResponse, Error>({
    queryFn: () => getHubData(),
    queryKey: ["useHubData"],
  });

  return query;
}

export function useAppCategories() {
  const query = useQuery<AppCategoriesResponse[], Error>({
    queryFn: () => getAppCategories(),
    queryKey: ["useAppCategories"],
  });

  return query;
}

export function useAddHubApp(options?: UseMutationOptions<any, any, any>) {
  const mutation = useMutation({
    mutationFn: (payload) => addHubApp(payload),
    onSuccess: (data) => {
      console.log("Hub app added successfully: " + data);
    },
    onError: (data) => {
      console.log("Hub app adding failed: " + data);
    },
    ...options,
  });

  return mutation;
}

export function useHubSubmittedApp({
  type,
  options,
}: {
  type: string;
  options?: { enabled?: boolean };
}) {
  const query = useQuery<HubSubmittedAppResponse[], Error>({
    queryFn: () => getHubSubmittedApp(type),
    queryKey: ["useHubSubmittedApp", type],
    enabled: options?.enabled ?? !!type,
  });

  return query;
}

export function useHubSubmittedAppsCount() {
  const query = useQuery<SubmittedAppsCount, Error>({
    queryFn: () => getSubmittedAppsCount(),
    queryKey: ["useHubSubmittedAppsCount"],
  });

  return query;
}

export function useHubApps({ type }: { type: string }) {
  const query = useQuery<HubSubmittedAppResponse[], Error>({
    queryFn: () => getHubApps(type),
    queryKey: ["useHubApps", type],
    enabled: !!type,
  });

  return query;
}

export function useHubAppsCount() {
  const query = useQuery<SubmittedAppsCount, Error>({
    queryFn: () => getHubAppsCount(),
    queryKey: ["useHubAppsCount"],
  });

  return query;
}

export function useSingleHubAppDetails({ id }: { id: string }) {
  const query = useQuery<HubSubmittedAppResponse, Error>({
    queryFn: () => getSingleHubAppDetails(id),
    queryKey: ["useSingleHubAppDetails", id],
    enabled: !!id,
  });

  return query;
}

export function useAddHubAppTestingRequest(
  options?: UseMutationOptions<any, any, any>,
) {
  const mutation = useMutation({
    mutationFn: (payload: { hub_id: string }) =>
      addHubAppTestingRequest(payload),
    onSuccess: (data) => {
      console.log("Hub app testing request added successfully: " + data);
    },
    onError: (data) => {
      console.log("Hub app testing request adding failed: " + data);
    },
    ...options,
  });

  return mutation;
}

export function useAcceptHubAppTestingRequest(
  options?: UseMutationOptions<any, any, any>,
) {
  const mutation = useMutation({
    mutationFn: (payload: { hub_id: string; tester_id: string }) =>
      acceptHubAppTestingRequest(payload),
    onSuccess: (data) => {
      console.log("Hub app testing request accepted successfully: " + data);
    },
    onError: (data) => {
      console.log("Hub app testing request accepting failed: " + data);
    },
    ...options,
  });

  return mutation;
}

export function useRejectHubAppTestingRequest(
  options?: UseMutationOptions<any, any, any>,
) {
  const mutation = useMutation({
    mutationFn: (payload: {
      hub_id: string;
      tester_id: string;
      title: string;
      description: string;
      image?: string;
      video?: string;
    }) => rejectHubAppTestingRequest(payload),
    onSuccess: (data) => {
      console.log("Hub app testing request rejected successfully: " + data);
    },
    onError: (data) => {
      console.log("Hub app testing request rejecting failed: " + data);
    },
    ...options,
  });

  return mutation;
}

export function useAddHubAppFeedback(
  options?: UseMutationOptions<any, any, any>,
) {
  const mutation = useMutation({
    mutationFn: (payload: {
      hub_id: string;
      message: string;
      type: string;
      priority: string;
      image?: string;
      video?: string;
    }) => addHubAppFeedback(payload),
    onSuccess: (data) => {
      console.log("Hub app feedback added successfully: " + data);
    },
    onError: (data) => {
      console.log("Hub app feedback adding failed: " + data);
    },
    ...options,
  });

  return mutation;
}
