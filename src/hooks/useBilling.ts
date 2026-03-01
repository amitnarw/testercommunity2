import {
  createOrder,
  getBillingHistory,
  getPaymentConfig,
  getPendingOrders,
  verifyPayment,
  getPromoCodes,
} from "@/lib/apiCalls";
import {
  BillingHistoryItem,
  CreateOrderResponse,
  PaymentConfigResponse,
  PaymentVerificationPayload,
  PaymentVerificationResponse,
  PromoCodeResponse,
} from "@/lib/types";
import {
  useMutation,
  useQuery,
  UseMutationOptions,
} from "@tanstack/react-query";

// Queries
export function usePaymentConfig() {
  const query = useQuery<PaymentConfigResponse, Error>({
    queryFn: () => getPaymentConfig(),
    queryKey: ["getPaymentConfig"],
  });

  return query;
}

export function useBillingHistory() {
  const query = useQuery<BillingHistoryItem[], Error>({
    queryFn: () => getBillingHistory(),
    queryKey: ["getBillingHistory"],
  });

  return query;
}

export function usePendingOrders() {
  const query = useQuery<CreateOrderResponse[], Error>({
    queryFn: () => getPendingOrders(),
    queryKey: ["getPendingOrders"],
  });

  return query;
}

// Mutations
export function useCreateOrder(
  options?: UseMutationOptions<CreateOrderResponse, Error, string>,
) {
  const mutation = useMutation({
    mutationFn: (planId: string) => createOrder(planId),
    ...options,
  });

  return mutation;
}

export function useVerifyPayment(
  options?: UseMutationOptions<
    PaymentVerificationResponse,
    Error,
    PaymentVerificationPayload
  >,
) {
  const mutation = useMutation({
    mutationFn: (payload: PaymentVerificationPayload) => verifyPayment(payload),
    ...options,
  });

  return mutation;
}

export function usePromoCodes() {
  const query = useQuery<PromoCodeResponse[], Error>({
    queryFn: () => getPromoCodes(),
    queryKey: ["getPromoCodes"],
  });

  return query;
}
