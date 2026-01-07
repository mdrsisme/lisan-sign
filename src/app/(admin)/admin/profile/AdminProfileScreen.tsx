"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  User as UserIcon, 
  Mail, 
  AtSign, 
  Camera, 
  Save, 
  Calendar,
  Loader2,
  Crown,
  Zap,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Edit3,
  Sparkles // Used in background decoration or can be added as needed
} from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import PageHeader from "@/components/ui/PageHeader"; // Import PageHeader

type AppRole = "admin" | "user";

interface UserType {
  id: string;
  full_name: string;
  username: string | null;
  email: string;
  avatar_url: string | null;
  is_verified: boolean;
  is_premium: boolean;
  role: AppRole;
  xp: number;
  level: number;
  created_at: string;
  updated_at: string;
}

interface Props {
  user: UserType;
}

export default function AdminProfileScreen({ user }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar_url);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    full_name: user.full_name,
    username: user.username || "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload = new FormData();
      payload.append("full_name", formData.full_name);
      payload.append("username", formData.username);
      if (avatarFile) {
        payload.append("avatar", avatarFile);
      }

      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        body: payload,
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "Gagal memperbarui profil");

      setMessage({ text: "Profil berhasil diperbarui!", type: "success" });
      router.refresh();
      
    } catch (error: any) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex overflow-hidden selection:bg-indigo-100 selection:text-indigo-700">
      
      <AdminSidebar />

      <main className="flex-1 md:ml-[280px] w-full h-screen overflow-y-auto no-scrollbar relative">
        
        {/* Background Decor */}
        <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none z-0"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-[100px] z-0"></div>
        
        <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto pb-24">
            
            {/* --- PAGE HEADER INTEGRATION --- */}
            <div className="mb-8">
                <PageHeader
                    title="Profile"
                    highlight="Saya"
                    description="Kelola informasi pribadi, avatar, dan preferensi akun Anda."
                    badge="ACCOUNT"
                    icon={UserIcon}
                    gradientClass="from-pink-500 via-rose-500 to-red-500" // Pink/Rose Theme
                    glowClass="bg-pink-500/20"
                />
            </div>

            {/* --- NOTIFICATIONS --- */}
            {message && (
                <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 shadow-lg shadow-slate-200/50 border backdrop-blur-sm animate-in slide-in-from-top-2 duration-300 ${
                    message.type === 'success' ? 'bg-emerald-50/80 text-emerald-700 border-emerald-100' : 'bg-red-50/80 text-red-700 border-red-100'
                }`}>
                    <div className={`p-2 rounded-full ${message.type === 'success' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                        {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    </div>
                    <div>
                        <p className="font-bold text-sm">{message.type === 'success' ? 'Sukses' : 'Gagal'}</p>
                        <p className="text-xs opacity-90">{message.text}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* --- LEFT COLUMN (Profile Card & Stats) --- */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* 1. MAIN IDENTITY CARD */}
                    <div className="relative bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden group">
                        
                        {/* Abstract Background Header */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500">
                             <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                             <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
                             <div className="absolute bottom-0 left-0 w-full h-px bg-white/20"></div>
                        </div>

                        {/* Avatar Wrapper */}
                        <div className="relative mt-12 mb-4 flex justify-center">
                            <div className="relative h-32 w-32 rounded-full p-1.5 bg-white shadow-2xl shadow-indigo-500/20">
                                <div className="relative h-full w-full rounded-full overflow-hidden bg-slate-100">
                                    {avatarPreview ? (
                                        <Image src={avatarPreview} alt="Avatar" fill className="object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-indigo-50 text-indigo-500 font-black text-4xl">
                                            {formData.full_name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    
                                    {/* Upload Overlay */}
                                    <label className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer text-white backdrop-blur-[2px]">
                                        <Camera size={24} className="mb-1" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Ubah</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                </div>

                                {/* Premium Badge */}
                                {user.is_premium && (
                                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-amber-300 to-orange-400 text-white p-2 rounded-full ring-4 ring-white shadow-lg" title="Premium Member">
                                        <Crown size={16} className="fill-white" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Text Info */}
                        <div className="text-center space-y-1 mb-6">
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{formData.full_name}</h2>
                            <p className="text-slate-400 font-medium text-sm flex items-center justify-center gap-1">
                                @{formData.username || 'username'} 
                                {user.is_verified && <CheckCircle2 size={14} className="text-blue-500 fill-blue-500" />}
                            </p>
                        </div>

                        {/* Badges / Chips */}
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wide border border-slate-200">
                                {user.role === 'admin' ? 'Super Admin' : 'Member'}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wide border border-indigo-100">
                                {user.is_premium ? 'Pro Plan' : 'Free Plan'}
                            </span>
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-slate-100 mb-6"></div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                             <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100 group/stat hover:bg-white hover:shadow-lg hover:shadow-indigo-500/10 transition-all">
                                 <p className="text-xs text-slate-400 font-bold uppercase mb-1">Total XP</p>
                                 <p className="text-lg font-black text-slate-800 flex items-center justify-center gap-1 group-hover/stat:text-indigo-600 transition-colors">
                                    <Zap size={14} className="text-amber-500 fill-amber-500" />
                                    {user.xp}
                                 </p>
                             </div>
                             <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100 group/stat hover:bg-white hover:shadow-lg hover:shadow-purple-500/10 transition-all">
                                 <p className="text-xs text-slate-400 font-bold uppercase mb-1">Level</p>
                                 <p className="text-lg font-black text-slate-800 flex items-center justify-center gap-1 group-hover/stat:text-purple-600 transition-colors">
                                    <Trophy size={14} className="text-purple-500 fill-purple-500" />
                                    {user.level}
                                 </p>
                             </div>
                        </div>
                    </div>

                    {/* 2. PROGRESS CARD */}
                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2rem] p-6 shadow-xl text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-40"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full blur-[60px] opacity-40"></div>
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg">Level Progress</h3>
                                <span className="bg-white/10 px-2 py-1 rounded-lg text-xs font-mono">{user.xp} / 5000 XP</span>
                            </div>
                            
                            <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden ring-1 ring-white/10 mb-4">
                                <div className="h-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 w-[65%] shadow-[0_0_15px_rgba(99,102,241,0.5)] relative overflow-hidden">
                                     <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_2s_infinite] skew-x-12 translate-x-[-100%]"></div>
                                </div>
                            </div>

                            <p className="text-sm text-slate-400 leading-relaxed">
                                Hebat! Kamu hanya butuh <span className="text-white font-bold">1,240 XP</span> lagi untuk mencapai Level {user.level + 1}. Terus belajar! 🚀
                            </p>
                        </div>
                    </div>

                </div>

                {/* --- RIGHT COLUMN (Edit Form) --- */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 h-full relative overflow-hidden">
                        
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                        <div className="flex items-center justify-between mb-8">
                             <div>
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <Edit3 size={20} className="text-indigo-500" />
                                    Edit Informasi
                                </h2>
                                <p className="text-slate-400 text-sm mt-1">Perbarui informasi data diri Anda disini.</p>
                             </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nama Lengkap</label>
                                        <div className="relative group/input">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <UserIcon className="h-5 w-5 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors" />
                                            </div>
                                            <input 
                                                type="text"
                                                value={formData.full_name}
                                                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                                className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold"
                                                placeholder="Nama Lengkap Anda"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Username</label>
                                        <div className="relative group/input">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <AtSign className="h-5 w-5 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors" />
                                            </div>
                                            <input 
                                                type="text"
                                                value={formData.username}
                                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                                className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold"
                                                placeholder="username"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center justify-between">
                                            Email Address
                                            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-400">Read-Only</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <input 
                                                type="email"
                                                value={user.email}
                                                disabled
                                                className="block w-full pl-11 pr-4 py-4 bg-slate-100/50 border border-slate-200 rounded-2xl text-slate-500 font-medium cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center justify-between">
                                            Bergabung Sejak
                                            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-400">Read-Only</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Calendar className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <input 
                                                type="text"
                                                value={new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                disabled
                                                className="block w-full pl-11 pr-4 py-4 bg-slate-100/50 border border-slate-200 rounded-2xl text-slate-500 font-medium cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 flex items-center justify-end gap-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    className="px-6 py-3.5 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                                    onClick={() => router.back()}
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="relative group overflow-hidden px-8 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-xl shadow-slate-900/20 hover:shadow-slate-900/40 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <span className="relative flex items-center gap-2">
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                        {loading ? "Menyimpan..." : "Simpan Perubahan"}
                                    </span>
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
            
        </div>
      </main>
    </div>
  );
}