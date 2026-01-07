import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { ApiResponse } from "@/types/api";
import { AnnouncementStats } from "@/types/announcement";

export async function GET() {
  try {
    const [totalRes, publicRes, privateRes] = await Promise.all([
      supabaseAdmin.from("announcements").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("announcements").select("*", { count: "exact", head: true }).eq("is_public", true),
      supabaseAdmin.from("announcements").select("*", { count: "exact", head: true }).eq("is_public", false),
    ]);

    if (totalRes.error) throw totalRes.error;

    return NextResponse.json<ApiResponse<AnnouncementStats>>({
      success: true,
      message: "Stats retrieved successfully",
      data: {
        total: totalRes.count || 0,
        public_count: publicRes.count || 0,
        private_count: privateRes.count || 0,
      }
    });

  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}