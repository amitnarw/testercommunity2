import { getUserWallet } from "@/lib/apiCalls";
import { UserWallerResponse } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export function useUserWallet() {
  return useQuery<UserWallerResponse, Error>({
    queryFn: getUserWallet,
    queryKey: ["useUserWallet"],
  });
}
