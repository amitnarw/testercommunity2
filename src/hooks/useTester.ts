import { getTesterProjects, updateTesterAvailability } from "@/lib/apiCalls";
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
