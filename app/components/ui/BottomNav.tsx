"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Bell, User, Package } from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Layanan",
    href: "/layanan",
    icon: LayoutGrid,
  },
  {
    label: "Pesanan",
    href: "/pesanan",
    icon: Package,
  },
  {
    label: "Profil",
    href: "/profil",
    icon: User,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  // 1. Rute yang disembunyikan HANYA JIKA URL-nya persis sama
  const exactHiddenRoutes = ["/checkout", "/login", "/mitra", "/wallet"];

  // 2. Rute yang disembunyikan jika URL DIAWALI dengan kata ini
  const dynamicHiddenRoutes = ["/alamat/", "/pesanan/"];

  const shouldHide =
    exactHiddenRoutes.includes(pathname) ||
    dynamicHiddenRoutes.some((route) => pathname.startsWith(route));

  if (shouldHide) return null;
  return (
    <>
      {/* Spacer agar konten tidak tertutup oleh bottom nav */}
      <div className="h-20 sm:h-0 bg-gray-100" />

      <nav className="fixed bottom-0 left-0 right-0 z-100 sm:hidden">
        {/* Blur backdrop & top border */}
        <div className="absolute inset-0 bg-white backdrop-blur-xl border-t border-slate-200/80" />

        <div className="relative flex items-stretch justify-around px-2 h-17">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex flex-1 flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
                  isActive
                    ? "text-indigo-600 font-bold"
                    : "text-slate-400 hover:text-indigo-600 active:text-indigo-700 font-medium"
                }`}
              >
                {/* Active indicator pill */}
                {isActive && (
                  <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-0.75 w-8 rounded-full bg-indigo-600 shadow-xs" />
                )}

                <div
                  className={`flex items-center justify-center rounded-xl transition-all duration-200 ${
                    isActive
                      ? "h-9 w-9 bg-indigo-50 text-indigo-600 shadow-inner"
                      : "h-9 w-9 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                  }`}
                >
                  <item.icon
                    className={`transition-all duration-200 ${
                      isActive
                        ? "h-5.5 w-5.5 stroke-[2.5]"
                        : "h-5 w-5 stroke-[1.8]"
                    }`}
                  />
                </div>

                <span
                  className={`text-[10px] leading-tight transition-all duration-200 ${
                    isActive ? "font-bold" : "font-medium"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Safe area for phones with notch/gesture bar */}
        <div className="bg-white/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]" />
      </nav>
    </>
  );
}
