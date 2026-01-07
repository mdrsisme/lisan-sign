import { Metadata } from "next";
import VerifyScreen from "./VerifyScreen";

export const metadata: Metadata = {
  title: "Verifikasi Akun",
  description: "Masukkan kode OTP anda",
};

export default function VerifyPage() {
  return <VerifyScreen />;
}