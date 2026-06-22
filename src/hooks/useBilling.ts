import {
  createOrder,
  getBillingHistory,
  getPaymentConfig,
  getPendingOrders,
  getOrderStatus,
  getPromoCodes,
  getBillingInfo,
  saveBillingInfo,
  getInvoice,
  getMyInvoices,
} from "@/lib/apiCalls";
import {
  BillingHistoryItem,
  CreateOrderResponse,
  PaymentConfigResponse,
  OrderStatusResponse,
  PromoCodeResponse,
  BillingInfo,
  InvoiceDetail,
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
  options?: UseMutationOptions<CreateOrderResponse, Error, { planId: string }>,
) {
  const mutation = useMutation({
    mutationFn: (payload: { planId: string }) => createOrder(payload),
    ...options,
  });

  return mutation;
}

export function useOrderStatus(orderId: string | null, pollInterval: number = 2000) {
  const query = useQuery<OrderStatusResponse, Error>({
    queryFn: () => getOrderStatus(orderId!),
    queryKey: ["orderStatus", orderId],
    enabled: !!orderId?.length,
    refetchInterval: (query) => {
      if (!query.state.data || query.state.data.status === 'PAID' || query.state.data.status === 'FAILED') {
        return false;
      }
      return pollInterval;
    },
    retry: (failureCount, error) => {
      if (error?.message?.toLowerCase().includes("not found")) return false;
      return failureCount < 3;
    },
  });

  return query;
}

export function usePromoCodes() {
  const query = useQuery<PromoCodeResponse[], Error>({
    queryFn: () => getPromoCodes(),
    queryKey: ["getPromoCodes"],
  });

  return query;
}

export function useBillingInfo(options?: { enabled?: boolean }) {
  const query = useQuery<BillingInfo | null, Error>({
    queryFn: () => getBillingInfo(),
    queryKey: ["getBillingInfo"],
    enabled: options?.enabled,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return query;
}

export function useBillingInfoSave(
  options?: UseMutationOptions<BillingInfo, Error, Partial<BillingInfo>>,
) {
  const mutation = useMutation({
    mutationFn: (payload: Partial<BillingInfo>) => saveBillingInfo(payload),
    ...options,
  });

  return mutation;
}

export function useInvoice(invoiceNumber: string) {
  const query = useQuery<InvoiceDetail, Error>({
    queryFn: () => getInvoice(invoiceNumber),
    queryKey: ["getInvoice", invoiceNumber],
    enabled: !!invoiceNumber,
  });

  return query;
}

export function useMyInvoices() {
  const query = useQuery<any[], Error>({
    queryFn: () => getMyInvoices(),
    queryKey: ["getMyInvoices"],
  });

  return query;
}
