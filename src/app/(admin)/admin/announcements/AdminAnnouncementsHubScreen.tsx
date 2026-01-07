"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Megaphone, 
  Plus, 
  List, 
  Eye, 
  Globe, 
  Lock, 
  Loader2, 
  ArrowRight,
  BarChart3
} from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import PageHeader from "@/components/ui/PageHeader";
import { AnnouncementStats } from "@/types/announcement";

export default function AdminAnnouncementsHubScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<AnnouncementStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/announcements/stats");
        const json = await res.json();
        if (json.success) {
          setStats(json.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Pengumuman",
      value: stats?.total || 0,
      icon: Megaphone,
      color: "blue",
      desc: "Semua pengumuman dibuat"
    },
    {
      title: "Publik",
      value: stats?.public_count || 0,
      icon: Globe,
      color: "emerald",
      desc: "Dapat dilihat semua user"
    },
    {
      title: "Private / Draft",
      value: stats?.private_count || 0,
      icon: Lock,
      color: "slate",
      desc: "Hanya internal admin"
    }
  ];

  const getColorClass = (color: string) => {
    switch(color) {
      case 'blue': return 'bg-blue-50 text-blue-600';
      case 'emerald': return 'bg-emerald-50 text-emerald-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-blue-100 selection:text-blue-900">
      <AdminSidebar />
      <main className="flex-1 md:ml-[280px] p-4 md:p-8 overflow-hidden">
        <div className="mb-8">
          <PageHeader
            title="Pengumuman"
            highlight="Hub"
            description="Pusat kontrol informasi dan berita untuk pengguna platform."
            badge="COMMUNICATION"
            icon={Megaphone}
            gradientClass="from-blue-600 via-indigo-500 to-violet-500"
            glowClass="bg-blue-500/20"
          />
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-2xl ${getColorClass(card.color)}`}>
                        <Icon size={24} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{card.title}</h3>
                      <p className="text-3xl font-black text-slate-900 leading-none">{card.value}</p>
                      <p className="text-xs text-slate-400 mt-2 font-medium">{card.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={() => router.push("/admin/announcements/create")}
                className="group relative overflow-hidden bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 text-left hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 group-hover:text-white transition-colors">
                    <Plus size={24} strokeWidth={3} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-white mb-2 transition-colors">Buat Pengumuman Baru</h3>
                  <p className="text-slate-500 group-hover:text-blue-100 text-sm font-medium transition-colors">Publikasikan informasi terbaru, update sistem, atau berita penting.</p>
                </div>
              </button>

              <button 
                onClick={() => router.push("/admin/announcements/list")}
                className="group relative overflow-hidden bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 text-left hover:shadow-2xl hover:shadow-slate-500/10 transition-all duration-300"
              >
                 <div className="absolute inset-0 bg-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                 <div className="relative z-10">
                  <div className="h-12 w-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 group-hover:text-white transition-colors">
                    <List size={24} strokeWidth={3} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-white mb-2 transition-colors">Kelola Daftar Pengumuman</h3>
                  <p className="text-slate-500 group-hover:text-slate-300 text-sm font-medium transition-colors">Lihat, edit, atau hapus pengumuman yang sudah ada.</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}