import { getUserWallet } from "@/lib/apiCalls";
import { UserWallerResponse } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export function useUserWallet() {
  const { data: session } = authClient.useSession();
  const sessionData = session as unknown as {
    role?: { name: string };
    applicationStatus?: string;
  };
  const roleName = sessionData?.role?.name;
  const appStatus = sessionData?.applicationStatus;

  // Don't fire for pending or rejected testers
  const isBlockedTester =
    roleName === "tester" &&
    (appStatus === "PENDING" || appStatus === "REJECTED");

  return useQuery<UserWallerResponse, Error>({
    queryFn: getUserWallet,
    queryKey: ["useUserWallet"],
    enabled: !isBlockedTester,
  });
}
