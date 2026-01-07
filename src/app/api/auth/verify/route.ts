import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { ApiResponse } from "@/types/api";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Email and code are required" },
        { status: 400 }
      );
    }

    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id, is_verified")
      .eq("email", email)
      .single();

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.is_verified) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "User already verified" },
        { status: 400 }
      );
    }

    const { data: tokenData } = await supabaseAdmin
      .from("tokens")
      .select("*")
      .eq("user_id", user.id)
      .eq("token", code)
      .eq("type", "verification")
      .single();

    if (!tokenData) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invalid verification code" },
        { status: 400 }
      );
    }

    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Verification code expired" },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ 
        is_verified: true,
        updated_at: new Date().toISOString() 
      })
      .eq("id", user.id);

    if (updateError) throw updateError;

    await supabaseAdmin
      .from("tokens")
      .delete()
      .eq("id", tokenData.id);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}