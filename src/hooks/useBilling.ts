import {
  createOrder,
  getBillingHistory,
  getPaymentConfig,
  getPendingOrders,
  verifyPayment,
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
  PaymentVerificationPayload,
  PaymentVerificationResponse,
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
