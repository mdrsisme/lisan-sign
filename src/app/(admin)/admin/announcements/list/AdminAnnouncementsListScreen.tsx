"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Edit3, 
  Globe, 
  Lock, 
  Calendar,
  LayoutList
} from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import PageHeader from "@/components/ui/PageHeader";
import { Announcement } from "@/types/announcement";
import { PaginatedData } from "@/types/api";

export default function AdminAnnouncementsListScreen() {
  const router = useRouter();
  const [data, setData] = useState<Announcement[]>([]);
  const [pagination, setPagination] = useState<PaginatedData<any>['pagination'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [visibility, setVisibility] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "8",
          search,
        });
        if (visibility !== "all") params.append("visibility", visibility);

        const res = await fetch(`/api/announcements?${params.toString()}`);
        const json = await res.json();
        
        if (json.success) {
          setData(json.data.items);
          setPagination(json.data.pagination);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 500);
    return () => clearTimeout(timer);
  }, [page, search, visibility]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <AdminSidebar />
      <main className="flex-1 md:ml-[280px] p-4 md:p-8 overflow-hidden">
        <div className="mb-8">
          <PageHeader
            title="Daftar Pengumuman"
            highlight="Arsip"
            description="Cari dan kelola seluruh pengumuman yang pernah dibuat."
            badge="MANAGEMENT"
            icon={LayoutList}
            gradientClass="from-slate-700 via-slate-600 to-slate-500"
            glowClass="bg-slate-500/20"
          />
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Cari judul pengumuman..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
               <Filter size={20} className="text-slate-400" />
               <select 
                 value={visibility}
                 onChange={(e) => setVisibility(e.target.value)}
                 className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-bold text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
               >
                 <option value="all">Semua Status</option>
                 <option value="public">Publik</option>
                 <option value="private">Private</option>
               </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white h-64 rounded-[2.5rem] animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {data.map((item) => (
              <div 
                key={item.id} 
                onClick={() => router.push(`/admin/announcements/${item.id}`)}
                className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full"
              >
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                      <LayoutList size={40} />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${
                      item.is_public ? 'bg-emerald-500/90 text-white' : 'bg-slate-500/90 text-white'
                    }`}>
                      {item.is_public ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                      <Calendar size={14} />
                      {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </div>
                    <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <Edit3 size={14} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination && pagination.total_pages > 1 && (
          <div className="flex justify-center gap-4 py-8">
             <button
               onClick={() => setPage(p => Math.max(1, p - 1))}
               disabled={page === 1}
               className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm disabled:opacity-50 hover:bg-slate-50"
             >
               <ChevronLeft size={16} />
             </button>
             <span className="flex items-center text-sm font-bold text-slate-500">
               Hal {page} dari {pagination.total_pages}
             </span>
             <button
               onClick={() => setPage(p => Math.min(pagination.total_pages, p + 1))}
               disabled={page === pagination.total_pages}
               className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm disabled:opacity-50 hover:bg-slate-50"
             >
               <ChevronRight size={16} />
             </button>
          </div>
        )}
      </main>
    </div>
  );
}