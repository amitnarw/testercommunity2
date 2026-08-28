import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getUserEliteBadge,
  awardEliteBadge,
  revokeEliteBadge,
} from "@/lib/apiCalls";
import type { EliteBadgeInfo } from "@/lib/types";

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
  return useMutation<unknown, Error, { userId: string; reason?: string }>({
    mutationFn: ({ userId, reason }) => awardEliteBadge(userId, reason),
    ...options,
  });
}

export function useRevokeEliteBadge(
  options?: Parameters<
    typeof useMutation<unknown, Error, { userId: string; reason?: string }>
  >[0],
) {
  return useMutation<unknown, Error, { userId: string; reason?: string }>({
    mutationFn: ({ userId, reason }) => revokeEliteBadge(userId, reason),
    ...options,
  });
}
