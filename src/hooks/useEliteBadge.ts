import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserEliteBadge,
  awardEliteBadge,
  revokeEliteBadge,
  searchEliteBadgeUsers,
  getEliteBadgeHolders,
  getEliteBadgeActivity,
} from "@/lib/apiCalls";
import type {
  EliteBadgeInfo,
  EliteBadgeUserSearchItem,
  EliteBadgeHolder,
  EliteBadgeActivityEntry,
  PaginatedEliteBadgeResponse,
} from "@/lib/types";

export function useUserEliteBadge(userId: string | undefined | null) {
  return useQuery<EliteBadgeInfo>({
    queryKey: ["elite-badge", userId],
    queryFn: () => getUserEliteBadge(userId!),
    enabled: !!userId,
  });
}

export function useAwardEliteBadge(
  options?: Parameters<
    typeof useMutation<unknown, Error, { userId: string; reason?: string }>
  >[0],
) {
  const queryClient = useQueryClient();
  return useMutation<
    unknown,
    Error,
    { userId: string; reason?: string }
  >({
    mutationFn: ({ userId, reason }) => awardEliteBadge(userId, reason),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["elite-badge-holders"] });
      queryClient.invalidateQueries({ queryKey: ["elite-badge-activity"] });
      options?.onSuccess?.(...args);
    },
  });
}

export function useRevokeEliteBadge(
  options?: Parameters<
    typeof useMutation<unknown, Error, { userId: string; reason: string }>
  >[0],
) {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { userId: string; reason: string }>({
    mutationFn: ({ userId, reason }) =>
      revokeEliteBadge(userId, reason),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["elite-badge-holders"] });
      queryClient.invalidateQueries({ queryKey: ["elite-badge-activity"] });
      options?.onSuccess?.(...args);
    },
  });
}

export function useEliteBadgeUserSearch(
  query: string,
  limit = 20,
) {
  return useQuery<{ items: EliteBadgeUserSearchItem[] }>({
    queryKey: ["elite-badge-user-search", query, limit],
    queryFn: () => searchEliteBadgeUsers(query, limit),
    enabled: true,
    staleTime: 30_000,
  });
}

export function useEliteBadgeHolders(
  params: { page?: number; limit?: number; search?: string } = {},
) {
  return useQuery<PaginatedEliteBadgeResponse<EliteBadgeHolder>>({
    queryKey: ["elite-badge-holders", params],
    queryFn: () => getEliteBadgeHolders(params),
  });
}

export function useEliteBadgeActivity(
  params: { page?: number; limit?: number; action?: "AWARD" | "REVOKE" | "ALL" } = {},
) {
  return useQuery<
    PaginatedEliteBadgeResponse<EliteBadgeActivityEntry>
  >({
    queryKey: ["elite-badge-activity", params],
    queryFn: () => getEliteBadgeActivity(params),
    refetchInterval: 60_000,
  });
}
