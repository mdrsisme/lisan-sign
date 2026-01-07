import { Metadata } from "next";
import LoginScreen from "./LoginScreen";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke akun LISAN anda",
};

export default function LoginPage() {
  return <LoginScreen />;
}