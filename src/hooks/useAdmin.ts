import {
  adminLogin,
  getControlRoomData,
  getSubmittedApps,
  getSubmittedAppsCount,
  acceptApp,
  rejectApp,
  updateProjectStatus,
  getDashboardStats,
  getAllFeedback,
  getFeedbackById,
  getFeedbackCounts,
  updateFeedbackStatus,
  deleteFeedback,
  getAllUsers,
  getUserById,
  getUserCounts,
  updateUserStatus,
  updateUserRole,
  updateUserProfile,
  deleteUser,
  getAllSuggestions,
  getSuggestionById,
  getSuggestionCounts,
  createSuggestion,
  updateSuggestionStatus,
  deleteSuggestion,
  getAllNotifications,
  getNotificationCounts,
  getNotificationTypes,
  createNotification,
  updateNotification,
  deleteNotification,
  broadcastNotification,
  getTesterApplications,
  getTesterApplicationCounts,
  getTesterApplicationById,
  updateTesterApplicationStatus,
  getAllPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  actAsRole,
  getAllUserReviews,
  getUserReviewById,
  updateUserReviewStatus,
  deleteUserReview,
  getFinanceDashboard,
  getFinanceOrders,
  getFinancePayments,
  getFinanceInvoices,
  getFinanceRefunds,
  getFinanceWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  getFinancePricing,
  updateFinancePricing,
  getUserWalletDetail,
  getFinancePlans,
  getFinancePaymentMethods,
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "@/lib/apiCallsAdmin";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { useState, useEffect, useCallback } from "react";
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

export function useUpdateUserProfile(options?: UseMutationOptions<any, any, any>) {
  const mutation = useMutation({
    mutationFn: (payload: { id: string; data: any }) =>
      updateUserProfile(payload),
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
      discountType?: string;
      discountValue?: number;
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
      discountType?: string;
      discountValue?: number;
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

// ==================== TESTIMONIALS ====================

export function useAllTestimonials(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryFn: () => getAllTestimonials(),
    queryKey: ["useAllTestimonials"],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useTestimonialById(id: number, options?: { enabled?: boolean }) {
  const query = useQuery({
    queryFn: () => getTestimonialById(id),
    queryKey: ["useTestimonialById", id],
    enabled: options?.enabled ?? (id > 0),
  });

  return query;
}

export function useCreateTestimonial(options?: UseMutationOptions<any, any, any>) {
  const mutation = useMutation({
    mutationFn: (payload: {
      name: string;
      role: string;
      avatar: string;
      dataAiHint?: string;
      comment: string;
      image?: string;
      appLink?: string;
      tags?: string[];
      rating?: number;
      isActive?: boolean;
    }) => createTestimonial(payload),
    ...options,
  });

  return mutation;
}

export function useUpdateTestimonial(options?: UseMutationOptions<any, any, any>) {
  const mutation = useMutation({
    mutationFn: (payload: {
      id: number;
      name?: string;
      role?: string;
      avatar?: string;
      dataAiHint?: string;
      comment?: string;
      image?: string;
      appLink?: string;
      tags?: string[];
      rating?: number;
      isActive?: boolean;
    }) => updateTestimonial(payload),
    ...options,
  });

  return mutation;
}

export function useDeleteTestimonial(options?: UseMutationOptions<any, any, any>) {
  const mutation = useMutation({
    mutationFn: (id: number) => deleteTestimonial(id),
    ...options,
  });

  return mutation;
}

// ==================== AUTHORS ====================

export function useAllAuthors(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryFn: () => getAllAuthors(),
    queryKey: ["useAllAuthors"],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useAuthorById(id: number, options?: { enabled?: boolean }) {
  const query = useQuery({
    queryFn: () => getAuthorById(id),
    queryKey: ["useAuthorById", id],
    enabled: options?.enabled ?? (id > 0),
  });

  return query;
}

export function useCreateAuthor(options?: UseMutationOptions<any, any, any>) {
  const mutation = useMutation({
    mutationFn: (payload: {
      name: string;
      avatarUrl?: string;
      bio?: string;
      dataAiHint?: string;
    }) => createAuthor(payload),
    ...options,
  });

  return mutation;
}

export function useUpdateAuthor(options?: UseMutationOptions<any, any, any>) {
  const mutation = useMutation({
    mutationFn: (payload: {
      id: number;
      name?: string;
      avatarUrl?: string;
      bio?: string;
      dataAiHint?: string;
    }) => updateAuthor(payload),
    ...options,
  });

  return mutation;
}

export function useDeleteAuthor(options?: UseMutationOptions<any, any, any>) {
  const mutation = useMutation({
    mutationFn: (id: number) => deleteAuthor(id),
    ...options,
  });

  return mutation;
}

// ==================== USER REVIEWS (Admin) ====================

export function useAllUserReviews(
  params?: { status?: string; search?: string },
  options?: { enabled?: boolean },
) {
  const query = useQuery({
    queryFn: () => getAllUserReviews(params),
    queryKey: ["useAllUserReviews", params],
    enabled: options?.enabled ?? true,
  });
  return query;
}

export function useUserReviewById(id: number, options?: { enabled?: boolean }) {
  const query = useQuery({
    queryFn: () => getUserReviewById(id),
    queryKey: ["useUserReviewById", id],
    enabled: options?.enabled ?? (id > 0),
  });
  return query;
}

export function useUpdateUserReviewStatus(
  options?: UseMutationOptions<any, any, any>,
) {
  const mutation = useMutation({
    mutationFn: (payload: {
      id: number;
      status?: string;
      isPublished?: boolean;
      adminNote?: string;
    }) => updateUserReviewStatus(payload),
    ...options,
  });
  return mutation;
}

export function useDeleteUserReview(
  options?: UseMutationOptions<any, any, any>,
) {
  const mutation = useMutation({
    mutationFn: (id: number) => deleteUserReview(id),
    ...options,
  });
  return mutation;
}

// ==================== ACT AS ROLE ====================

export function useActAsRole(options?: UseMutationOptions<any, any, any>) {
  const router = useRouter();
  const [actingAsRole, setActingAsRole] = useState<"tester" | "user" | null>(null);

  // Check for acting_as_role cookie on mount
  useEffect(() => {
    const checkCookie = async () => {
      try {
        // Read cookie directly since httpOnly cookie can't be accessed from JS
        const cookies = document.cookie.split("; ");
        const actingCookie = cookies.find((c) => c.startsWith("acting_as_role="));
        if (actingCookie) {
          const role = actingCookie.split("=")[1];
          if (role === "tester" || role === "user") {
            setActingAsRole(role);
          }
        }
      } catch (e) {
        console.error("Error reading acting_as_role cookie:", e);
      }
    };
    checkCookie();
  }, []);

    const mutation = useMutation({
      mutationFn: async (role: "tester" | "user" | null) => {
        const result = await actAsRole(role);
        return result;
      },
      onSuccess: (data, role) => {
        if (!role) {
          // Clearing - go to admin dashboard
          setActingAsRole(null);
          router.push(ROUTES.ADMIN.DASHBOARD);
        } else {
          setActingAsRole(role);
          // Redirect to the respective dashboard after acting as
          if (role === "tester") {
            router.push(ROUTES.TESTER.DASHBOARD);
          } else if (role === "user") {
            router.push(ROUTES.AUTHENTICATED.COMMUNITY_DASHBOARD);
          }
        }
      },
      ...options,
    });

  const startActingAs = useCallback(
    (role: "tester" | "user") => {
      mutation.mutate(role);
    },
    [mutation],
  );

  const stopActingAs = useCallback(() => {
    mutation.mutate(null);
  }, [mutation]);

  return {
    actingAsRole,
    startActingAs,
    stopActingAs,
    isLoading: mutation.isPending,
  };
}

// ==================== FINANCE HOOKS ====================

export function useFinanceDashboard() {
  return useQuery({
    queryFn: () => getFinanceDashboard(),
    queryKey: ["useFinanceDashboard"],
  });
}

export function useFinanceOrders(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  return useQuery({
    queryFn: () => getFinanceOrders(params),
    queryKey: ["useFinanceOrders", params],
  });
}

export function useFinancePayments(params?: {
  page?: number;
  limit?: number;
  status?: string;
  method?: string;
  search?: string;
}) {
  return useQuery({
    queryFn: () => getFinancePayments(params),
    queryKey: ["useFinancePayments", params],
  });
}

export function useFinanceInvoices(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  return useQuery({
    queryFn: () => getFinanceInvoices(params),
    queryKey: ["useFinanceInvoices", params],
  });
}

export function useFinanceRefunds(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  return useQuery({
    queryFn: () => getFinanceRefunds(params),
    queryKey: ["useFinanceRefunds", params],
  });
}

export function useFinanceWithdrawals(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  return useQuery({
    queryFn: () => getFinanceWithdrawals(params),
    queryKey: ["useFinanceWithdrawals", params],
  });
}

export function useApproveWithdrawal(options?: UseMutationOptions<any, any, number>) {
  return useMutation({
    mutationFn: (id: number) => approveWithdrawal(id),
    ...options,
  });
}

export function useRejectWithdrawal(options?: UseMutationOptions<any, any, { id: number; note?: string }>) {
  return useMutation({
    mutationFn: ({ id, note }) => rejectWithdrawal(id, note),
    ...options,
  });
}

export function useFinancePricing() {
  return useQuery({
    queryFn: () => getFinancePricing(),
    queryKey: ["useFinancePricing"],
  });
}

export function useUpdateFinancePricing(options?: UseMutationOptions<any, any, { id: number; payload: any }>) {
  return useMutation({
    mutationFn: ({ id, payload }) => updateFinancePricing(id, payload),
    ...options,
  });
}

export function useUserWalletDetail(userId: string | null) {
  return useQuery({
    queryFn: () => getUserWalletDetail(userId!),
    queryKey: ["useUserWalletDetail", userId],
    enabled: !!userId,
  });
}

export function useFinancePlans() {
  return useQuery({
    queryFn: () => getFinancePlans(),
    queryKey: ["useFinancePlans"],
  });
}

export function useFinancePaymentMethods() {
  return useQuery({
    queryFn: () => getFinancePaymentMethods(),
    queryKey: ["useFinancePaymentMethods"],
  });
}
