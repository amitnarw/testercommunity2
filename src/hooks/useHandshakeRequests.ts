import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  sendHandshakeRequest,
  acceptHandshakeRequest,
  rejectHandshakeRequest,
  cancelHandshakeRequest,
  listHandshakeRequests,
} from "@/lib/apiCalls";
import type {
  HandshakeRequestListResponse,
  SendHandshakeRequestInput,
  SendHandshakeRequestResponse,
} from "@/lib/types";

/** Invalidate all handshake-request-related queries after any mutation. */
function useInvalidateHandshakeQueries() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["incoming-handshake-requests"] });
    queryClient.invalidateQueries({ queryKey: ["outgoing-handshake-requests"] });
    queryClient.invalidateQueries({ queryKey: ["useSingleHubAppDetails"] });
    queryClient.invalidateQueries({ queryKey: ["useHubSubmittedApp"] });
    queryClient.invalidateQueries({ queryKey: ["my-level"] });
  };
}

export function useIncomingHandshakeRequests(params?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery<HandshakeRequestListResponse>({
    queryKey: ["incoming-handshake-requests", params],
    queryFn: () =>
      listHandshakeRequests({
        direction: "incoming",
        status: params?.status,
        page: params?.page,
        limit: params?.limit,
      }),
  });
}

export function useOutgoingHandshakeRequests(params?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery<HandshakeRequestListResponse>({
    queryKey: ["outgoing-handshake-requests", params],
    queryFn: () =>
      listHandshakeRequests({
        direction: "outgoing",
        status: params?.status,
        page: params?.page,
        limit: params?.limit,
      }),
  });
}

export function useSendHandshakeRequest(
  options?: Parameters<
    typeof useMutation<
      SendHandshakeRequestResponse,
      Error,
      SendHandshakeRequestInput
    >
  >[0],
) {
  const invalidate = useInvalidateHandshakeQueries();
  return useMutation<
    SendHandshakeRequestResponse,
    Error,
    SendHandshakeRequestInput
  >({
    mutationFn: (payload) => sendHandshakeRequest(payload),
    onSuccess: (...args) => {
      invalidate();
      options?.onSuccess?.(...args);
    },
  });
}

export function useAcceptHandshakeRequest(
  options?: Parameters<typeof useMutation<unknown, Error, number>>[0],
) {
  const invalidate = useInvalidateHandshakeQueries();
  return useMutation<unknown, Error, number>({
    mutationFn: (id) => acceptHandshakeRequest(id),
    onSuccess: (...args) => {
      invalidate();
      options?.onSuccess?.(...args);
    },
  });
}

export function useRejectHandshakeRequest(
  options?: Parameters<
    typeof useMutation<unknown, Error, { id: number; reason: string }>
  >[0],
) {
  const invalidate = useInvalidateHandshakeQueries();
  return useMutation<unknown, Error, { id: number; reason: string }>({
    mutationFn: ({ id, reason }) => rejectHandshakeRequest(id, reason),
    onSuccess: (...args) => {
      invalidate();
      options?.onSuccess?.(...args);
    },
  });
}

export function useCancelHandshakeRequest(
  options?: Parameters<typeof useMutation<unknown, Error, number>>[0],
) {
  const invalidate = useInvalidateHandshakeQueries();
  return useMutation<unknown, Error, number>({
    mutationFn: (id) => cancelHandshakeRequest(id),
    onSuccess: (...args) => {
      invalidate();
      options?.onSuccess?.(...args);
    },
  });
}
