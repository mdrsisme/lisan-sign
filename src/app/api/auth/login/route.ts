import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiResponse } from "@/types/api";
import { SafeUser, User } from "@/types/user";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const { data: user } = await supabaseAdmin
      .from("users")
      .select("*")
      .or(`email.eq.${email},username.eq.${email}`)
      .single();

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invalid email/username or password" },
        { status: 401 }
      );
    }

    if (!user.is_verified) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Please verify your email address first" },
        { status: 403 }
      );
    }

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "30d" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "30d" }
    );

    const refreshExpiresAt = new Date();
    refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7);

    await supabaseAdmin.from("tokens").insert({
      user_id: user.id,
      token: refreshToken,
      type: "refresh",
      expires_at: refreshExpiresAt.toISOString(),
    });

    const { password_hash, ...safeUser } = user as User;

    const response = NextResponse.json<ApiResponse<{ user: SafeUser; accessToken: string }>>({
      success: true,
      message: "Login successful",
      data: {
        user: safeUser,
        accessToken
      }
    });

    response.cookies.set({
    name: "accessToken",
    value: accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 30 * 24 * 60 * 60
  });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 30 * 24 * 60 * 60
    });

    return response;

  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}