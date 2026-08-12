"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  MapPin,
  Wallet,
  ShoppingBag,
  ChevronRight,
  LogOut,
  Mail,
  Shield,
  Store,
} from "lucide-react";

const menuItems = [
  {
    label: "Alamat Saya",
    href: "/alamat",
    icon: MapPin,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    label: "Dompet",
    href: "/wallet",
    icon: Wallet,
    color: "text-indigo-600 bg-indigo-50",
  },
  {
    label: "Pesanan Saya",
    href: "/pesanan",
    icon: ShoppingBag,
    color: "text-orange-600 bg-orange-50",
  },
  {
    label: "Mitra Dashboard",
    href: "/mitra",
    icon: Store,
    color: "text-sky-600 bg-sky-50",
  },
  {
    label: "Keamanan Akun",
    href: "#",
    icon: Shield,
    color: "text-rose-600 bg-rose-50",
  },
];

export default function ProfilPage() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const userEmail = user?.email ?? "Memuat...";
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || userEmail.split("@")[0];

  return (
    <div className="min-h-screen bg-slate-50/70 pb-24">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-4 pt-12 pb-14 text-white">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md ring-2 ring-white/30 shadow-lg">
            <User className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold truncate">{userName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Mail className="h-3.5 w-3.5 text-orange-200" />
              <p className="text-xs text-orange-100 truncate">{userEmail}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Menu */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 space-y-3">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden divide-y divide-slate-100">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <span className="flex-1 text-sm font-semibold text-slate-800">
                {item.label}
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-3.5 text-sm font-bold text-red-600 shadow-sm transition hover:bg-red-100"
        >
          <LogOut className="h-4 w-4" />
          Keluar dari Akun
        </button>

        <p className="text-center text-[11px] text-slate-400 pt-2">
          WarungKita v0.1.0 — © 2025
        </p>
      </div>
    </div>
  );
}
