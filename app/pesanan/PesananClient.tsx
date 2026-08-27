"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  ShoppingBag,
  ChevronRight,
  AlertCircle,
  MoveLeft,
} from "lucide-react";
import OrderSuccess from "@/app/components/pesanan/OrderSuccess";
import { useRouter } from "next/navigation";
export interface PesananItem {
  id: string;
  created_at: string;
  jumlah: number;
  status_pesanan: string;
  harga_satuan: number | null;
  no_pesanan: string;
  alasan_pembatalan: string | null;
  produk_mitra: {
    id: string;
    nama_produk: string;
    harga: number;
    slug: string;
    gambar_urls?: string[];
  } | null;
  alamat: {
    id: string;
    label: string;
    alamat_lengkap: string;
  } | null;
}

interface PesananClientProps {
  daftarPesanan: PesananItem[];
}

function formatRupiah(angka: number) {
  return new Intl.NumberFormat("id-ID").format(angka);
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function PesananClient({ daftarPesanan }: PesananClientProps) {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("semua");
  const router = useRouter();
  useEffect(() => {
    if (statusParam === "sukses") {
      setShowSuccess(true);
    }
  }, [statusParam]);

  const filteredPesanan = daftarPesanan.filter((item) => {
    if (activeTab === "semua") return true;
    return item.status_pesanan.toLowerCase() === activeTab.toLowerCase();
  });

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case "selesai":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Selesai
          </span>
        );
      case "dikirim":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-700">
            <Truck className="w-3.5 h-3.5" />
            Dalam Pengiriman
          </span>
        );
      case "diproses":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
            <Clock className="w-3.5 h-3.5" />
            Diproses
          </span>
        );
      case "dibatalkan":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
            <XCircle className="w-3.5 h-3.5" />
            Dibatalkan
          </span>
        );
      case "menunggu":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
            <Clock className="w-3.5 h-3.5" />
            Menunggu Konfirmasi
          </span>
        );
    }
  };

  const tabs = [
    { id: "semua", label: "Semua" },
    { id: "menunggu", label: "Menunggu" },
    { id: "diproses", label: "Diproses" },
    { id: "dikirim", label: "Dikirim" },
    { id: "selesai", label: "Selesai" },
    { id: "dibatalkan", label: "Dibatalkan" },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50/90 pb-24">
      {/* Toast Animasi Loading & Sukses Overlay */}
      <OrderSuccess show={showSuccess} />

      {/* Header Banner */}
      <div className="bg-indigo-800 text-white p-5 sm:p-6">
        <div className="max-w-3xl mx-auto space-y-1">
          <div className="flex items-center gap-3 text-center">
            <MoveLeft
              onClick={() => router.back()}
              className="w-6 h-6 text-white transition-transform duration-100 ease-in-out active:scale-80"
            />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight ml-15">
              Pesanan Saya
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-1 pt-2 space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border ${
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white/95 text-gray-500 border-gray-200 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* List Pesanan */}
        {filteredPesanan.length === 0 ? (
          <div className="bg-white/95 rounded-lg border p-2 text-center space-y-4 my-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-500">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Belum Ada Pesanan
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
                {activeTab === "semua"
                  ? "Anda belum melakukan pemesanan. Mulai belanja produk terbaik dari UMKM kami sekarang!"
                  : `Tidak ada pesanan dengan status "${activeTab}".`}
              </p>
            </div>
            <div>
              <Link
                href="/produk"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-lg transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                Mulai Belanja
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredPesanan.map((item) => {
              const produk = item.produk_mitra;
              const hargaSatuan = item.harga_satuan ?? produk?.harga ?? 0;
              const totalHarga = hargaSatuan * item.jumlah;
              const gambarUrl =
                produk?.gambar_urls && produk.gambar_urls.length > 0
                  ? produk.gambar_urls[0]
                  : null;

              return (
                <div
                  key={item.id}
                  className="w-full bg-white/95 rounded-lg border border-gray-100 p-2 space-y-4"
                >
                  {/* Top Bar: Date & Status */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-gray-900">
                        No Pesanan #{item.no_pesanan}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                    <div>{getStatusBadge(item.status_pesanan)}</div>
                  </div>

                  {/* Product Info */}
                  <div className="flex items-start ml-5 gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {gambarUrl ? (
                        <img
                          src={gambarUrl}
                          alt={produk?.nama_produk || "Produk"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-gray-500" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate">
                        {produk?.nama_produk || "Produk Tidak Tersedia"}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {item.jumlah} barang x Rp {formatRupiah(hargaSatuan)}
                      </p>
                    </div>
                  </div>

                  {/* Alamat Pengiriman */}
                  {item.alamat && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div className="text-xs space-y-0.5">
                        <p className="font-semibold text-gray-900">
                          {item.alamat.label}
                        </p>
                        <p className="text-gray-500 line-clamp-1">
                          {item.alamat.alamat_lengkap}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Alasan Pembatalan if canceled */}
                  {item.status_pesanan.toLowerCase() === "dibatalkan" &&
                    item.alasan_pembatalan && (
                      <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex items-start gap-2 text-xs text-red-600">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">Alasan Pembatalan:</p>
                          <p>{item.alasan_pembatalan}</p>
                        </div>
                      </div>
                    )}

                  {/* Bottom Bar: Total & Actions */}
                  <div className="flex ml-2 items-center justify-between border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">Total Pembayaran</p>
                      <p className="text-sm sm:text-base font-bold text-gray-900">
                        Rp {formatRupiah(totalHarga)}
                      </p>
                    </div>

                    <div className="flex mt-2 p-2 items-center gap-2">
                      <Link
                        href={`/pesanan/${item.id}`}
                        className="bg-gray-500 text-white text-center text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-all inline-flex items-center gap-1"
                      >
                        Detail
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={
                          produk?.slug ? `/produk/${produk.slug}` : "/produk"
                        }
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-all inline-flex items-center gap-1"
                      >
                        Beli Lagi
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
