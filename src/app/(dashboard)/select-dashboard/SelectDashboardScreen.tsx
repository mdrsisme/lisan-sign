"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
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
        console.error("Failed to load user data", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-200/60 backdrop-blur-sm font-sans animate-in fade-in duration-500">
      
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px] mix-blend-multiply animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-500/20 rounded-full blur-[100px] mix-blend-multiply animate-pulse-slow delay-1000" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-400/20 rounded-full blur-[120px] mix-blend-multiply" />
      </div>

      <div className="relative w-full max-w-[28rem] p-4 scale-100 transform transition-all duration-300">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white border-2 border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] ring-1 ring-slate-200/50">
          
          <div className="relative px-6 py-10">
            
            {onClose && (
              <button 
                onClick={onClose}
                className="absolute top-5 left-5 p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors z-20"
              >
                <X size={18} />
              </button>
            )}

            {hasSession && (
              <div className="absolute top-6 right-6 z-20">
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold tracking-widest text-emerald-600 border border-emerald-100 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  ONLINE
                </div>
              </div>
            )}

            <div className="mb-10 text-center mt-2 relative z-10">
              <div className="group mx-auto mb-6 relative flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all duration-500 hover:scale-105 hover:rotate-3 hover:shadow-indigo-500/20">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-[2rem] opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                
                <div className="relative">
                    <div className="absolute -right-2 -top-2">
                        <Sparkles size={20} className="text-amber-400 fill-amber-400 animate-bounce" />
                    </div>
                    <User size={40} className="text-slate-600 group-hover:text-indigo-600 transition-colors duration-300" strokeWidth={2} />
                </div>
              </div>
              
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">{displayName}</span>
              </h1>
              <p className="text-sm font-medium text-slate-500 max-w-[80%] mx-auto leading-relaxed">
                Pilih akses ruang kerja Anda hari ini.
              </p>
            </div>

            <div className="space-y-4 relative z-10">

              <button
                disabled={userRole !== "admin"}
                onClick={() => router.push("/admin/dashboard")}
                className={`group relative w-full overflow-hidden rounded-2xl transition-all duration-500 border-2
                  ${userRole === "admin" 
                    ? "bg-slate-50 border-slate-100 hover:border-indigo-500 cursor-pointer shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.3)] hover:-translate-y-1" 
                    : "bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed grayscale"
                  }`}
              >
                {userRole === "admin" && (
                   <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
                )}

                <div className="relative flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-5">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-500 ${
                       userRole === "admin"
                       ? "bg-white text-indigo-600 shadow-sm group-hover:bg-white/20 group-hover:text-white group-hover:scale-110"
                       : "bg-slate-200 text-slate-400"
                    }`}>
                      {userRole === "admin" ? <Crown size={24} strokeWidth={2.5} /> : <Lock size={22} />}
                    </div>
                    
                    <div className="text-left">
                      <p className={`font-bold text-lg leading-tight mb-1 transition-colors duration-300 ${
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
                     <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-white/20 transition-all duration-300">
                        <ArrowRight size={16} className="text-slate-400 group-hover:text-white transition-colors" />
                     </div>
                  )}
                </div>
              </button>

              <button
                onClick={() => router.push("/dashboard")}
                className="group relative w-full overflow-hidden rounded-2xl bg-slate-50 border-2 border-slate-100 transition-all duration-500 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(6,182,212,0.3)] hover:border-cyan-500 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />

                <div className="relative flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-600 shadow-sm transition-all duration-500 group-hover:bg-white/20 group-hover:text-white group-hover:scale-110">
                      <LayoutGrid size={24} strokeWidth={2.5} />
                    </div>
                    
                    <div className="text-left">
                      <p className="font-bold text-lg text-slate-800 leading-tight mb-1 group-hover:text-white transition-colors duration-300">
                        User Dashboard
                      </p>
                      <p className="text-[11px] font-bold text-cyan-500 tracking-wider uppercase group-hover:text-cyan-100 transition-colors duration-300">
                        Area Belajar & Quiz
                      </p>
                    </div>
                  </div>

                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-white/20 transition-all duration-300">
                      <Zap size={16} className="text-slate-400 group-hover:text-white group-hover:fill-white" />
                  </div>
                </div>
              </button>

            </div>

            <div className="mt-10 text-center relative z-10">
              <button
                onClick={handleLogout}
                className="group inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-slate-400 transition-all duration-300 hover:text-rose-600 hover:bg-rose-50"
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