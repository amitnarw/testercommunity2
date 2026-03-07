import {
  getTesterProjects,
  updateTesterAvailability,
  rateApp,
} from "@/lib/apiCalls";
import { TesterProjectResponse } from "@/lib/types";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

export function useTesterProjects(status?: string) {
  const query = useQuery<TesterProjectResponse[], Error>({
    queryFn: () => getTesterProjects(status),
    queryKey: ["useTesterProjects", status],
  });

  return query;
}

export function useUpdateTesterAvailability(
  options?: UseMutationOptions<any, any, string>,
) {
  const mutation = useMutation({
    mutationFn: (availability: string) =>
      updateTesterAvailability(availability),
    ...options,
  });

  return mutation;
}

export function useRateApp(
  options?: UseMutationOptions<any, any, { appId: number; rating: number }>,
) {
  const mutation = useMutation({
    mutationFn: (payload) => rateApp(payload),
    ...options,
  });

  return mutation;
}
