import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMonitoringOverview,
  getWaitingCampaigns,
  getPenalizedUsers,
  getRecentMissedDays,
  adminReplaceTester,
  adminForceHandshake,
} from "@/lib/apiCalls";
import type {
  HandshakeMonitoringOverview,
  WaitingCampaign,
  PenalizedUser,
  MissedDayRecord,
} from "@/lib/types";

export function useMonitoringOverview() {
  return useQuery<HandshakeMonitoringOverview>({
    queryKey: ["monitoring-overview"],
    queryFn: () => getMonitoringOverview(),
    refetchInterval: 60_000,
  });
}

export function useWaitingCampaigns() {
  return useQuery<{ items: WaitingCampaign[] }>({
    queryKey: ["waiting-campaigns"],
    queryFn: () => getWaitingCampaigns(),
    refetchInterval: 60_000,
  });
}

export function usePenalizedUsers() {
  return useQuery<{ items: PenalizedUser[] }>({
    queryKey: ["penalized-users"],
    queryFn: () => getPenalizedUsers(),
    refetchInterval: 60_000,
  });
}

export function useRecentMissedDays(limit = 100) {
  return useQuery<{ items: MissedDayRecord[] }>({
    queryKey: ["missed-days", limit],
    queryFn: () => getRecentMissedDays(limit),
    refetchInterval: 60_000,
  });
}

export function useAdminReplaceTester(
  options?: Parameters<
    typeof useMutation<
      unknown,
      Error,
      { testerRelationId: number; reason?: string }
    >
  >[0],
) {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { testerRelationId: number; reason?: string }>({
    mutationFn: (payload) => adminReplaceTester(payload),
    onSuccess: (...args) => {
      // H-F4 (S4e-8): refresh monitoring lists after a successful replace.
      queryClient.invalidateQueries({ queryKey: ["missed-days"] });
      queryClient.invalidateQueries({ queryKey: ["waiting-campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["penalized-users"] });
      queryClient.invalidateQueries({ queryKey: ["monitoring-overview"] });
      options?.onSuccess?.(...args);
    },
  });
}

export function useAdminForceHandshake(
  options?: Parameters<
    typeof useMutation<
      unknown,
      Error,
      { userAId: string; userBId: string; appAId: number; appBId: number }
    >
  >[0],
) {
  return useMutation<
    unknown,
    Error,
    { userAId: string; userBId: string; appAId: number; appBId: number }
  >({
    mutationFn: (payload) => adminForceHandshake(payload),
    ...options,
  });
}
