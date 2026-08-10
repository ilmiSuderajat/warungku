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
    name: "Jajanan Pinggir Jalan",
    icon: Road,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
  {
    id: 2,
    name: "Rumahan",
    icon: Home,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  {
    id: 3,
    name: "Pedas",
    icon: Flame,
    color: "text-red-600",
    bg: "bg-red-100",
  },
  {
    id: 4,
    name: "Segar",
    icon: CupSoda,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    id: 5,
    name: "Kenyang",
    icon: UtensilsCrossed,
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  {
    id: 6,
    name: "Manis",
    icon: CakeSlice,
    color: "text-pink-600",
    bg: "bg-pink-100",
  },
  {
    id: 7,
    name: "Lihat Semua",
    icon: Grid2X2,
    color: "text-gray-50",
    bg: "bg-indigo-400",
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
    <div className="w-[96%] max-w-2xl mx-auto mt-1 bg-white/95 rounded-xl shadow-sm border border-gray-100 py-3 px-3">
      <h2 className="text-sm font-bold text-gray-800 mb-3 px-1">
        Eksplor Jajanan
      </h2>

      {/* Container horizontal scroll */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        // Ditambahkan snap-x agar pergeseran lebih mulus dan presisi
        className="flex overflow-x-auto snap-x snap-mandatory gap-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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
                className={`w-10 h-10 rounded-full flex items-center justify-center ${cat.bg} ${cat.color}`}
              >
                <Icon size={26} strokeWidth={2} />
              </div>
              <span className="text-[11px] font-medium text-gray-700 text-center leading-tight">
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
