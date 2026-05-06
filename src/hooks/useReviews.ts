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
  const mutation = useMutation({
    mutationFn: (payload: {
      rating: number;
      comment: string;
      appId?: number;
    }) => createReview(payload),
    ...options,
  });
  return mutation;
}

export function useUpdateReview(options?: UseMutationOptions<any, any, any>) {
  const mutation = useMutation({
    mutationFn: (payload: {
      id: number;
      rating?: number;
      comment?: string;
    }) => updateReview(payload),
    ...options,
  });
  return mutation;
}

export function useDeleteMyReview(options?: UseMutationOptions<any, any, any>) {
  const mutation = useMutation({
    mutationFn: (id: number) => deleteMyReview(id),
    ...options,
  });
  return mutation;
}