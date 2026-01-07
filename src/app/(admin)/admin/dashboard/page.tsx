import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboardScreen from "./AdminDashboardScreen";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Pusat kontrol sistem pembelajaran isyarat.",
};

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  // Basic Server-Side Protection
  if (!accessToken) {
    redirect("/login");
  }

  // Optional: Decode token to verify role is 'admin' on server side
  try {
    const payload = JSON.parse(Buffer.from(accessToken.value.split('.')[1], 'base64').toString());
    if (payload.role !== "admin") {
      redirect("/dashboard"); // Kick back to user dashboard
    }
  } catch (error) {
    redirect("/login");
  }

  return <AdminDashboardScreen />;
}