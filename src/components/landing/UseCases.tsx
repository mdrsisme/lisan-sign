import { Building2, GraduationCap, Users, ArrowUpRight } from "lucide-react";
import { themeColors } from "@/constants/colors";

export default function UseCases() {
  const cases = [
    {
      title: "Pendidikan Inklusif",
      desc: "Mendukung kurikulum sekolah inklusi dan pembelajaran bahasa isyarat terstruktur.",
      icon: <GraduationCap size={20} className="text-white" />,
      theme: themeColors.cosmic
    },
    {
      title: "Layanan Publik",
      desc: "Solusi aksesibilitas komunikasi di rumah sakit, pemerintahan, dan layanan pelanggan.",
      icon: <Building2 size={20} className="text-white" />,
      theme: themeColors.sunset
    },
    {
      title: "Komunikasi Sosial",
      desc: "Menjembatani percakapan natural antara Teman Tuli dan Teman Dengar.",
      icon: <Users size={20} className="text-white" />,
      theme: themeColors.ocean
    }
  ];

  return (
    <section className="hidden md:block py-20 bg-[#F8FAFC] relative overflow-hidden selection:bg-slate-900 selection:text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[10%] left-[10%] w-[40vw] h-[40vw] ${themeColors.cosmic.background} rounded-full blur-[120px] opacity-10 animate-pulse`} />
        <div className={`absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] ${themeColors.sunset.background} rounded-full blur-[120px] opacity-10 animate-pulse delay-700`} />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />
      </div>

      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#F8FAFC] to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#F8FAFC] to-transparent z-20 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700">
                Solusi Nyata untuk <br />
                <span className={themeColors.cosmic.primary}>
                    Masa Depan Inklusif
                </span>
            </h2>
            <p className="text-slate-500 text-base leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                Teknologi yang dirancang untuk menghilangkan batasan komunikasi di berbagai aspek kehidupan sehari-hari.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          {cases.map((item, i) => (
            <div 
              key={i} 
              className="group relative p-6 h-full rounded-[2rem] bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.05)] hover:bg-white/60 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
            >

              <div className="flex justify-between items-start mb-8">
                  <div className={`relative w-12 h-12 rounded-xl bg-[#0F172A] flex items-center justify-center shadow-lg ${item.theme.shadow} transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3`}>
                      <div className="relative z-10">
                           {item.icon}
                      </div>
                  </div>

                  <div className="p-1.5 rounded-full bg-transparent group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                    <ArrowUpRight className="text-slate-300 group-hover:text-slate-900 transition-colors" size={16} />
                  </div>
              </div>

              <div className="relative z-10">
                <h3 className={`text-lg font-bold text-slate-900 mb-2 tracking-tight transition-all duration-300 group-hover:${item.theme.primary}`}>
                  {item.title}
                </h3>
                
                <p className="text-slate-500 text-sm leading-relaxed font-medium group-hover:text-slate-600 transition-colors duration-300">
                  {item.desc}
                </p>
              </div>

              <div className={`absolute bottom-0 left-0 h-1 ${item.theme.background} transition-all duration-500 ease-out w-0 group-hover:w-full opacity-0 group-hover:opacity-100`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}