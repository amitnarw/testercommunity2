import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getMyPenalties,
  submitPenaltyProof,
  verifyPenaltyTask,
  listAllPenalties,
} from "@/lib/apiCalls";
import type { MyPenaltiesResponse } from "@/lib/types";

export function useMyPenalties() {
  return useQuery<MyPenaltiesResponse>({
    queryKey: ["my-penalties"],
    queryFn: () => getMyPenalties(),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 30_000,
    retryOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useSubmitPenaltyProof(
  options?: Parameters<typeof useMutation<unknown, Error, { taskId: number; proofImageUrl: string }>>[0],
) {
  return useMutation<unknown, Error, { taskId: number; proofImageUrl: string }>({
    mutationFn: ({ taskId, proofImageUrl }) =>
      submitPenaltyProof(taskId, proofImageUrl),
    ...options,
  });
}

export function useVerifyPenaltyTask(
  options?: Parameters<
    typeof useMutation<
      unknown,
      Error,
      { taskId: number; approved: boolean; rejectionReason?: string }
    >
  >[0],
) {
  return useMutation<
    unknown,
    Error,
    { taskId: number; approved: boolean; rejectionReason?: string }
  >({
    mutationFn: ({ taskId, approved, rejectionReason }) =>
      verifyPenaltyTask(taskId, approved, rejectionReason),
    ...options,
  });
}

export function useAllPenalties(params?: {
  status?: string;
  userId?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["all-penalties", params],
    queryFn: () => listAllPenalties(params),
  });
}
