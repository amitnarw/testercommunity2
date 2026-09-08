import {
  createReview,
  getMyReviews,
  updateReview,
  deleteMyReview,
} from "@/lib/apiCalls";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export function useMyReviews(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryFn: () => getMyReviews(),
    queryKey: ["useMyReviews"],
    enabled: options?.enabled ?? true,
  });
  return query;
}

export function useCreateReview(options?: UseMutationOptions<any, any, any>) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: {
      rating: number;
      comment: string;
      appId?: number;
    }) => createReview(payload),
    onSuccess: (data, variables, ctx) => {
      queryClient.invalidateQueries({ queryKey: ["useMyReviews"] });
      (options as any)?.onSuccess?.(data, variables, ctx);
    },
    onError: (data, variables, ctx) => {
      (options as any)?.onError?.(data, variables, ctx);
    },
  });
  return mutation;
}

export function useUpdateReview(options?: UseMutationOptions<any, any, any>) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: {
      id: number;
      rating?: number;
      comment?: string;
    }) => updateReview(payload),
    onSuccess: (data, variables, ctx) => {
      queryClient.invalidateQueries({ queryKey: ["useMyReviews"] });
      (options as any)?.onSuccess?.(data, variables, ctx);
    },
    onError: (data, variables, ctx) => {
      (options as any)?.onError?.(data, variables, ctx);
    },
  });
  return mutation;
}

export function useDeleteMyReview(options?: UseMutationOptions<any, any, any>) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: number) => deleteMyReview(id),
    onSuccess: (data, variables, ctx) => {
      queryClient.invalidateQueries({ queryKey: ["useMyReviews"] });
      (options as any)?.onSuccess?.(data, variables, ctx);
    },
    onError: (data, variables, ctx) => {
      (options as any)?.onError?.(data, variables, ctx);
    },
  });
  return mutation;
}