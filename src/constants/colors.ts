export interface ColorConfig {
  primary: string;
  background: string;
  shadow: string;
  description: string;
}

export type ThemeColorName = 
  | "cosmic" 
  | "ocean" 
  | "solar" 
  | "midnight" 
  | "sunset" 
  | "aurora";

export const themeColors: Record<ThemeColorName, ColorConfig> = {
  cosmic: {
    primary: "text-[#6366f1]",
    background: "bg-[#6366f1]",
    shadow: "shadow-[0_20px_40px_-15px_rgba(99,102,241,0.4)]",
    description: "Vivid Indigo"
  },
  ocean: {
    primary: "text-[#10b981]",
    background: "bg-[#10b981]",
    shadow: "shadow-[0_20px_40px_-15px_rgba(16,185,129,0.4)]",
    description: "Pure Emerald"
  },
  solar: {
    primary: "text-[#f59e0b]",
    background: "bg-[#f59e0b]",
    shadow: "shadow-[0_20px_40px_-15px_rgba(245,158,11,0.4)]",
    description: "Bright Amber"
  },
  midnight: {
    primary: "text-[#2563eb]",
    background: "bg-[#2563eb]",
    shadow: "shadow-[0_20px_40px_-15px_rgba(37,99,235,0.4)]",
    description: "Royal Blue"
  },
  sunset: {
    primary: "text-[#7c3aed]",
    background: "bg-[#7c3aed]",
    shadow: "shadow-[0_20px_40px_-15px_rgba(124,58,237,0.4)]",
    description: "Deep Violet"
  },
  aurora: {
    primary: "text-[#0d9488]",
    background: "bg-[#0d9488]",
    shadow: "shadow-[0_20px_40px_-15px_rgba(13,148,136,0.4)]",
    description: "Calm Teal"
  }
};