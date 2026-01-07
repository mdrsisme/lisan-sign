"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, AtSign, Sparkles } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Toast from "@/components/ui/Toast";

export default function RegisterScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({ 
    full_name: "", 
    username: "", 
    email: "", 
    password: "" 
  });
  
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setToast({ message: "Registrasi Berhasil! Cek email Anda.", type: "success" });
      setTimeout(() => router.push(`/verify?email=${formData.email}`), 1500);
    } catch (error: any) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      theme="red"
      title="Buat Akun"
      subtitle="Daftar untuk memulai pembelajaran baru."
      quote="Keberanian adalah langkah pertama menuju perubahan."
    >
      <div className="fixed bottom-[-10%] right-[-10%] z-0 pointer-events-none">
        <Sparkles className="w-[300px] h-[300px] text-rose-900/20 blur-[80px]" />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        
        <div>
          <label className="mb-2 block text-xs font-bold text-rose-950">Nama Lengkap</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-900/40" size={18} />
            <input
              type="text"
              required
              className="w-full rounded-xl border border-rose-100 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-rose-950 placeholder:text-rose-900/30 focus:border-rose-800 focus:outline-none focus:ring-1 focus:ring-rose-800 transition-all shadow-sm"
              placeholder="Masukkan nama lengkap"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold text-rose-950">Username</label>
          <div className="relative">
            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-900/40" size={18} />
            <input
              type="text"
              required
              className="w-full rounded-xl border border-rose-100 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-rose-950 placeholder:text-rose-900/30 focus:border-rose-800 focus:outline-none focus:ring-1 focus:ring-rose-800 transition-all shadow-sm"
              placeholder="username_anda"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold text-rose-950">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-900/40" size={18} />
            <input
              type="email"
              required
              className="w-full rounded-xl border border-rose-100 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-rose-950 placeholder:text-rose-900/30 focus:border-rose-800 focus:outline-none focus:ring-1 focus:ring-rose-800 transition-all shadow-sm"
              placeholder="nama@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold text-rose-950">Kata Sandi</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-900/40" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              required
              className="w-full rounded-xl border border-rose-100 bg-white py-3.5 pl-11 pr-11 text-sm font-medium text-rose-950 placeholder:text-rose-900/30 focus:border-rose-800 focus:outline-none focus:ring-1 focus:ring-rose-800 transition-all shadow-sm"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-900/40 hover:text-rose-900"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-rose-800 to-red-800 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-900/20 transition-all hover:from-rose-950 hover:to-red-900 hover:shadow-rose-900/40 active:scale-95 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none"
        >
          {loading ? <LoadingSpinner /> : "Daftar Sekarang"}
        </button>

        <div className="mt-6 text-center text-sm font-medium text-rose-900/60">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-bold text-rose-900 hover:text-rose-950 hover:underline">
            Masuk Sekarang
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}