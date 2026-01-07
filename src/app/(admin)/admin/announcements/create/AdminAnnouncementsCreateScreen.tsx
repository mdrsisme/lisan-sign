"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ArrowLeft, 
  Upload, 
  Save, 
  Loader2, 
  Globe, 
  Lock, 
  Image as ImageIcon,
  Video,
  PenTool
} from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import PageHeader from "@/components/ui/PageHeader";

export default function AdminAnnouncementsCreateScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    is_public: true
  });
  
  const [files, setFiles] = useState<{
    image: File | null;
    banner: File | null;
    video: File | null;
  }>({ image: null, banner: null, video: null });

  const [previews, setPreviews] = useState<{
    image: string | null;
    banner: string | null;
  }>({ image: null, banner: null });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'banner' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
      if (type !== 'video') {
        const url = URL.createObjectURL(file);
        setPreviews(prev => ({ ...prev, [type]: url }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("content", formData.content);
      payload.append("is_public", String(formData.is_public));
      
      if (files.image) payload.append("image", files.image);
      if (files.banner) payload.append("banner", files.banner);
      if (files.video) payload.append("video", files.video);

      const res = await fetch("/api/announcements", {
        method: "POST",
        body: payload
      });

      if (res.ok) {
        router.push("/admin/announcements/list");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <AdminSidebar />
      <main className="flex-1 md:ml-[280px] p-4 md:p-8 overflow-hidden">
        <div className="mb-8">
          <PageHeader
            title="Buat Pengumuman"
            highlight="Baru"
            description="Tambahkan konten baru untuk diinformasikan kepada pengguna."
            badge="CREATOR"
            icon={PenTool}
            gradientClass="from-indigo-600 via-violet-600 to-purple-600"
            glowClass="bg-indigo-500/20"
          />
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
               <div className="space-y-6">
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Judul Pengumuman</label>
                   <input 
                     type="text" 
                     required
                     value={formData.title}
                     onChange={(e) => setFormData({...formData, title: e.target.value})}
                     className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                     placeholder="Contoh: Pembaruan Sistem V2.0"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Konten Detail</label>
                   <textarea 
                     required
                     value={formData.content}
                     onChange={(e) => setFormData({...formData, content: e.target.value})}
                     className="w-full h-64 px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                     placeholder="Tulis detail pengumuman disini..."
                   />
                 </div>
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Video size={20} className="text-indigo-500"/> Media Tambahan
              </h3>
              <div>
                 <label className="block w-full cursor-pointer group">
                    <div className="flex items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 group-hover:bg-slate-100 transition-all">
                       <div className="flex items-center gap-3 text-slate-400">
                          <Upload size={20} />
                          <span className="text-sm font-bold">{files.video ? files.video.name : "Upload Video (Opsional)"}</span>
                       </div>
                    </div>
                    <input type="file" className="hidden" accept="video/*" onChange={(e) => handleFileChange(e, 'video')} />
                 </label>
              </div>
            </div>
          </div>

          <div className="space-y-6">
             <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
                <h3 className="font-bold text-slate-800 mb-6">Visibilitas</h3>
                <div className="flex gap-2 p-1.5 bg-slate-100 rounded-xl">
                   <button
                     type="button"
                     onClick={() => setFormData({...formData, is_public: true})}
                     className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                       formData.is_public ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                     }`}
                   >
                     <Globe size={16} /> Publik
                   </button>
                   <button
                     type="button"
                     onClick={() => setFormData({...formData, is_public: false})}
                     className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                       !formData.is_public ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                     }`}
                   >
                     <Lock size={16} /> Private
                   </button>
                </div>
             </div>

             <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                   <ImageIcon size={20} className="text-indigo-500"/> Thumbnail & Banner
                </h3>
                <div className="space-y-4">
                   <div>
                      <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Thumbnail (Square)</label>
                      <label className="block w-full aspect-square cursor-pointer group relative overflow-hidden rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 hover:border-indigo-300 transition-all">
                        {previews.image ? (
                           <Image src={previews.image} alt="Preview" fill className="object-cover" />
                        ) : (
                           <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-indigo-500">
                              <Upload size={24} className="mb-2" />
                              <span className="text-xs font-bold">Upload Image</span>
                           </div>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} />
                      </label>
                   </div>

                   <div>
                      <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Banner (Landscape)</label>
                      <label className="block w-full h-32 cursor-pointer group relative overflow-hidden rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 hover:border-indigo-300 transition-all">
                        {previews.banner ? (
                           <Image src={previews.banner} alt="Banner" fill className="object-cover" />
                        ) : (
                           <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-indigo-500">
                              <Upload size={24} className="mb-2" />
                              <span className="text-xs font-bold">Upload Banner</span>
                           </div>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />
                      </label>
                   </div>
                </div>
             </div>

             <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 py-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-4 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {loading ? "Menyimpan..." : "Publikasikan"}
                </button>
             </div>
          </div>
        </form>
      </main>
    </div>
  );
}