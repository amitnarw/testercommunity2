import { getControlRoomData } from "@/lib/apiCalls";
import { useQuery } from "@tanstack/react-query";

export function useControlRoomData(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryFn: () => getControlRoomData(),
    queryKey: ["useUserProfileInitial"],
    enabled: options?.enabled ?? true,
  });

  return query;
}
