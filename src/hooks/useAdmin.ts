import {
  adminLogin,
  getControlRoomData,
  getSubmittedApps,
  acceptApp,
  rejectApp,
  getSubmittedAppsCount,
} from "@/lib/apiCallsAdmin";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

export function useControlRoomData(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryFn: () => getControlRoomData(),
    queryKey: ["useUserProfileInitial"],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useAdminLogin(options?: UseMutationOptions<any, any, any>) {
  const mutation = useMutation({
    mutationFn: (payload: any) => adminLogin(payload),
    ...options,
  });

  return mutation;
}

export function useSubmittedAppsCount() {
  const query = useQuery({
    queryFn: () => getSubmittedAppsCount(),
    queryKey: ["useSubmittedAppsCount"],
  });

  return query;
}

export function useSubmittedApps(
  status?: string,
  options?: { enabled?: boolean },
) {
  const query = useQuery({
    queryFn: () => getSubmittedApps(status),
    queryKey: ["useSubmittedApps", status],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useAcceptApp(options?: UseMutationOptions<any, any, any>) {
  const mutation = useMutation({
    mutationFn: (id: number) => acceptApp(id),
    ...options,
  });

  return mutation;
}

export function useRejectApp(options?: UseMutationOptions<any, any, any>) {
  const mutation = useMutation({
    mutationFn: (payload: {
      id: number;
      title: string;
      description: string;
      image?: string;
      video?: string;
    }) => rejectApp(payload),
    ...options,
  });

  return mutation;
}
