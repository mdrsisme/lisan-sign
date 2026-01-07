import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { ApiResponse } from "@/types/api";
import { SafeUser } from "@/types/user";

const getUserId = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded.userId;
  } catch {
    return null;
  }
};

export async function PATCH(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const full_name = formData.get("full_name") as string;
    const username = formData.get("username") as string;
    const imageFile = formData.get("avatar") as File;

    const updates: any = {};
    
    if (full_name && full_name.trim().length < 3) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Nama lengkap minimal 3 karakter" }, 
        { status: 400 }
      );
    }
    if (full_name) updates.full_name = full_name.trim();

    if (username) {
      const cleanUsername = username.trim().toLowerCase();

      const { data: existingUser } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("username", cleanUsername)
        .neq("id", userId)
        .single();

      if (existingUser) {
        return NextResponse.json<ApiResponse>(
          { success: false, message: "Username sudah digunakan orang lain" }, 
          { status: 409 }
        );
      }
      updates.username = cleanUsername;
    }

    if (imageFile) {
      if (!imageFile.type.startsWith("image/")) {
        return NextResponse.json<ApiResponse>(
            { success: false, message: "File harus berupa gambar" },
            { status: 400 }
        );
      }
      const upload = await uploadToCloudinary(imageFile, "lisan_avatars");
      updates.avatar_url = upload.url;
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select("id, full_name, username, email, role, avatar_url, xp, level, is_verified, is_premium, created_at, updated_at") // Select safe fields
      .single();

    if (error) throw error;

    return NextResponse.json<ApiResponse<SafeUser>>({ 
      success: true, 
      message: "Profil berhasil diperbarui", 
      data: data as SafeUser 
    });

  } catch (error: any) {
    console.error("Update Profile Error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Gagal memperbarui profil", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const { error } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", userId);

    if (error) throw error;

    const response = NextResponse.json<ApiResponse>({ 
      success: true, 
      message: "Akun berhasil dihapus permanen" 
    });
    
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;

  } catch (error: any) {
    console.error("Delete Account Error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Gagal menghapus akun", error: error.message },
      { status: 500 }
    );
  }
}