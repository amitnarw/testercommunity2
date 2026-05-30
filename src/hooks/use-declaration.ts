import {
  getDeclaration,
  updateDeclaration,
  getAdminDeclaration,
  updateAdminDeclaration,
  publishAdminDeclaration,
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

// ==========================================
// ADMIN DECLARATION HOOKS
// ==========================================

export function useAdminDeclaration(appId: string | number | undefined) {
  const query = useQuery<PlayStoreDeclaration, Error>({
    queryFn: () => getAdminDeclaration(appId!),
    queryKey: ["useAdminDeclaration", appId],
    enabled: !!appId,
  });
  return query;
}

export function useUpdateAdminDeclaration(
  options?: UseMutationOptions<
    PlayStoreDeclaration,
    Error,
    {
      appId: string | number;
      adminAnswers: {
        questions: Array<{ id: string; question: string; answer: string; createdAt: string }>;
      };
    }
  >,
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: {
      appId: string | number;
      adminAnswers: {
        questions: Array<{ id: string; question: string; answer: string; createdAt: string }>;
      };
    }) => updateAdminDeclaration(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useAdminDeclaration"] });
    },
    ...options,
  });
  return mutation;
}

export function usePublishAdminDeclaration(
  options?: UseMutationOptions<PlayStoreDeclaration, Error, { appId: string | number }>,
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: { appId: string | number }) =>
      publishAdminDeclaration(payload.appId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useAdminDeclaration"] });
      queryClient.invalidateQueries({ queryKey: ["useDeclaration"] });
    },
    ...options,
  });
  return mutation;
}
