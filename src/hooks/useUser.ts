import { getUserProfileData, saveInitialProfileData } from "@/lib/apiCalls";
import { useMutation, useQuery } from "@tanstack/react-query";

export interface UserProfilePayload {
  id: number;
  userId: string;
  first_name: string;
  last_name: string;
  phone: string;
  authType: string;
  roleId: number;
  banned: boolean;
  banReason: string;
  country: string;
  profileType: string;
  jobRole: string;
  company_name: string;
  company_size: string;
  position_in_company: string;
  company_website: string;
  experience_level: string;
  total_published_apps: string;
  platform_development: string;
  publish_frequency: string;
  service_usage: string;
  communication_methods: string;
  notification_preference: string;
  deviceCompany: string;
  deviceModel: string;
  ram: string;
  os: string;
  screenResolution: string;
  language: string;
  network: string;
  initial: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserProfleResponse = {
  success: true | false;
  data?: string;
  error?: string;
};

export function useUserProfileData(options?: { enabled?: boolean }) {
  const query = useQuery<UserProfleResponse, Error, UserProfilePayload>({
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
