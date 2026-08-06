"use client";

import { useState, useEffect } from "react";
import {
  ChatBubbleLeftEllipsisIcon,
  ShoppingCartIcon,
  ChevronLeftIcon,
  // MagnifyingGlassIcon (Bisa diimport jika butuh ikon kaca pembesar di search)
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function SearchBar({ totalItem = 0 }: { totalItem?: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const isProductPage = pathname?.startsWith("/produk/");

  // --- STATE UNTUK SCROLL BEHAVIOR ---
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Jika scroll ke bawah dan sudah melewati 50px, sembunyikan navbar
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      }
      // Jika scroll ke atas, tampilkan navbar
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // --- TAMPILAN KHUSUS HALAMAN DETAIL PRODUK (/produk/[slug]) ---
  if (isProductPage) {
    return (
      // Wrapper luar untuk Animasi & Posisi Fixed
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Background transparan dengan efek blur (Glassmorphism) */}
        <div className="bg-gray-50/60 backdrop-blur-md border-b border-gray-200/50 shadow-sm w-full">
          {/* Container konten (menjaga layout di HP dan Desktop) */}
          <div className="p-3 md:p-4 flex items-center gap-3 justify-between max-w-md mx-auto md:max-w-[80%]">
            {/* Tombol Back */}
            <button
              onClick={() => router.back()}
              className="w-10 h-10 shrink-0 bg-white  rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all border border-gray-100"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>

            {/* Input Search (Otomatis mengisi ruang kosong di tengah) */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari jajanan lain..."
                className="w-full h-10 bg-white border border-gray-100 rounded-full px-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
              />
            </div>

            {/* Tombol Chat & Keranjang */}
            <div className="flex gap-2 shrink-0">
              <Link
                href="/chat"
                className="relative w-10 h-10 bg-white  rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all border border-gray-100"
              >
                <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  0
                </span>
              </Link>
              <Link
                href="/keranjang"
                className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all border border-gray-100"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItem}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-20 grid grid-rows-3 md:grid-rows-4 md:w-[80%] md:mx-auto">
      <div className="h-[8dvh] px-3 py-2 row-span-1 flex items-center justify-center bg-indigo-800 ">
        <h1 className="text-white font-bold text-3xl hidden md:block mr-8 font-['Sacramento']">
          WarungKita
        </h1>
        <input
          className="bg-white w-[80%] h-[70%] text-center shadow-lg rounded-sm text-gray-800 placeholder:text-indigo-300 border-none focus:outline-none md:w-[60%] md:h-[70%]"
          type="text"
          placeholder="Cari Apakih ..?"
        />
        <div className="relative inline-block ml-3 md:ml-4">
          <Link href="/chat">
            <ChatBubbleLeftEllipsisIcon className="w-8 h-8 text-white transition-transform duration-100 ease-in-out active:scale-95" />
          </Link>
          <p
            id="countChat"
            className="absolute -top-1 -right-1 bg-white text-indigo-700 text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center md:h-5 md:w-5 md:text-sm md:-top-2 md:right-0.5"
          >
            0
          </p>
        </div>
        <div className="relative inline-block ml-2 md:ml-4 ">
          <Link href="/keranjang">
            <ShoppingCartIcon className="w-8 h-8 text-white transition-transform duration-100 ease-in-out active:scale-95" />
          </Link>
          <p
            id="count"
            className="absolute -top-1 -right-1 bg-white text-indigo-700 text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center md:h-5 md:w-5 md:text-sm md:-top-2 md:right-0.5"
          >
            {totalItem}
          </p>
        </div>
      </div>
    </div>
  );
}
