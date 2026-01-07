import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import AdminProfileScreen from "./AdminProfileScreen"; // Pastikan path import benar
import { SafeUser } from "@/types/user";
import jwt from "jsonwebtoken";

export const metadata: Metadata = {
  title: "Admin Profile | LisanAI",
  description: "Kelola informasi akun administrator.",
};

export default async function AdminProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) redirect("/login");

  let userId: string;
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    userId = decoded.userId;
  } catch {
    redirect("/login");
  }

  // --- FIX: Ambil semua data (*) agar field xp, level, is_premium tidak undefined ---
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("*") 
    .eq("id", userId)
    .single();

  if (!user) redirect("/login");

  return <AdminProfileScreen user={user as SafeUser} />;
}