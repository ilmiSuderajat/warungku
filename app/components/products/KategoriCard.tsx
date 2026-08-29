"use client";

import { useState, useRef } from "react";
import {
  Store,
  Home,
  Flame,
  CupSoda,
  UtensilsCrossed,
  CakeSlice,
  Grid2X2,
  Road,
} from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Jastip",
    icon: Road,
    color: "text-gray-100",
    bg: "bg-indigo-600",
  },
  {
    id: 2,
    name: "Rumahan",
    icon: Home,
    color: "text-white",
    bg: "bg-emerald-600",
  },
  {
    id: 3,
    name: "Pedas",
    icon: Flame,
    color: "text-white",
    bg: "bg-red-600",
  },
  {
    id: 4,
    name: "Segar",
    icon: CupSoda,
    color: "text-white",
    bg: "bg-blue-600",
  },
  {
    id: 5,
    name: "Kenyang",
    icon: UtensilsCrossed,
    color: "text-white",
    bg: "bg-amber-600",
  },
  {
    id: 6,
    name: "Manis",
    icon: CakeSlice,
    color: "text-white",
    bg: "bg-pink-600",
  },
  {
    id: 7,
    name: "Lihat Semua",
    icon: Grid2X2,
    color: "text-white",
    bg: "bg-indigo-800",
  },
];

export default function KategoriCard() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Fungsi untuk menghitung seberapa jauh user sudah menggeser (dalam persentase 0-100)
  const handleScroll = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;

    // Mencegah error pembagian 0 jika konten muat di layar tanpa perlu scroll
    if (maxScroll <= 0) return;

    const progress = (scrollLeft / maxScroll) * 100;
    setScrollProgress(progress);
  };

  return (
    <div className="w-[96%] max-w-2xl mx-auto mt-1 bg-white rounded-xl border border-gray-100 py-3 px-3">
      {/* Container horizontal scroll */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        // Ditambahkan snap-x agar pergeseran lebih mulus dan presisi
        className="flex overflow-x-auto flex-nowrap gap-x-2 no-scrollbar scroll-smooth"
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              // Ditambahkan snap-start agar berhenti pas di elemen ini
              className="flex flex-col items-center justify-start min-w-16 gap-2 active:scale-90 transition-transform snap-start"
              onClick={() => console.log(`Filter kategori: ${cat.name}`)}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm opacity: 1; transform: none; ${cat.bg} ${cat.color}`}
              >
                <Icon size={26} strokeWidth={2} />
              </div>
              <span className=" text-slate-700 text-[10px] text-center font-medium leading-[1.1] h-7 flex items-start justify-center px-1 overflow-hidden line-clamp-2">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Indikator Garis Merah di Bawah */}
      <div className="w-16 h-1 bg-gray-100 rounded-full mx-auto mt-2 overflow-hidden">
        <div
          className="w-1/2 h-full bg-red-500 rounded-full"
          style={{
            // Menggeser garis merah sesuai dengan persentase scroll
            transform: `translateX(${scrollProgress}%)`,
          }}
        />
      </div>
    </div>
  );
}
