import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { ApiResponse } from "@/types/api";
import { SafeUser } from "@/types/user";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    let userRole = "";
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      userRole = decoded.role;
    } catch (err) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    if (userRole !== "admin") {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") === "asc";
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabaseAdmin
      .from("users")
      .select("id, full_name, username, email, role, is_verified, is_premium, xp, level, avatar_url, created_at, updated_at", { count: "exact" });

    if (role && role !== "all") {
      query = query.eq("role", role);
    }

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,username.ilike.%${search}%`);
    }

    query = query
      .order(sortBy, { ascending: order })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json<ApiResponse<SafeUser[]> & { meta: any }>({ 
      success: true, 
      message: "Data retrieved successfully",
      data: data as SafeUser[],
      meta: {
        page,
        limit,
        total: count || 0,
        totalPages: count ? Math.ceil(count / limit) : 0
      }
    });

  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Error fetching data", error: error.message },
      { status: 500 }
    );
  }
}