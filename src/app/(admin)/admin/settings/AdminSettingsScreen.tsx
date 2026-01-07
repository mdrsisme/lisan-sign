"use client";

import { useState } from "react";
import { 
  Bell, 
  Lock, 
  Globe, 
  Moon, 
  Smartphone, 
  ShieldAlert,
  ChevronRight,
  Database,
  LucideIcon,
  Settings,
  ToggleLeft
} from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import PageHeader from "@/components/ui/PageHeader";

interface SettingsItem {
  label: string;
  desc: string;
  control: React.ReactNode;
  icon: LucideIcon;
  action?: boolean;
  danger?: boolean;
}

interface SettingsSection {
  title: string;
  icon: LucideIcon;
  color: string;
  items: SettingsItem[];
}

const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button 
    onClick={onChange}
    className={`relative h-7 w-12 rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-500/10
      ${checked ? 'bg-indigo-600' : 'bg-slate-200'}`}
  >
    <span 
      className={`absolute top-1 left-1 bg-white h-5 w-5 rounded-full shadow-md transition-transform duration-300 ease-in-out
        ${checked ? 'translate-x-5' : 'translate-x-0'}`}
    />
  </button>
);

export default function AdminSettingsScreen() {
  const [settings, setSettings] = useState({
    emailNotif: true,
    pushNotif: false,
    darkMode: false,
    twoFactor: true,
    publicProfile: true,
    maintenanceMode: false
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sections: SettingsSection[] = [
    {
      title: "Preferensi Umum",
      icon: Globe,
      color: "bg-blue-50 text-blue-600",
      items: [
        {
          label: "Mode Gelap",
          desc: "Aktifkan tampilan tema gelap untuk admin panel.",
          control: <ToggleSwitch checked={settings.darkMode} onChange={() => toggle('darkMode')} />,
          icon: Moon
        },
        {
          label: "Bahasa Sistem",
          desc: "Bahasa default yang digunakan pada antarmuka.",
          control: (
            <select className="bg-white border border-slate-200 text-xs font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 shadow-sm cursor-pointer hover:border-indigo-300 transition-colors">
              <option>Bahasa Indonesia</option>
              <option>English (US)</option>
            </select>
          ),
          icon: Globe
        }
      ]
    },
    {
      title: "Notifikasi",
      icon: Bell,
      color: "bg-amber-50 text-amber-600",
      items: [
        {
          label: "Email Notifikasi",
          desc: "Terima laporan mingguan dan alert sistem via email.",
          control: <ToggleSwitch checked={settings.emailNotif} onChange={() => toggle('emailNotif')} />,
          icon: Bell
        },
        {
          label: "Push Notification",
          desc: "Notifikasi browser saat ada pengguna baru mendaftar.",
          control: <ToggleSwitch checked={settings.pushNotif} onChange={() => toggle('pushNotif')} />,
          icon: Smartphone
        }
      ]
    },
    {
      title: "Keamanan",
      icon: Lock,
      color: "bg-emerald-50 text-emerald-600",
      items: [
        {
          label: "Autentikasi 2 Faktor (2FA)",
          desc: "Tambahan lapisan keamanan saat login.",
          control: <ToggleSwitch checked={settings.twoFactor} onChange={() => toggle('twoFactor')} />,
          icon: ShieldAlert
        },
        {
          label: "Ubah Password",
          desc: "Perbarui kata sandi akun administrator.",
          control: <ChevronRight className="text-slate-300" size={20} />,
          action: true,
          icon: Lock
        }
      ]
    },
    {
      title: "Danger Zone",
      icon: ShieldAlert,
      color: "bg-red-50 text-red-600",
      items: [
        {
          label: "Maintenance Mode",
          desc: "Matikan akses publik ke platform sementara waktu.",
          control: <ToggleSwitch checked={settings.maintenanceMode} onChange={() => toggle('maintenanceMode')} />,
          icon: Database,
          danger: true
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-slate-200 selection:text-slate-900">
      
      <AdminSidebar />

      <main className="flex-1 md:ml-[280px] p-4 md:p-8 overflow-hidden relative">
        
        {/* Page Header */}
        <div className="mb-8">
            <PageHeader
                title="Pengaturan"
                highlight="Sistem"
                description="Kelola konfigurasi global, preferensi tampilan, dan keamanan platform."
                badge="CONFIGURATION"
                icon={Settings}
                gradientClass="from-slate-600 via-gray-500 to-zinc-400"
                glowClass="bg-slate-500/20"
            />
        </div>

        <div className="max-w-5xl space-y-8 pb-20">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden relative group hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500">
              
              {/* Header Section */}
              <div className="px-8 py-6 border-b border-slate-50 bg-white relative z-10 flex items-center gap-5">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${section.color} transition-transform group-hover:scale-110 duration-500`}>
                  <section.icon size={22} strokeWidth={2.5} />
                </div>
                <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">{section.title}</h2>
                    <div className="h-1 w-12 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <div className={`h-full w-1/2 rounded-full ${section.color.split(' ')[0].replace('bg-', 'bg-')} opacity-50`}></div>
                    </div>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-50 relative z-10 bg-white">
                {section.items.map((item, i) => (
                  <div 
                    key={i} 
                    className={`px-8 py-6 flex items-center justify-between transition-all duration-300 hover:bg-slate-50/80
                        ${item.action ? 'cursor-pointer hover:pl-10 active:bg-slate-100' : ''}
                        ${item.danger ? 'hover:bg-red-50/30' : ''}
                    `}
                  >
                    <div className="flex items-start gap-5">
                      <div className={`mt-1 h-10 w-10 rounded-full flex items-center justify-center border transition-colors duration-300
                          ${item.danger 
                            ? 'bg-red-50 text-red-500 border-red-100 group-hover:bg-red-100' 
                            : 'bg-slate-50 text-slate-400 border-slate-100 group-hover:text-indigo-500 group-hover:border-indigo-100 group-hover:bg-indigo-50'
                          }
                      `}>
                        <item.icon size={18} strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className={`font-bold text-sm tracking-wide ${item.danger ? 'text-red-600' : 'text-slate-800'}`}>
                          {item.label}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium mt-1 max-w-md leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pl-4">
                      {item.control}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}