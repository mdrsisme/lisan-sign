import { Zap, Gamepad2, UserRound, ArrowUpRight } from "lucide-react";
import { themeColors } from "@/constants/colors";

export default function Features() {
  const features = [
    {
      title: "AI Penerjemah 2 Arah",
      desc: "Terjemahan real-time bahasa isyarat ke suara.",
      icon: <Zap className="text-white" size={18} />,
      theme: themeColors.cosmic,
    },
    {
      title: "Gamifikasi Interaktif",
      desc: "Belajar seru dengan tantangan dan level.",
      icon: <Gamepad2 className="text-white" size={18} />,
      theme: themeColors.sunset,
    },
    {
      title: "Avatar 3D Ekspresif",
      desc: "Visualisasi gerakan dan ekspresi natural.",
      icon: <UserRound className="text-white" size={18} />,
      theme: themeColors.solar,
    }
  ];

  return (
    <section className="relative py-16 bg-[#F8FAFC] overflow-hidden selection:bg-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-5%] left-[10%] w-[300px] h-[300px] ${themeColors.cosmic.background} rounded-full blur-[120px] opacity-10`} />
        <div className={`absolute bottom-[-5%] right-[10%] w-[300px] h-[300px] ${themeColors.solar.background} rounded-full blur-[120px] opacity-10`} />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
            Teknologi <span className={themeColors.cosmic.primary}>Tanpa Batas</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((item, i) => (
            <div 
              key={i} 
              className="group relative p-5 rounded-[1.5rem] bg-white/60 backdrop-blur-xl border border-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-start mb-5">
                <div className="relative w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
                  <div className={`absolute inset-0 rounded-xl ${item.theme.background} blur-md opacity-30 group-hover:opacity-60 transition-opacity`} />
                  <div className="relative z-10">{item.icon}</div>
                </div>
                
                <ArrowUpRight size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}