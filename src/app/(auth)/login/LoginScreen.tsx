"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Leaf } from "lucide-react"; // Tambah ikon Leaf
import AuthLayout from "@/components/auth/AuthLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Toast from "@/components/ui/Toast";

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      if (data.data?.accessToken) {
        localStorage.setItem("accessToken", data.data.accessToken);
      }

      if (data.data?.user) {
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }

      localStorage.setItem("authSession", JSON.stringify(data));

      setToast({ message: "Login Berhasil!", type: "success" });
      
      if (data.data.user.role === "admin") {
        setTimeout(() => router.push("/select-dashboard"), 1000);
      } else {
        setTimeout(() => router.push("/dashboard/"), 1000);
      }

    } catch (error: any) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      theme="green"
      title="Selamat Datang"
      subtitle="Masuk untuk melanjutkan pembelajaran."
      quote="Teruslah belajar dan berkembang bersama kami."
    >
      <div className="fixed bottom-[-10%] right-[-10%] z-0 pointer-events-none">
        <Leaf className="w-[300px] h-[300px] text-emerald-500/20 blur-[80px]" />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        
        <div>
          <label className="mb-2 block text-xs font-bold text-slate-900">Email / Username</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Email atau Username"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold text-slate-900">Kata Sandi</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-11 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-700 hover:shadow-emerald-500/40 active:scale-95 disabled:bg-slate-300"
        >
          {loading ? <LoadingSpinner /> : "Masuk Sekarang"}
        </button>

        <div className="mt-6 text-center text-sm font-medium text-slate-500">
          Belum punya akun?{" "}
          <Link href="/register" className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
            Daftar Gratis
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}