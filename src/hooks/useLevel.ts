import { useQuery } from "@tanstack/react-query";
import { getMyLevel, getLeaderboard, getLevelConfig } from "@/lib/apiCalls";
import type {
  MyLevelResponse,
  LevelConfigEntry,
  LeaderboardEntry,
} from "@/lib/types";

export function useMyLevel() {
  return useQuery<MyLevelResponse>({
    queryKey: ["my-level"],
    queryFn: () => getMyLevel(),
  });
}

export function useLeaderboard(limit = 50) {
  return useQuery<{ items: LeaderboardEntry[] }>({
    queryKey: ["leaderboard", limit],
    queryFn: () => getLeaderboard(limit),
  });
}

export function useLevelConfig() {
  return useQuery<{ items: LevelConfigEntry[] }>({
    queryKey: ["level-config"],
    queryFn: () => getLevelConfig(),
  });
}
