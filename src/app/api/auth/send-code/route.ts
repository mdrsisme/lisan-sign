import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendVerificationEmail } from "@/lib/brevo";
import { ApiResponse } from "@/types/api";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id, full_name, is_verified")
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

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await supabaseAdmin
      .from("tokens")
      .delete()
      .eq("user_id", user.id)
      .eq("type", "verification");

    const { error: tokenError } = await supabaseAdmin
      .from("tokens")
      .insert({
        user_id: user.id,
        token: verificationCode,
        type: "verification",
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) throw tokenError;

    await sendVerificationEmail(email, user.full_name, verificationCode);

    return NextResponse.json<ApiResponse>(
      { success: true, message: "Verification code sent" }
    );

  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}