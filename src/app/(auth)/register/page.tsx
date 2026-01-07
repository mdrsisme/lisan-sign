import { Metadata } from "next";
import RegisterScreen from "./RegisterScreen";

export const metadata: Metadata = {
  title: "Daftar Akun",
  description: "Buat akun baru di LISAN",
};

export default function RegisterPage() {
  return <RegisterScreen />;
}