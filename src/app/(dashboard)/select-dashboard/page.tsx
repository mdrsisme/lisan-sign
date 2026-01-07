import { Metadata } from "next";
import { cookies } from "next/headers";
import SelectDashboardScreen from "./SelectDashboardScreen";

export const metadata: Metadata = {
  title: "Pilih Dashboard",
  description: "Tentukan area kerja yang ingin anda akses",
};

export default async function SelectDashboardPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  
  let userRole: "user" | "admin" = "user";

  if (accessToken) {
    try {
      const payload = JSON.parse(Buffer.from(accessToken.value.split('.')[1], 'base64').toString());
      if (payload.role === "admin") {
        userRole = "admin";
      }
    } catch (error) {
      userRole = "user";
    }
  }

  return <SelectDashboardScreen userRole={userRole} />;
}