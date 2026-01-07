"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  LayoutGrid,
  ArrowRight,
  LogOut,
  Sparkles,
  Lock,
  User,
  Zap,
  X,
  Crown
} from "lucide-react";

interface Props {
  userRole: "admin" | "user";
  hasSession?: boolean;
  onClose?: () => void;
}

export default function SelectWorkspaceModal({
  userRole,
  hasSession = true,
  onClose
}: Props) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("User");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setDisplayName(parsedUser.username || parsedUser.full_name || "User");
        }
      } catch (error) {
        console.error("Failed to load user data from local storage", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-50/60 backdrop-blur-md font-sans animate-in fade-in duration-300">
      
      {/* --- COLORFUL BACKGROUND BLOBS (Light Mode) --- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[100px] mix-blend-multiply animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-200/40 rounded-full blur-[100px] mix-blend-multiply animate-pulse-slow delay-1000" />
        <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] bg-cyan-200/40 rounded-full blur-[80px] mix-blend-multiply animate-pulse-slow delay-700" />
      </div>

      {/* --- MAIN CARD --- */}
      <div className="relative w-full max-w-[28rem] scale-100 transform transition-all duration-300 p-4">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white/80 border border-white/60 p-2 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] ring-1 ring-white/60 backdrop-blur-2xl">
          
          <div className="relative rounded-[2rem] bg-gradient-to-b from-white to-slate-50/50 px-6 py-10 border border-white">
            
            {/* Close Button */}
            {onClose && (
              <button 
                onClick={onClose}
                className="absolute top-5 left-5 p-2 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors z-20"
              >
                <X size={18} />
              </button>
            )}

            {/* Online Badge */}
            {hasSession && (
              <div className="absolute top-6 right-6 z-20">
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-3 py-1 text-[10px] font-bold tracking-widest text-emerald-600 border border-emerald-200 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  ONLINE
                </div>
              </div>
            )}

            {/* Header Content */}
            <div className="mb-10 text-center mt-2 relative z-10">
              <div className="group mx-auto mb-6 relative flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-tr from-white to-slate-50 shadow-xl shadow-indigo-100 border border-white transition-all duration-500 hover:scale-110 hover:-rotate-3">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[2rem] opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                
                {/* Profile Icon with Gradient */}
                <div className="relative">
                    <div className="absolute -right-2 -top-2">
                        <Sparkles size={16} className="text-amber-400 fill-amber-400 animate-bounce" />
                    </div>
                    <User size={44} className="text-slate-700" strokeWidth={2.5} />
                </div>
              </div>
              
              <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
                Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{displayName}</span>
              </h1>
              <p className="text-sm font-medium text-slate-500 max-w-[80%] mx-auto">
                Pilih ruang kerja yang ingin Anda akses hari ini.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 relative z-10">

              {/* 1. ADMIN BUTTON */}
              <button
                disabled={userRole !== "admin"}
                onClick={() => router.push("/admin/dashboard")}
                className={`group relative w-full overflow-hidden rounded-2xl transition-all duration-500 border
                  ${userRole === "admin" 
                    ? "bg-white border-slate-100 hover:border-indigo-500/0 hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.4)] cursor-pointer" 
                    : "bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed grayscale"
                  }`}
              >
                {/* Gradient Fill Animation */}
                {userRole === "admin" && (
                   <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                )}

                <div className="relative flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-5">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-500 ${
                       userRole === "admin"
                       ? "bg-indigo-50 text-indigo-600 group-hover:bg-white/20 group-hover:text-white"
                       : "bg-slate-200 text-slate-400"
                    }`}>
                      {userRole === "admin" ? <Crown size={24} strokeWidth={2.5} /> : <Lock size={22} />}
                    </div>
                    
                    <div className="text-left">
                      <p className={`font-bold text-lg leading-tight mb-0.5 transition-colors duration-300 ${
                          userRole === "admin" ? "text-slate-800 group-hover:text-white" : "text-slate-500"
                      }`}>
                        Admin Space
                      </p>
                      <p className={`text-[11px] font-bold tracking-wider uppercase transition-colors duration-300 ${
                          userRole === "admin" ? "text-indigo-500 group-hover:text-indigo-100" : "text-slate-400"
                      }`}>
                        {userRole === "admin" ? "Kontrol Penuh System" : "Akses Dibatasi"}
                      </p>
                    </div>
                  </div>

                  {userRole === "admin" && (
                     <ArrowRight size={20} className="text-slate-300 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                  )}
                </div>
              </button>

              {/* 2. USER BUTTON */}
              <button
                onClick={() => router.push("/dashboard")}
                className="group relative w-full overflow-hidden rounded-2xl bg-white border border-slate-100 transition-all duration-500 hover:border-blue-500/0 hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.4)]"
              >
                {/* Gradient Fill Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />

                <div className="relative flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all duration-500 group-hover:bg-white/20 group-hover:text-white">
                      <LayoutGrid size={24} strokeWidth={2.5} />
                    </div>
                    
                    <div className="text-left">
                      <p className="font-bold text-lg text-slate-800 leading-tight mb-0.5 group-hover:text-white transition-colors duration-300">
                        User Dashboard
                      </p>
                      <p className="text-[11px] font-bold text-blue-500 tracking-wider uppercase group-hover:text-blue-100 transition-colors duration-300">
                        Area Belajar & Quiz
                      </p>
                    </div>
                  </div>

                  <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                      <Zap size={16} className="text-slate-400 group-hover:text-white group-hover:fill-white" />
                  </div>
                </div>
              </button>

            </div>

            {/* Logout Link */}
            <div className="mt-10 text-center relative z-10">
              <button
                onClick={handleLogout}
                className="group inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-slate-400 transition-all duration-300 hover:text-red-500 hover:bg-red-50"
              >
                <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                <span>Akhiri Sesi & Keluar</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}