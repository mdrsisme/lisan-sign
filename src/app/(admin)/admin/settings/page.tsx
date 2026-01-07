import { Metadata } from "next";
import AdminSettingsScreen from "./AdminSettingsScreen";

export const metadata: Metadata = {
  title: "System Settings",
  description: "Konfigurasi sistem dan preferensi aplikasi.",
};

export default function AdminSettingsPage() {
  return <AdminSettingsScreen />;
}