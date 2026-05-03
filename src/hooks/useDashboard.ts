import {
  addDashboardAppSubmit,
  addDashboardAppDraft,
  getDashboardAppsCount,
  getDashboardApps,
  deleteDashboardApp,
  getDashboardAppById,
} from "@/lib/apiCalls";
import {
  AppData,
  HubSubmittedAppResponse,
  SubmittedAppsCount,
} from "@/lib/types";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

/**
 * Hook to submit a dashboard app for testing
 * Uses POST /api/dashboard/add-dashboard-app-submit
 */
export function useAddDashboardAppSubmit(
  options?: UseMutationOptions<any, any, AppData>,
) {
  const mutation = useMutation({
    mutationFn: (payload: AppData) => addDashboardAppSubmit(payload),
    onSuccess: (data) => {
      console.log("Dashboard app submitted successfully: " + data);
    },
    onError: (data) => {
      console.log("Dashboard app submission failed: " + data);
    },
    ...options,
  });

  return mutation;
}

/**
 * Hook to save the current dashboard app as draft
 * Uses POST /api/dashboard/add-dashboard-app-draft
 * Only triggered when user clicks the Draft button
 */
export function useSaveDashboardAppDraft(
  options?: UseMutationOptions<any, any, AppData>,
) {
  const mutation = useMutation({
    mutationFn: (payload: AppData) => addDashboardAppDraft(payload),
    onSuccess: (data) => {
      console.log("Dashboard app draft saved successfully: " + data);
    },
    onError: (data) => {
      console.log("Dashboard app draft saving failed: " + data);
    },
    ...options,
  });

  return mutation;
}

/**
 * Hook to fetch the count of dashboard apps by status
 * Uses GET /api/dashboard/get-apps-count
 */
export function useDashboardAppsCount() {
  const query = useQuery<SubmittedAppsCount, Error>({
    queryFn: () => getDashboardAppsCount(),
    queryKey: ["useDashboardAppsCount"],
  });

  return query;
}

/**
 * Hook to fetch dashboard apps by type/status
 * Uses GET /api/dashboard/get-dashboard-apps/:type
 * @param type - The status type to filter apps by (e.g., "IN_REVIEW", "DRAFT", "REJECTED", "IN_TESTING", "COMPLETED")
 */
export function useDashboardApps({ type }: { type: string }) {
  const query = useQuery<HubSubmittedAppResponse[], Error>({
    queryFn: () => getDashboardApps(type),
    queryKey: ["useDashboardApps", type],
    enabled: !!type,
  });

  return query;
}

/**
 * Hook to delete a dashboard draft app
 * Uses DELETE /api/dashboard/delete-dashboard-app/:id
 */
export function useDeleteDashboardApp(
  options?: UseMutationOptions<any, any, string>,
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteDashboardApp(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useDashboardApps"] });
      queryClient.invalidateQueries({ queryKey: ["useDashboardAppsCount"] });
    },
    ...options,
  });

  return mutation;
}

/**
 * Hook to fetch a single dashboard app/draft by ID
 * Uses GET /api/dashboard/get-dashboard-app/:id
 * @param id - The ID of the dashboard app to fetch
 */
export function useDashboardAppById(id: string | null) {
  const query = useQuery<HubSubmittedAppResponse, Error>({
    queryFn: () => getDashboardAppById(id!),
    queryKey: ["useDashboardAppById", id],
    enabled: !!id,
  });

  return query;
}
