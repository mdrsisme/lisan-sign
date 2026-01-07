"use client";

import { useRouter } from "next/navigation";
import { Monitor, Smartphone, ArrowLeft } from "lucide-react";

export default function MobileRestriction() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505] p-6 font-sans">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-20%] right-[-20%] w-[400px] h-[400px] bg-indigo-600/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[400px] h-[400px] bg-rose-600/30 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-sm text-center">
        
        <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 to-rose-500 opacity-20 blur-xl animate-pulse" />
          <div className="relative flex h-full w-full items-center justify-center rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
            <Monitor size={40} className="text-white relative z-10" />
            <Smartphone size={24} className="text-slate-500 absolute bottom-4 right-4 bg-[#050505] rounded-md p-0.5" />
          </div>
        </div>

        <h2 className="mb-3 text-2xl font-black text-white tracking-tight">
          Tampilan Desktop
        </h2>
        
        <p className="mb-8 text-sm font-medium leading-relaxed text-slate-400">
          Untuk pengalaman belajar terbaik, silakan akses dashboard melalui perangkat Desktop atau Laptop.
        </p>

        <button
          onClick={() => router.push("/")}
          className="group relative w-full overflow-hidden rounded-xl bg-white py-3.5 transition-all active:scale-95"
        >
          <div className="flex items-center justify-center gap-2 font-bold text-slate-900">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </div>
        </button>

      </div>
    </div>
  );
}