// file: @/app/alamat/components/AlamatClientView.tsx
"use client";

import {
  Home,
  Briefcase,
  Bookmark,
  ChevronRight,
  MoveLeft,
} from "lucide-react";
import { Alamat } from "@/app/alamat/viewModel";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AlamatCard({ data }: { data: Alamat[] }) {
  const router = useRouter();
  return (
    <div className="w-full min-h-screen bg-[#f5f5f5] flex flex-col">
      {/* 1. Header (Navbar) */}
      <div className="bg-white w-full h-14 flex items-center gap-3 px-3 sticky top-0 z-20 border-b border-gray-100">
        <MoveLeft
          onClick={() => router.back()}
          className="w-6 h-6 text-indigo-600 transition-transform duration-100 ease-in-out active:scale-80"
        />
        <div className="flex items-center gap-4 px-4 py-3 md:px-6 max-w-7xl mx-auto h-16 mr-20 md:h-20">
          <h1 className="text-slate-700 text-lg ">Alamat Pengantaran</h1>
        </div>
      </div>

      {/* 2. Container Utama */}
      <div className="flex-1 px-3 py-3 sm:px-4 sm:py-4 max-w-md mx-auto w-full pb-28">
        {/* Card Shortcut */}
        <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-3">
          <Link
            href="/alamat/add?type=rumah"
            className="w-full flex items-center justify-between px-4 py-3.5 border-b border-gray-100 active:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Home
                className="w-5 h-5 text-gray-700 shrink-0"
                strokeWidth={1.5}
              />
              <span className="text-[14px] font-medium text-gray-800">
                Tambah Alamat Rumah
              </span>
            </div>
            <ChevronRight
              className="w-4 h-4 text-gray-400 shrink-0"
              strokeWidth={1.5}
            />
          </Link>

          <Link
            href="/alamat/add?type=kantor"
            className="w-full flex items-center justify-between px-4 py-3.5 active:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Briefcase
                className="w-5 h-5 text-gray-700 shrink-0"
                strokeWidth={1.5}
              />
              <span className="text-[14px] font-medium text-gray-800">
                Tambah Alamat Kantor
              </span>
            </div>
            <ChevronRight
              className="w-4 h-4 text-gray-400 shrink-0"
              strokeWidth={1.5}
            />
          </Link>
        </div>

        {/* Card List Alamat */}
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          {data.length > 0 ? (
            data.map((alamat) => (
              <div
                key={alamat.id}
                className="flex items-start gap-3 px-4 py-4 active:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <Bookmark
                  className="w-5 h-5 text-gray-500 shrink-0 mt-0.5"
                  strokeWidth={1.5}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <span className="text-[14px] font-semibold text-gray-900 wrap-break-word">
                      {alamat.label || alamat.alamat_lengkap}
                    </span>
                    <button
                      type="button"
                      className="text-[13px] text-[#2673dd] shrink-0 py-0.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/alamat/edit/${alamat.id}`);
                      }}
                    >
                      Ubah
                    </button>
                  </div>

                  {alamat.alamat_lengkap && (
                    <p className="text-[13px] text-gray-500 leading-relaxed mb-1.5 wrap-break-word">
                      {alamat.alamat_lengkap}
                    </p>
                  )}

                  {(alamat.detail_intruksi || alamat.intruksi_khusus) && (
                    <p className="text-[13px] text-gray-500 leading-relaxed mb-1.5 wrap-break-word">
                      {alamat.detail_intruksi || alamat.intruksi_khusus}
                    </p>
                  )}

                  <p className="text-[13px] text-gray-500 wrap-break-word">
                    {alamat.nama_penerima}
                    {alamat.no_hp && (
                      <span className="ml-1">{alamat.no_hp}</span>
                    )}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-[13px] text-gray-500">
              Belum ada alamat tersimpan.
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom Button (Fixed, aman dari notch/gesture bar) */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="max-w-md mx-auto w-full p-3">
          <Link
            href="/alamat/add"
            className="block w-full text-center bg-indigo-600 text-white py-3 rounded-md font-medium text-[15px] active:bg-indigo-400 transition-colors"
          >
            Tambah Alamat Baru
          </Link>
        </div>
      </div>
    </div>
  );
}
