import {
  getDeclaration,
  updateDeclaration,
} from "@/lib/apiCalls";
import type { PlayStoreDeclaration } from "@/lib/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

export function useDeclaration(appId: string | number | undefined) {
  const query = useQuery<PlayStoreDeclaration, Error>({
    queryFn: () => getDeclaration(appId!),
    queryKey: ["useDeclaration", appId],
    enabled: !!appId,
  });
  return query;
}

export function useUpdateDeclaration(
  options?: UseMutationOptions<PlayStoreDeclaration, Error, { appId: string | number; answers?: Partial<PlayStoreDeclaration["answers"]>; status?: string }>,
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: {
      appId: string | number;
      answers?: Partial<PlayStoreDeclaration["answers"]>;
      status?: string;
    }) => updateDeclaration(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useDeclaration"] });
    },
    ...options,
  });
  return mutation;
}
