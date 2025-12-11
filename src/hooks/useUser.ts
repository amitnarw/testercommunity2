import { getUserProfileData, saveInitialProfileData } from "@/lib/apiCalls";
import { UserProfileData } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export type UserProfleResponse = {
  success: true | false;
  data?: string;
  error?: string;
};

export function useUserProfileData(options?: { enabled?: boolean }) {
  const query = useQuery<UserProfleResponse, Error, UserProfileData>({
    queryFn: () => getUserProfileData(),
    queryKey: ["getUserProfileData"],
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useUserProfileInitial(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryFn: () => saveInitialProfileData(),
    queryKey: ["useUserProfileInitial"],
    enabled: options?.enabled ?? true,
  });

  return query;
}
