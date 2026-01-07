"use client";

import Link from "next/link";
import { ArrowLeft, Quote } from "lucide-react";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  quote: string;
  theme: "red" | "orange" | "green";
  backUrl?: string;
}

export default function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  quote, 
  theme, 
  backUrl = "/" 
}: AuthLayoutProps) {
  
  const themes = {
    red: {
      textAccent: "text-rose-600",
      bgGradient: "from-rose-950 via-red-900 to-rose-950",
      blobColor: "bg-rose-500",
      buttonHover: "group-hover:text-rose-600 group-hover:border-rose-200 group-hover:bg-rose-50",
      borderFocus: "focus-within:ring-rose-500",
      iconColor: "text-rose-400",
    },
    orange: {
      textAccent: "text-amber-600",
      bgGradient: "from-amber-950 via-orange-900 to-amber-950",
      blobColor: "bg-orange-500",
      buttonHover: "group-hover:text-amber-600 group-hover:border-amber-200 group-hover:bg-amber-50",
      borderFocus: "focus-within:ring-amber-500",
      iconColor: "text-amber-400",
    },
    green: {
      textAccent: "text-emerald-600",
      bgGradient: "from-emerald-950 via-teal-900 to-emerald-950",
      blobColor: "bg-emerald-500",
      buttonHover: "group-hover:text-emerald-600 group-hover:border-emerald-200 group-hover:bg-emerald-50",
      borderFocus: "focus-within:ring-emerald-500",
      iconColor: "text-emerald-400",
    },
  };

  const currentTheme = themes[theme];

  return (
    <div className="flex min-h-screen w-full bg-white font-sans overflow-hidden selection:bg-slate-900 selection:text-white">
      <style jsx global>{`
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-bg {
          background-size: 200% 200%;
          animation: gradient-move 15s ease infinite;
        }
      `}</style>
      
      <div className="relative flex w-full flex-col justify-center px-8 md:w-[55%] lg:px-24 xl:px-32 z-10">
        
        <div className="absolute inset-0 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] -z-10"></div>
        <div className={`absolute left-0 top-0 h-[500px] w-[500px] -translate-x-[30%] -translate-y-[20%] rounded-full ${currentTheme.blobColor} opacity-[0.03] blur-[100px] pointer-events-none`} />

        <div className="absolute left-8 top-8 lg:left-12 lg:top-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <Link
            href={backUrl}
            className={`group flex items-center gap-2 rounded-full border border-slate-200 bg-white/50 px-5 py-2.5 text-sm font-semibold text-slate-600 backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:pl-4 ${currentTheme.buttonHover}`}
          >
            <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Kembali</span>
          </Link>
        </div>

        <div className="mt-16 w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              {title.split(" ")[0]} <span className={`${currentTheme.textAccent}`}>{title.split(" ").slice(1).join(" ")}</span>
            </h1>
            <p className="mt-3 text-lg text-slate-500 leading-relaxed">{subtitle}</p>
          </div>
          
          <div className={`relative ${currentTheme.borderFocus}`}>
             {children}
          </div>
        </div>
      </div>

      <div className={`relative hidden w-[45%] flex-col items-center justify-center text-white md:flex overflow-hidden bg-black`}>
        
        <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.bgGradient} opacity-90 animate-gradient-bg`} />
        
        <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${currentTheme.blobColor} rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse`} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-[120px] opacity-20 animate-pulse duration-[4000ms]" />

        <div className="relative z-20 flex flex-col items-center justify-center h-full px-12 text-center w-full max-w-xl">
          
          <div className="relative rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-md shadow-2xl animate-in zoom-in-95 duration-1000">
            <div className={`absolute -top-6 left-1/2 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 backdrop-blur-xl shadow-lg ${currentTheme.iconColor}`}>
              <Quote size={20} className="fill-current" />
            </div>

            <blockquote className="mt-4 text-2xl font-medium leading-relaxed tracking-wide font-serif italic text-white/90">
              "{quote}"
            </blockquote>
            
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/50"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/50"></div>
            </div>
          </div>

          <p className="mt-10 text-sm font-medium tracking-widest text-white/40 uppercase">
            Platform Pembelajaran Bahasa Isyarat
          </p>
        </div>

      </div>
    </div>
  );
}