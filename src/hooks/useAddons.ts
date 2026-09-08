import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAddonCatalog,
  purchaseAddon,
  assignProfessionalTester,
  fillProfessionalTester,
  cancelProfessionalTester,
  listProfessionalAssignments,
} from "@/lib/apiCalls";
import type {
  AddOn,
  PurchaseAddonResponse,
  ProfessionalTesterAssignment,
} from "@/lib/types";

export function useAddonCatalog() {
  return useQuery<AddOn[]>({
    queryKey: ["addon-catalog"],
    queryFn: () => getAddonCatalog(),
  });
}

export function usePurchaseAddon(
  options?: Parameters<
    typeof useMutation<
      PurchaseAddonResponse,
      Error,
      { addOnId: number; campaignId: number }
    >
  >[0],
) {
  const queryClient = useQueryClient();
  return useMutation<
    PurchaseAddonResponse,
    Error,
    { addOnId: number; campaignId: number }
  >({
    mutationFn: ({ addOnId, campaignId }) =>
      purchaseAddon(addOnId, campaignId),
    onSuccess: (data, variables, ctx) => {
      queryClient.invalidateQueries({ queryKey: ["professional-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["useSingleHubAppDetails"] });
      (options as any)?.onSuccess?.(data, variables, ctx);
    },
    onError: (data, variables, ctx) => {
      (options as any)?.onError?.(data, variables, ctx);
    },
  });
}

export function useAssignProfessionalTester(
  options?: Parameters<
    typeof useMutation<unknown, Error, { campaignId: number; feeINR?: number }>
  >[0],
) {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { campaignId: number; feeINR?: number }>({
    mutationFn: (payload) => assignProfessionalTester(payload),
    onSuccess: (data, variables, ctx) => {
      queryClient.invalidateQueries({ queryKey: ["professional-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["useSingleHubAppDetails"] });
      (options as any)?.onSuccess?.(data, variables, ctx);
    },
    onError: (data, variables, ctx) => {
      (options as any)?.onError?.(data, variables, ctx);
    },
  });
}

export function useFillProfessionalTester(
  options?: Parameters<
    typeof useMutation<unknown, Error, { assignmentId: number; professionalUserId: string }>
  >[0],
) {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { assignmentId: number; professionalUserId: string }>({
    mutationFn: ({ assignmentId, professionalUserId }) =>
      fillProfessionalTester(assignmentId, professionalUserId),
    onSuccess: (data, variables, ctx) => {
      queryClient.invalidateQueries({ queryKey: ["professional-assignments"] });
      (options as any)?.onSuccess?.(data, variables, ctx);
    },
    onError: (data, variables, ctx) => {
      (options as any)?.onError?.(data, variables, ctx);
    },
  });
}

export function useCancelProfessionalTester(
  options?: Parameters<typeof useMutation<unknown, Error, number>>[0],
) {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, number>({
    mutationFn: (id) => cancelProfessionalTester(id),
    onSuccess: (data, variables, ctx) => {
      queryClient.invalidateQueries({ queryKey: ["professional-assignments"] });
      (options as any)?.onSuccess?.(data, variables, ctx);
    },
    onError: (data, variables, ctx) => {
      (options as any)?.onError?.(data, variables, ctx);
    },
  });
}

export function useProfessionalAssignments(params?: {
  campaignId?: number;
  status?: string;
}) {
  return useQuery<{ items: ProfessionalTesterAssignment[] }>({
    queryKey: ["professional-assignments", params],
    queryFn: () => listProfessionalAssignments(params),
  });
}
