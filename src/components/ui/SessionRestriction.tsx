"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert, Lock, ArrowLeft } from "lucide-react";

interface SessionRestrictionProps {
  title?: string;
  description?: string;
  onBack?: () => void;
  backLabel?: string;
}

export default function SessionRestriction({
  title = "Akses Dibatasi",
  description = "Anda tidak memiliki izin untuk mengakses halaman ini. Silakan login dengan akun yang sesuai.",
  onBack,
  backLabel = "Kembali ke Login"
}: SessionRestrictionProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 text-center shadow-2xl">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-red-500/10 rounded-full blur-[60px]" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-[60px]" />

        <div className="relative z-10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10 text-red-500 ring-1 ring-red-500/20">
          <ShieldAlert size={40} />
          <div className="absolute -bottom-2 -right-2 rounded-full bg-slate-900 p-1 text-slate-400 ring-1 ring-slate-800">
            <Lock size={16} />
          </div>
        </div>

        <h2 className="relative z-10 mb-3 text-2xl font-black text-white">
          {title}
        </h2>
        <p className="relative z-10 mb-8 text-sm font-medium leading-relaxed text-slate-400">
          {description}
        </p>

        <button
          onClick={handleBack}
          className="relative z-10 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-3.5 text-sm font-bold text-white transition-all hover:bg-slate-700 hover:text-red-400 active:scale-95"
        >
          <ArrowLeft size={18} />
          {backLabel}
        </button>

      </div>
    </div>
  );
}