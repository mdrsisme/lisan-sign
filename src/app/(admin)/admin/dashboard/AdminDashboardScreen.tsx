"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  TrendingUp, 
  Crown, 
  Activity, 
  ArrowUpRight,
  Loader2,
  AlertCircle,
  LayoutDashboard,
  PieChart as PieChartIcon,
  BarChart3
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import AdminSidebar from "@/components/layout/AdminSidebar";
import PageHeader from "@/components/ui/PageHeader";
import { UserStats } from "@/types/user";

export default function AdminDashboardScreen() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/users/stats");
        const json = await res.json();
        
        if (json.success) {
          setStats(json.data);
        } else {
          setError(json.message);
        }
      } catch (err) {
        setError("Gagal memuat data statistik dari server.");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { 
      title: "Total Pengguna", 
      value: stats?.total_users.toLocaleString() || "0", 
      icon: Users,
      color: "blue",
      sub: "Semua akun terdaftar" 
    },
    { 
      title: "Pengguna Verified", 
      value: stats?.by_status.verified_users.toLocaleString() || "0", 
      icon: TrendingUp,
      color: "emerald",
      sub: `${stats?.by_status.unverified || 0} Belum verifikasi`
    },
    { 
      title: "Member Premium", 
      value: stats?.by_status.premium_users.toLocaleString() || "0", 
      icon: Crown,
      color: "amber",
      sub: "Akses fitur berbayar"
    },
    { 
      title: "Akun Administrator", 
      value: stats?.by_role.admin.toLocaleString() || "0", 
      icon: Activity,
      color: "rose",
      sub: "Pengelola sistem"
    },
  ];

  const getColorClass = (color: string) => {
    switch(color) {
      case 'blue': return 'bg-blue-50 text-blue-600 ring-blue-100';
      case 'emerald': return 'bg-emerald-50 text-emerald-600 ring-emerald-100';
      case 'amber': return 'bg-amber-50 text-amber-600 ring-amber-100';
      case 'rose': return 'bg-rose-50 text-rose-600 ring-rose-100';
      default: return 'bg-slate-50 text-slate-600 ring-slate-100';
    }
  };

  const pieData = stats ? [
    { name: 'Regular User', value: stats.by_role.user },
    { name: 'Administrator', value: stats.by_role.admin },
  ] : [];

  const barData = stats ? [
    { name: 'Verified', value: stats.by_status.verified_users },
    { name: 'Unverified', value: stats.by_status.unverified },
    { name: 'Premium', value: stats.by_status.premium_users },
  ] : [];

  const PIE_COLORS = ['#6366f1', '#f43f5e']; 
  const BAR_COLORS = ['#10b981', '#94a3b8', '#f59e0b'];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      <AdminSidebar />

      <main className="flex-1 md:ml-[280px] p-4 md:p-8 overflow-hidden">
        
        <div className="mb-8">
            <PageHeader
                title="Dashboard"
                highlight="Overview"
                description="Pantau statistik pengguna, status sistem, dan aktivitas platform LisanAI secara real-time."
                badge="MONITORING"
                icon={LayoutDashboard}
                gradientClass="from-indigo-600 via-blue-500 to-cyan-400"
                glowClass="bg-indigo-500/20"
            />
        </div>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-4 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 animate-pulse">
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse"></div>
                <Loader2 className="relative z-10 animate-spin text-indigo-600" size={48} />
            </div>
            <p className="font-bold text-slate-400 tracking-wide text-sm">SINKRONISASI DATA...</p>
          </div>
        ) : error ? (
          <div className="p-8 bg-red-50 border border-red-100 rounded-[2rem] flex items-center gap-4 text-red-600 shadow-lg shadow-red-100/50">
            <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle size={24} />
            </div>
            <div>
                <p className="font-black text-lg">Gagal Memuat Data</p>
                <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-2xl ring-1 transition-transform group-hover:scale-110 duration-500 ${getColorClass(stat.color)}`}>
                            <Icon size={24} />
                        </div>
                        <span className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                            Live
                        </span>
                        </div>
                        <div>
                        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.title}</h3>
                        <p className="text-3xl font-black text-slate-900 leading-none tracking-tight">{stat.value}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-3 flex items-center gap-1">
                            <ArrowUpRight size={12} className="text-emerald-500" />
                            {stat.sub}
                        </p>
                        </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 h-[400px] flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                       <PieChartIcon size={20} className="text-indigo-500"/>
                       Distribusi Role
                    </h2>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">User vs Admin Ratio</p>
                  </div>
                </div>
                
                <div className="flex-1 w-full h-full min-h-0">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} strokeWidth={0} />
                          ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Legend 
                            verticalAlign="bottom" 
                            height={36} 
                            iconType="circle"
                            formatter={(value) => <span className="text-xs font-bold text-slate-600 ml-1">{value}</span>}
                        />
                      </PieChart>
                   </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 h-[400px] flex flex-col">
                 <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                       <BarChart3 size={20} className="text-emerald-500"/>
                       Status Akun
                    </h2>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Verified vs Premium Stats</p>
                  </div>
                </div>

                <div className="flex-1 w-full h-full min-h-0">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} 
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} 
                        />
                        <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                          {barData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                   </ResponsiveContainer>
                </div>
              </div>

            </div>
          </>
        )}
      </main>
    </div>
  );
}