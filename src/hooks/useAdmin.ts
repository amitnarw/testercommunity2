import {
  adminLogin,
  getControlRoomData,
  getSubmittedApps,
  acceptApp,
  rejectApp,
  getSubmittedAppsCount,
  // Dashboard
  getDashboardStats,
  // Feedback
  getAllFeedback,
  getFeedbackById,
  getFeedbackCounts,
  updateFeedbackStatus,
  deleteFeedback,
  // Users
  getAllUsers,
  getUserById,
  getUserCounts,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  // Suggestions
  getAllSuggestions,
  getSuggestionById,
  getSuggestionCounts,
  createSuggestion,
  updateSuggestionStatus,
  deleteSuggestion,
  // Notifications
  getAllNotifications,
  getNotificationCounts,
  getNotificationTypes,
  createNotification,
  updateNotification,
  deleteNotification,
  broadcastNotification,
  // Tester Applications
  getTesterApplications,
  getTesterApplicationCounts,
  getTesterApplicationById,
  updateTesterApplicationStatus,
  updateProjectStatus,
  getAllPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  // Blog
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "@/lib/apiCallsAdmin";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

export function useControlRoomData(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryFn: () => getControlRoomData(),
    queryKey: ["useUserProfileInitial"],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useAdminLogin(options?: UseMutationOptions<any, any, any>) {
  const mutation = useMutation({
    mutationFn: (payload: any) => adminLogin(payload),
    ...options,
  });

  return mutation;
}

export function useSubmittedAppsCount(appType?: string, includeDrafts?: boolean) {
  const query = useQuery({
    queryFn: () => getSubmittedAppsCount(appType, includeDrafts),
    queryKey: ["useSubmittedAppsCount", appType, includeDrafts],
    staleTime: 0,
  });

  return query;
}

export function useSubmittedApps(
  status?: string,
  includeDrafts?: boolean,
  options?: { enabled?: boolean },
) {
  const query = useQuery({
    queryFn: () => getSubmittedApps(status, includeDrafts),
    queryKey: ["useSubmittedApps", status, includeDrafts],
    staleTime: 0,
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useAcceptApp(options?: UseMutationOptions<any, any, any>) {
  const mutation = useMutation({
    mutationFn: (payload: {
      id: number;
      totalTester?: number;
      totalDay?: number;
      minimumAndroidVersion?: number;
      rewardPoints?: number;
    }) => acceptApp(payload),
    ...options,
  });

  return mutation;
}

export function useRejectApp(options?: UseMutationOptions<any, any, any>) {
  const mutation = useMutation({
    mutationFn: (payload: {
      id: number;
      title: string;
      description: string;
      image?: string;
      video?: string;
    }) => rejectApp(payload),
    ...options,
  });

  return mutation;
}

export function useUpdateProjectStatus(
  options?: UseMutationOptions<any, any, any>,
) {
  const mutation = useMutation({
    mutationFn: (payload: { id: number; status: string }) =>
      updateProjectStatus(payload),
    ...options,
  });

  return mutation;
}

// ==================== DASHBOARD STATS ====================

export function useDashboardStats(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryFn: () => getDashboardStats(),
    queryKey: ["useDashboardStats"],
    enabled: options?.enabled ?? true,
  });

  return query;
}

// ==================== FEEDBACK ====================

export function useAllFeedback(
  params?: { status?: string; appType?: string },
  options?: { enabled?: boolean },
) {
  const query = useQuery({
    queryFn: () => getAllFeedback(params),
    queryKey: ["useAllFeedback", params],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useFeedbackById(id: number, options?: { enabled?: boolean }) {
  const query = useQuery({
    queryFn: () => getFeedbackById(id),
    queryKey: ["useFeedbackById", id],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useFeedbackCounts(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryFn: () => getFeedbackCounts(),
    queryKey: ["useFeedbackCounts"],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useUpdateFeedbackStatus(
  options?: UseMutationOptions<any, any, any>,
) {
  const mutation = useMutation({
    mutationFn: (payload: { id: number; priority?: string }) =>
      updateFeedbackStatus(payload),
    ...options,
  });

  return mutation;
}

export function useDeleteFeedback(options?: UseMutationOptions<any, any, any>) {
  const mutation = useMutation({
    mutationFn: (id: number) => deleteFeedback(id),
    ...options,
  });

  return mutation;
}

// ==================== USERS ====================

export function useAllUsers(
  params?: { role?: string; status?: string; search?: string },
  options?: { enabled?: boolean },
) {
  const query = useQuery({
    queryFn: () => getAllUsers(params),
    queryKey: ["useAllUsers", params],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useUserById(id: string, options?: { enabled?: boolean }) {
  const query = useQuery({
    queryFn: () => getUserById(id),
    queryKey: ["useUserById", id],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useUserCounts(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryFn: () => getUserCounts(),
    queryKey: ["useUserCounts"],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useUpdateUserStatus(
  options?: UseMutationOptions<any, any, any>,
) {
  const mutation = useMutation({
    mutationFn: (payload: { id: string; status: string; banReason?: string }) =>
      updateUserStatus(payload),
    ...options,
  });

  return mutation;
}

export function useUpdateUserRole(options?: UseMutationOptions<any, any, any>) {
  const mutation = useMutation({
    mutationFn: (payload: { id: string; role: string }) =>
      updateUserRole(payload),
    ...options,
  });

  return mutation;
}

export function useDeleteUser(options?: UseMutationOptions<any, any, any>) {
  const mutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    ...options,
  });

  return mutation;
}

// ==================== SUGGESTIONS ====================

export function useAllSuggestions(
  params?: { status?: string },
  options?: { enabled?: boolean },
) {
  const query = useQuery({
    queryFn: () => getAllSuggestions(params),
    queryKey: ["useAllSuggestions", params],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useSuggestionById(id: number, options?: { enabled?: boolean }) {
  const query = useQuery({
    queryFn: () => getSuggestionById(id),
    queryKey: ["useSuggestionById", id],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useSuggestionCounts(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryFn: () => getSuggestionCounts(),
    queryKey: ["useSuggestionCounts"],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useCreateSuggestion(
  options?: UseMutationOptions<any, any, any>,
) {
  const mutation = useMutation({
    mutationFn: (payload: {
      title?: string;
      message: string;
      type?: string;
      priority?: string;
      userId?: string;
    }) => createSuggestion(payload),
    ...options,
  });

  return mutation;
}

export function useUpdateSuggestionStatus(
  options?: UseMutationOptions<any, any, any>,
) {
  const mutation = useMutation({
    mutationFn: (payload: { id: number; status: string; reason?: string }) =>
      updateSuggestionStatus(payload),
    ...options,
  });

  return mutation;
}

export function useDeleteSuggestion(
  options?: UseMutationOptions<any, any, any>,
) {
  const mutation = useMutation({
    mutationFn: (id: number) => deleteSuggestion(id),
    ...options,
  });

  return mutation;
}

// ==================== NOTIFICATIONS ====================

export function useAllNotifications(
  params?: { type?: string },
  options?: { enabled?: boolean },
) {
  const query = useQuery({
    queryFn: () => getAllNotifications(params),
    queryKey: ["useAllNotifications", params],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useNotificationCounts(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryFn: () => getNotificationCounts(),
    queryKey: ["useNotificationCounts"],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useNotificationTypes(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryFn: () => getNotificationTypes(),
    queryKey: ["useNotificationTypes"],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useCreateNotification(
  options?: UseMutationOptions<any, any, any>,
) {
  const mutation = useMutation({
    mutationFn: (payload: {
      title: string;
      description: string;
      type?: string;
      url?: string;
      userId?: string;
      isActive?: boolean;
    }) => createNotification(payload),
    ...options,
  });

  return mutation;
}

export function useUpdateNotification(
  options?: UseMutationOptions<any, any, any>,
) {
  const mutation = useMutation({
    mutationFn: (payload: {
      id: number;
      title?: string;
      description?: string;
      type?: string;
      url?: string;
      isActive?: boolean;
    }) => updateNotification(payload),
    ...options,
  });

  return mutation;
}

export function useDeleteNotification(
  options?: UseMutationOptions<any, any, any>,
) {
  const mutation = useMutation({
    mutationFn: (id: number) => deleteNotification(id),
    ...options,
  });

  return mutation;
}

export function useBroadcastNotification(
  options?: UseMutationOptions<any, any, any>,
) {
  const mutation = useMutation({
    mutationFn: (payload: {
      title: string;
      description: string;
      type?: string;
      url?: string;
    }) => broadcastNotification(payload),
    ...options,
  });

  return mutation;
}

// ==================== TESTER APPLICATIONS ====================

export function useAllTesterApplications(
  params?: { status?: string; search?: string },
  options?: { enabled?: boolean },
) {
  const query = useQuery({
    queryFn: () => getTesterApplications(params),
    queryKey: ["useAllTesterApplications", params],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useTesterApplicationCounts(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryFn: () => getTesterApplicationCounts(),
    queryKey: ["useTesterApplicationCounts"],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useTesterApplicationById(
  id: string,
  options?: { enabled?: boolean },
) {
  const query = useQuery({
    queryFn: () => getTesterApplicationById(id),
    queryKey: ["useTesterApplicationById", id],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useUpdateTesterApplicationStatus(
  options?: UseMutationOptions<any, any, any>,
) {
  const mutation = useMutation({
    mutationFn: (payload: { id: string; status: string; reason?: string }) =>
      updateTesterApplicationStatus(payload),
    ...options,
  });

  return mutation;
}

// ==================== PROMO CODES ====================

export function useAllPromoCodes(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryFn: () => getAllPromoCodes(),
    queryKey: ["useAllPromoCodes"],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useCreatePromoCode(
  options?: UseMutationOptions<any, any, any>,
) {
  const mutation = useMutation({
    mutationFn: (payload: {
      code: string;
      fixedPoints: number;
      isActive?: boolean;
      maxUses?: number | null;
      maxPerUser?: number | null;
    }) => createPromoCode(payload),
    ...options,
  });

  return mutation;
}

export function useUpdatePromoCode(
  options?: UseMutationOptions<any, any, any>,
) {
  const mutation = useMutation({
    mutationFn: (payload: {
      id: number;
      code?: string;
      fixedPoints?: number;
      isActive?: boolean;
      maxUses?: number | null;
      maxPerUser?: number | null;
    }) => updatePromoCode(payload),
    ...options,
  });

  return mutation;
}

export function useDeletePromoCode(
  options?: UseMutationOptions<any, any, any>,
) {
  const mutation = useMutation({
    mutationFn: (id: number) => deletePromoCode(id),
    ...options,
  });

  return mutation;
}

// ==================== BLOGS ====================

export function useAllBlogs(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryFn: () => getAllBlogs(),
    queryKey: ["useAllBlogs"],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useBlogById(id: number, options?: { enabled?: boolean }) {
  const query = useQuery({
    queryFn: () => getBlogById(id),
    queryKey: ["useBlogById", id],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useCreateBlog(options?: UseMutationOptions<any, any, any>) {
  const mutation = useMutation({
    mutationFn: (payload: {
      title: string;
      slug: string;
      excerpt: string;
      content: string;
      authorName: string;
      authorAvatarUrl?: string;
      authorDataAiHint?: string;
      imageUrl?: string;
      dataAiHint?: string;
      tags?: string[];
      isActive?: boolean;
      date?: string;
    }) => createBlog(payload),
    ...options,
  });

  return mutation;
}

export function useUpdateBlog(options?: UseMutationOptions<any, any, any>) {
  const mutation = useMutation({
    mutationFn: (payload: {
      id: number;
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      authorName?: string;
      authorAvatarUrl?: string;
      authorDataAiHint?: string;
      imageUrl?: string;
      dataAiHint?: string;
      tags?: string[];
      isActive?: boolean;
      date?: string;
    }) => updateBlog(payload),
    ...options,
  });

  return mutation;
}

export function useDeleteBlog(options?: UseMutationOptions<any, any, any>) {
  const mutation = useMutation({
    mutationFn: (id: number) => deleteBlog(id),
    ...options,
  });

  return mutation;
}
