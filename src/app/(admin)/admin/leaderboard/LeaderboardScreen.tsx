"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { 
  Trophy, 
  Crown, 
  Medal, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Loader2,
  AlertCircle
} from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import PageHeader from "@/components/ui/PageHeader";
import { LeaderboardItem, PaginationMeta } from "@/types/leaderboard";

export default function LeaderboardScreen() {
  const [data, setData] = useState<LeaderboardItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchLeaderboard = async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/leaderboard?page=${pageNum}&limit=10`);
      const json = await res.json();

      if (json.success) {
        setData(json.data.items);
        setPagination(json.data.pagination);
      } else {
        setError(json.message);
      }
    } catch (err) {
      setError("Gagal memuat data leaderboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(page);
  }, [page]);

  const topThree = data.slice(0, 3);
  const restUsers = data.slice(3);

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-b from-yellow-300 to-amber-500 border-amber-400 shadow-amber-500/50";
      case 2: return "bg-gradient-to-b from-slate-300 to-slate-400 border-slate-400 shadow-slate-500/50";
      case 3: return "bg-gradient-to-b from-orange-300 to-orange-500 border-orange-400 shadow-orange-500/50";
      default: return "bg-white border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-amber-100 selection:text-amber-900 overflow-hidden relative">
      
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-amber-200/30 rounded-full blur-[120px] mix-blend-multiply animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[100px] mix-blend-multiply"></div>
      </div>

      <AdminSidebar />

      <main className="flex-1 md:ml-[280px] p-4 md:p-8 overflow-y-auto h-screen relative z-10 no-scrollbar">
        
        <div className="mb-8">
            <PageHeader
                title="Leaderboard"
                highlight="Global"
                description="Peringkat pengguna berdasarkan perolehan XP dan aktivitas belajar."
                badge="RANKING"
                icon={Trophy}
                gradientClass="from-amber-500 via-orange-500 to-yellow-500"
                glowClass="bg-amber-500/20"
            />
        </div>

        {loading && page === 1 ? (
          <div className="h-96 flex flex-col items-center justify-center gap-4 bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
             <Loader2 className="animate-spin text-amber-500" size={48} />
             <p className="font-bold text-slate-400 tracking-wide text-sm">MEMUAT PERINGKAT...</p>
          </div>
        ) : error ? (
          <div className="p-8 bg-red-50 border border-red-100 rounded-[2rem] flex items-center gap-4 text-red-600">
             <AlertCircle size={24} />
             <p className="font-bold">{error}</p>
          </div>
        ) : (
          <div className="space-y-8 pb-20">
            
            {page === 1 && topThree.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-12 px-4">
                
                {topThree[1] && (
                  <div className="order-2 md:order-1 flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-100">
                    <div className="relative">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-slate-300 overflow-hidden shadow-xl bg-slate-200">
                        {topThree[1].avatar_url ? (
                          <Image src={topThree[1].avatar_url} alt={topThree[1].username} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-300 text-slate-600 font-black text-2xl">
                            {topThree[1].username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white">
                        #2
                      </div>
                    </div>
                    <div className="mt-6 text-center">
                      <h3 className="font-bold text-slate-800 text-lg truncate max-w-[150px]">{topThree[1].full_name}</h3>
                      <p className="text-slate-500 text-xs font-mono">@{topThree[1].username}</p>
                      <div className="mt-2 inline-flex items-center gap-1 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
                        <span className="font-black text-slate-700">{topThree[1].xp.toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-slate-400">XP</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="order-1 md:order-2 flex flex-col items-center animate-in slide-in-from-bottom-12 duration-700">
                  <div className="relative">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-amber-500 animate-bounce">
                      <Crown size={40} fill="currentColor" />
                    </div>
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-amber-400 overflow-hidden shadow-2xl shadow-amber-500/30 bg-amber-100">
                      {topThree[0].avatar_url ? (
                        <Image src={topThree[0].avatar_url} alt={topThree[0].username} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-amber-200 text-amber-700 font-black text-4xl">
                          {topThree[0].username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-sm font-black px-4 py-1.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1">
                      <Trophy size={14} fill="currentColor" /> #1
                    </div>
                  </div>
                  <div className="mt-8 text-center">
                    <h3 className="font-black text-slate-900 text-xl truncate max-w-[180px]">{topThree[0].full_name}</h3>
                    <p className="text-amber-600 font-medium text-sm">@{topThree[0].username}</p>
                    <div className="mt-3 inline-flex items-center gap-1 bg-amber-50 px-4 py-1.5 rounded-xl border border-amber-100 shadow-sm">
                      <span className="font-black text-amber-600 text-lg">{topThree[0].xp.toLocaleString()}</span>
                      <span className="text-xs font-bold text-amber-400">XP</span>
                    </div>
                  </div>
                </div>

                {topThree[2] && (
                  <div className="order-3 flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-200">
                    <div className="relative">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-orange-300 overflow-hidden shadow-xl bg-orange-100">
                        {topThree[2].avatar_url ? (
                          <Image src={topThree[2].avatar_url} alt={topThree[2].username} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-orange-200 text-orange-700 font-black text-2xl">
                            {topThree[2].username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white">
                        #3
                      </div>
                    </div>
                    <div className="mt-6 text-center">
                      <h3 className="font-bold text-slate-800 text-lg truncate max-w-[150px]">{topThree[2].full_name}</h3>
                      <p className="text-slate-500 text-xs font-mono">@{topThree[2].username}</p>
                      <div className="mt-2 inline-flex items-center gap-1 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
                        <span className="font-black text-slate-700">{topThree[2].xp.toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-slate-400">XP</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-20">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <Medal size={20} className="text-slate-400" />
                  Peringkat Global
                </h3>
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                   <input 
                      type="text" 
                      placeholder="Cari pengguna..." 
                      className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-48 md:w-64"
                   />
                </div>
              </div>

              <div className="divide-y divide-slate-50">
                {(page === 1 ? restUsers : data).map((user) => (
                  <div key={user.rank} className="p-4 hover:bg-slate-50/80 transition-colors flex items-center gap-4 group">
                    <div className="w-12 text-center flex-shrink-0">
                      <span className="font-black text-slate-400 group-hover:text-slate-600">#{user.rank}</span>
                    </div>
                    
                    <div className="relative w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                       {user.avatar_url ? (
                          <Image src={user.avatar_url} alt={user.username} fill className="object-cover" />
                       ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-sm">
                             {user.username.charAt(0).toUpperCase()}
                          </div>
                       )}
                    </div>

                    <div className="flex-1 min-w-0">
                       <h4 className="font-bold text-slate-800 truncate">{user.full_name}</h4>
                       <p className="text-xs text-slate-400 font-medium truncate">@{user.username}</p>
                    </div>

                    <div className="flex items-center gap-6 pr-4">
                       <div className="text-right hidden md:block">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Level</p>
                          <p className="font-black text-slate-700">{user.level}</p>
                       </div>
                       <div className="text-right min-w-[80px]">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Total XP</p>
                          <p className="font-black text-amber-500">{user.xp.toLocaleString()}</p>
                       </div>
                    </div>
                  </div>
                ))}

                {(page === 1 ? restUsers : data).length === 0 && (
                   <div className="p-12 text-center text-slate-400">
                      <p>Tidak ada data peringkat.</p>
                   </div>
                )}
              </div>

              {pagination && pagination.total_pages > 1 && (
                <div className="p-4 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
                   <button 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-500 disabled:opacity-50 hover:bg-white hover:shadow-sm transition-all"
                   >
                      <ChevronLeft size={16} /> Sebelumnya
                   </button>
                   
                   <span className="text-xs font-bold text-slate-400">
                      Halaman {pagination.page} dari {pagination.total_pages}
                   </span>

                   <button 
                      onClick={() => setPage(p => Math.min(pagination.total_pages, p + 1))}
                      disabled={page === pagination.total_pages}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-500 disabled:opacity-50 hover:bg-white hover:shadow-sm transition-all"
                   >
                      Selanjutnya <ChevronRight size={16} />
                   </button>
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}