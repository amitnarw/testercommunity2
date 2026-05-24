import {
  getTesterProjects,
  updateTesterAvailability,
  rateApp,
} from "@/lib/apiCalls";
import { TesterProjectResponse } from "@/lib/types";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

function useIsBlockedTester() {
  const { data: session } = authClient.useSession();
  const sessionData = session as unknown as {
    role?: { name: string };
    applicationStatus?: string;
  };
  const roleName = sessionData?.role?.name;
  const appStatus = sessionData?.applicationStatus;
  return roleName === "tester" && appStatus !== "APPROVED";
}

export function useTesterProjects(status?: string, appType?: string) {
  const isBlocked = useIsBlockedTester();
  const query = useQuery<TesterProjectResponse[], Error>({
    queryFn: () => getTesterProjects(status, appType),
    queryKey: ["useTesterProjects", status, appType],
    enabled: !isBlocked,
  });

  return query;
}

export function useUpdateTesterAvailability(
  options?: UseMutationOptions<any, any, string>,
) {
  const mutation = useMutation({
    mutationFn: (availability: string) =>
      updateTesterAvailability(availability),
    ...options,
  });

  return mutation;
}

export function useRateApp(
  options?: UseMutationOptions<any, any, { appId: number; rating: number }>,
) {
  const mutation = useMutation({
    mutationFn: (payload) => rateApp(payload),
    ...options,
  });

  return mutation;
}
