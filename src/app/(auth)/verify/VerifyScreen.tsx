"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Toast from "@/components/ui/Toast";

export default function VerifyScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!email) router.push("/login");
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setToast({ message: "Verifikasi Berhasil!", type: "success" });
      setTimeout(() => router.push("/login"), 1500);
    } catch (error: any) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      theme="orange"
      title="Verifikasi Akun"
      subtitle={`Masukkan kode OTP yang dikirim ke ${email}`}
      quote="Setiap isyarat memiliki cahaya."
    >
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-xs font-bold text-slate-900">Kode OTP</label>
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              required
              maxLength={6}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-center text-lg font-bold tracking-[0.5em] text-slate-900 placeholder:tracking-normal placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || code.length < 6}
          className="w-full rounded-xl bg-amber-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/30 transition-all hover:bg-amber-600 hover:shadow-amber-500/40 active:scale-95 disabled:bg-slate-300"
        >
          {loading ? <LoadingSpinner /> : "Verifikasi Kode"}
        </button>

        <div className="mt-6 text-center text-sm font-medium text-slate-500">
          Tidak menerima kode?{" "}
          <button type="button" className="font-bold text-amber-600 hover:text-amber-700 hover:underline">
            Kirim Ulang
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}