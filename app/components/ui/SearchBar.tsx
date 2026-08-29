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
    <div className="w-full bg-indigo-800 shadow-xs sticky top-0 z-50">
      {/* Inner Container: Dibatasi lebarnya agar rapi di layar besar */}
      <div className="flex items-center gap-4 px-4 py-3 md:px-6 max-w-7xl mx-auto h-16 md:h-20">
        {/* Logo */}
        <h1 className="text-white font-bold text-3xl hidden md:block shrink-0 mr-2 font-['Sacramento']">
          WarungKita
        </h1>

        {/* Wrapper Search Bar (flex-1 agar otomatis mengisi ruang) */}
        <div className="relative flex-1 max-w-4xl">
          <input
            className="w-full bg-white px-4 py-2.5 pl-11 rounded-lg text-gray-800 text-sm md:text-base placeholder:text-gray-400 border border-transparent focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-indigo-400/30 transition-all shadow-sm"
            type="text"
            placeholder="Cari Apakih ..?"
          />
          {/* Icon Search Bawaan (SVG) ditaruh di dalam input */}
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Area Ikon Chat & Keranjang */}
        <div className="flex items-center gap-4 shrink-0 ">
          {/* Ikon Chat */}
          <div className="relative inline-block">
            <Link href="/chat">
              <ChatBubbleLeftEllipsisIcon className="w-7 h-7 md:w-8 md:h-8 text-white transition-transform duration-100 ease-in-out active:scale-95 hover:text-indigo-200" />
            </Link>
            {/* Badge Notif - Diubah jadi merah ala e-commerce */}
            <p
              id="countChat"
              className="absolute -top-1.5 -right-2 bg-red-500 text-white border-2 border-indigo-800 text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center md:text-xs"
            >
              0
            </p>
          </div>

          {/* Ikon Keranjang */}
          <div className="relative inline-block">
            <Link href="/keranjang">
              <ShoppingCartIcon className="w-7 h-7 md:w-8 md:h-8 text-white transition-transform duration-100 ease-in-out active:scale-95 hover:text-indigo-200" />
            </Link>
            {/* Badge Notif */}
            <p
              id="count"
              className="absolute -top-1.5 -right-2 bg-red-500 text-white border-2 border-indigo-800 text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center md:text-xs"
            >
              {totalItem}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
