import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { LeaderboardApiResponse } from "@/types/leaderboard";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabaseAdmin
      .from("leaderboards")
      .select(`
        xp_snapshot,
        level_snapshot,
        users!inner (
          username,
          full_name,
          avatar_url,
          is_verified
        )
      `, { count: "exact" })
      .eq("users.is_verified", true)
      .order("xp_snapshot", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const items = data.map((item: any, index: number) => ({
      rank: offset + index + 1,
      username: item.users?.username || "Unknown",
      full_name: item.users?.full_name || "No Name",
      avatar_url: item.users?.avatar_url || null,
      xp: item.xp_snapshot,
      level: item.level_snapshot,
    }));

    return NextResponse.json<LeaderboardApiResponse>({
      success: true,
      message: "Leaderboard fetched successfully",
      data: {
        items,
        pagination: {
          page,
          limit,
          total: count || 0,
          total_pages: Math.ceil((count || 0) / limit),
        },
      },
    });

  } catch (error: any) {
    return NextResponse.json<LeaderboardApiResponse>(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}