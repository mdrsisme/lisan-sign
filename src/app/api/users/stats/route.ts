import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { ApiResponse } from "@/types/api";
import { UserStats } from "@/types/user";

export async function GET() {
  try {
    // 1. SECURITY CHECK: Pastikan Admin
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let userRole = "";
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      userRole = decoded.role;
    } catch (err) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invalid Token" },
        { status: 401 }
      );
    }

    if (userRole !== "admin") {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // 2. PERFORMANCE OPTIMIZATION: Gunakan Promise.all
    // Ini akan menjalankan ke-5 query secara BERSAMAAN (Parallel), bukan antri satu-satu.
    const [totalRes, adminRes, userRes, verifiedRes, premiumRes] = await Promise.all([
      supabaseAdmin.from("users").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("users").select("*", { count: "exact", head: true }).eq("role", "admin"),
      supabaseAdmin.from("users").select("*", { count: "exact", head: true }).eq("role", "user"),
      supabaseAdmin.from("users").select("*", { count: "exact", head: true }).eq("is_verified", true),
      supabaseAdmin.from("users").select("*", { count: "exact", head: true }).eq("is_premium", true)
    ]);

    // Cek jika ada error di salah satu query
    if (totalRes.error) throw totalRes.error;

    // Ambil nilai count (default 0 jika null)
    const total = totalRes.count || 0;
    const admins = adminRes.count || 0;
    const users = userRes.count || 0;
    const verified = verifiedRes.count || 0;
    const premium = premiumRes.count || 0;

    const statsData: UserStats = {
      total_users: total,
      by_role: {
        admin: admins,
        user: users
      },
      by_status: {
        verified_users: verified,
        premium_users: premium,
        unverified: total - verified
      }
    };

    return NextResponse.json<ApiResponse<UserStats>>({
      success: true,
      message: "Stats retrieved successfully",
      data: statsData
    });

  } catch (error: any) {
    console.error("Stats Error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Error retrieving stats", error: error.message },
      { status: 500 }
    );
  }
}