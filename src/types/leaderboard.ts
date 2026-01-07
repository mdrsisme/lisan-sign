import { ApiResponse } from "@/types/api";

export interface LeaderboardItem {
  rank: number;
  username: string;
  full_name: string;
  avatar_url: string | null;
  xp: number;
  level: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface LeaderboardData {
  items: LeaderboardItem[];
  pagination: PaginationMeta;
}

export type LeaderboardApiResponse = ApiResponse<LeaderboardData>;