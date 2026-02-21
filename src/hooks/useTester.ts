import { getTesterProjects } from "@/lib/apiCalls";
import { TesterProjectResponse } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export function useTesterProjects(status?: string) {
  const query = useQuery<TesterProjectResponse[], Error>({
    queryFn: () => getTesterProjects(status),
    queryKey: ["useTesterProjects", status],
  });

  return query;
}
