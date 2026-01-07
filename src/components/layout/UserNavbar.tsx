"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Bell, 
  ChevronDown, 
  Crown, 
  LogOut, 
  Repeat, 
  Settings, 
  User as UserIcon,
  Menu
} from "lucide-react";
import { User } from "@/types/user"; // Asumsi tipe user ada disini
import SelectWorkspaceModal from "@/components/dashboard/SelectWorkspaceModal";

interface UserNavbarProps {
  user: User;
}

export default function UserNavbar({ user }: UserNavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* LOGO (HOME LINK) */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-lg group-hover:rotate-6 transition-transform">
            B
          </div>
          <span className="font-bold text-slate-800 text-lg tracking-tight group-hover:text-indigo-600 transition-colors">
            Belajar<span className="text-indigo-600">Isyarat</span>
          </span>
        </Link>

        {/* RIGHT SIDE ACTIONS */}
        <div className="flex items-center gap-3 md:gap-6">
          
          {/* Notification Icon (Decoration) */}
          <button className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
          </button>

          {/* PROFILE DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 p-1 pl-2 pr-1 rounded-full border border-slate-200 bg-white hover:shadow-md transition-all active:scale-95"
            >
              {/* User Info (Desktop) */}
              <div className="hidden md:block text-right mr-1">
                <p className="text-xs font-bold text-slate-700 truncate max-w-[100px]">
                  {user.full_name}
                </p>
                <p className="text-[10px] font-medium text-slate-400">
                  Lv. {user.level}
                </p>
              </div>

              {/* Avatar */}
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="avatar" className="h-full w-full rounded-full object-cover" />
                ) : (
                  user.full_name?.charAt(0) || "U"
                )}
              </div>
              
              <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* DROPDOWN MENU */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animation-fade-in-up">
                
                {/* Header Dropdown */}
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                       {user.full_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">{user.full_name}</p>
                      <p className="text-xs text-slate-500">@{user.username || 'username'}</p>
                    </div>
                  </div>

                  {/* PREMIUM BADGE */}
                  {user.is_premium ? (
                    <div className="mt-3 flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-200">
                      <Crown size={14} className="fill-amber-500 text-amber-600" />
                      Premium Member
                    </div>
                  ) : (
                    <Link href="/upgrade" className="mt-3 flex items-center justify-between bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-600 transition-colors">
                      <span>Upgrade Premium</span>
                      <Crown size={12} />
                    </Link>
                  )}
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                    <UserIcon size={16} />
                    Profile Saya
                  </Link>
                  <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                    <Settings size={16} />
                    Pengaturan
                  </Link>

                  {/* ADMIN ONLY: SWITCH MODE */}
                  {user.role === 'admin' && (
                    <button 
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setShowSwitchModal(true);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-indigo-600 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors my-1"
                    >
                      <Repeat size={16} />
                      Ganti Mode
                    </button>
                  )}
                </div>

                <div className="border-t border-slate-100 p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 rounded-xl hover:bg-red-50 transition-colors">
                    <LogOut size={16} />
                    Keluar Akun
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* MODAL SWITCH MODE */}
      {showSwitchModal && (
        <div className="fixed inset-0 z-[100]">
           {/* Kita reuse SelectWorkspaceModal tapi tambahkan tombol close manual jika perlu, 
               atau bungkus dengan logic overlay */}
           <div 
             className="absolute inset-0 bg-black/50 z-0" 
             onClick={() => setShowSwitchModal(false)}
           />
           <div className="relative z-10">
              <SelectWorkspaceModal userRole="admin" hasSession={true} />
           </div>
        </div>
      )}
    </>
  );
}