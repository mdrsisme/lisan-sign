"use client";

import { useState, useEffect } from "react";
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
  Edit2,
  Trash2,
  AlertCircle
} from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import PageHeader from "@/components/ui/PageHeader";

interface Props {
  id: string;
}

export default function AdminAnnouncementsDetailScreen({ id }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
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

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`/api/announcements/${id}`);
        const json = await res.json();
        if (json.success) {
          const item = json.data;
          setFormData({
            title: item.title,
            content: item.content,
            is_public: item.is_public
          });
          setPreviews({
            image: item.image_url,
            banner: item.banner_url
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setFetching(false);
      }
    }
    fetchDetail();
  }, [id]);

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

      const res = await fetch(`/api/announcements/${id}`, {
        method: "PATCH",
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

  const handleDelete = async () => {
    if(!confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) return;
    setLoading(true);
    try {
        const res = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
        if(res.ok) router.push("/admin/announcements/list");
    } catch(e) {
        console.error(e);
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <AdminSidebar />
      <main className="flex-1 md:ml-[280px] p-4 md:p-8 overflow-hidden">
        <div className="mb-8">
          <PageHeader
            title="Edit Pengumuman"
            highlight="Detail"
            description="Perbarui informasi atau hapus pengumuman."
            badge="EDITOR"
            icon={Edit2}
            gradientClass="from-orange-500 via-amber-500 to-yellow-500"
            glowClass="bg-orange-500/20"
          />
        </div>

        {fetching ? (
            <div className="h-96 flex flex-col items-center justify-center gap-4 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                <Loader2 className="animate-spin text-orange-500" size={48} />
                <p className="font-bold text-slate-400 text-sm">MEMUAT DATA...</p>
            </div>
        ) : (
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
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        placeholder="Judul pengumuman..."
                    />
                    </div>
                    
                    <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Konten Detail</label>
                    <textarea 
                        required
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        className="w-full h-64 px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                        placeholder="Detail konten..."
                    />
                    </div>
                </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Video size={20} className="text-orange-500"/> Media Tambahan
                </h3>
                <div>
                    <label className="block w-full cursor-pointer group">
                        <div className="flex items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 group-hover:bg-slate-100 transition-all">
                        <div className="flex items-center gap-3 text-slate-400">
                            <Upload size={20} />
                            <span className="text-sm font-bold">{files.video ? files.video.name : "Ganti Video (Opsional)"}</span>
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
                        formData.is_public ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
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
                    <ImageIcon size={20} className="text-orange-500"/> Thumbnail & Banner
                    </h3>
                    <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Thumbnail</label>
                        <label className="block w-full aspect-square cursor-pointer group relative overflow-hidden rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 hover:border-orange-300 transition-all">
                            {previews.image ? (
                            <Image src={previews.image} alt="Preview" fill className="object-cover" />
                            ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-orange-500">
                                <Upload size={24} className="mb-2" />
                                <span className="text-xs font-bold">Upload Image</span>
                            </div>
                            )}
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} />
                        </label>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Banner</label>
                        <label className="block w-full h-32 cursor-pointer group relative overflow-hidden rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 hover:border-orange-300 transition-all">
                            {previews.banner ? (
                            <Image src={previews.banner} alt="Banner" fill className="object-cover" />
                            ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-orange-500">
                                <Upload size={24} className="mb-2" />
                                <span className="text-xs font-bold">Upload Banner</span>
                            </div>
                            )}
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />
                        </label>
                    </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-4 flex-col">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/30 hover:bg-orange-700 hover:shadow-orange-500/50 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {loading ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="w-full py-4 rounded-xl bg-red-50 text-red-600 border border-red-100 font-bold text-sm hover:bg-red-100 hover:text-red-700 transition-all flex items-center justify-center gap-2"
                    >
                        <Trash2 size={18} /> Hapus Pengumuman
                    </button>

                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="w-full py-3 rounded-xl text-slate-500 font-bold text-sm hover:bg-slate-50 transition-colors"
                    >
                    Batal
                    </button>
                </div>
            </div>
            </form>
        )}
      </main>
    </div>
  );
}