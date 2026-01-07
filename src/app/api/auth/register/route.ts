import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/brevo";
import { ApiResponse } from "@/types/api";
import { AppRole } from "@/types/user"; 

export async function POST(req: Request) {
  try {
    const { full_name, email, username, password } = await req.json();

    if (!full_name || !email || !username || !password) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("email, username")
      .or(`email.eq.${email},username.eq.${username}`)
      .single();

    if (existingUser) {
      const message = existingUser.email === email 
        ? "Email already registered" 
        : "Username already taken";
      
      return NextResponse.json<ApiResponse>(
        { success: false, message },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const defaultRole: AppRole = "user";

    const { data: newUser, error: createError } = await supabaseAdmin
      .from("users")
      .insert({
        full_name,
        email,
        username,
        password_hash: passwordHash,
        role: defaultRole,
        is_verified: false,
        is_premium: false,
        xp: 0,
        level: 1,
        avatar_url: null
      })
      .select()
      .single();

    if (createError) throw createError;

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await supabaseAdmin.from("tokens").insert({
      user_id: newUser.id,
      token: verificationCode,
      type: "verification",
      expires_at: expiresAt.toISOString(),
    });

    await sendVerificationEmail(email, full_name, verificationCode);

    return NextResponse.json<ApiResponse<{ userId: string }>>({ 
      success: true, 
      message: "Registration successful", 
      data: { userId: newUser.id } 
    });

  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}