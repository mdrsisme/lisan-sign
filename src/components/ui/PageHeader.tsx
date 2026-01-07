"use client";

import { LucideIcon, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  highlight: string;
  description: string;
  badge: string;
  icon?: LucideIcon;
  gradientClass?: string;
  glowClass?: string;
  className?: string;
}

export default function PageHeader({
  title,
  highlight,
  description,
  badge,
  icon: Icon = LayoutGrid,
  gradientClass = "from-violet-600 via-fuchsia-500 to-pink-500",
  glowClass = "bg-purple-600/20",
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[2.5rem] bg-[#09090b] border border-white/5 shadow-2xl",
        className
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div 
        className={cn(
            "absolute top-0 right-0 h-full w-2/3 blur-[120px] pointer-events-none mix-blend-screen transition-colors duration-500",
            glowClass
        )} 
      />
      
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>

      <div className="relative z-10 p-8 md:p-10 flex flex-col items-start justify-center h-full min-h-[200px]">
        
        <div className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-white uppercase shadow-lg mb-6 ring-1 ring-white/20",
            "bg-gradient-to-r", 
            gradientClass
        )}>
          <Icon size={12} strokeWidth={3} />
          <span>{badge}</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
          {title}{" "}
          <span className={cn(
            "italic text-transparent bg-clip-text bg-gradient-to-r pr-1",
            gradientClass
          )}>
            {highlight}
          </span>
        </h1>

        <div className="flex items-center gap-4 pl-1">
          <div className={cn("h-12 w-1 rounded-full opacity-50 bg-gradient-to-b", gradientClass)}></div>
          
          <p className="text-slate-400 font-medium text-sm md:text-base max-w-xl leading-relaxed">
            {description}
          </p>
        </div>

      </div>
    </div>
  );
}