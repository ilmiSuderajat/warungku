// app/alamat/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { getAlamatList, tambahAlamat, setAlamatUtama, hapusAlamat } from "./viewModel";
import { toast } from "sonner";
import { ChevronLeft, MapPin, Plus, ListFilter, Sparkles, ShieldCheck } from "lucide-react";

import AlamatList from "@/app/components/AlamatList";
import AlamatForm from "@/app/components/AlamatForm";

export default function AlamatPage() {
  const [alamatList, setAlamatList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"daftar" | "tambah">("daftar");
  const supabase = createClient();
  const router = useRouter();

  async function muatUlang() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const data = await getAlamatList(supabase, user.id);
    setAlamatList(data);
  }

  useEffect(() => {
    muatUlang();
  }, []);
  async function handleTambahAlamat({
    label,
    alamatLengkap,
    namaLokasi,
    isUtama,
    koordinat,
  }: {
    label: string;
    alamatLengkap: string;
    namaLokasi: string;
    isUtama: boolean;
    koordinat: { lat: number; lng: number };
  }) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setLoading(true);

    const { error } = await tambahAlamat(
      supabase,
      user.id,
      label,
      alamatLengkap,
      namaLokasi,
      isUtama,
      koordinat,
    );

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Alamat berhasil ditambahkan");
    setActiveTab("daftar");
    muatUlang();
  }
  async function handleSetUtama(alamatId: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await setAlamatUtama(supabase, user.id, alamatId);
    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Alamat utama berhasil diperbarui");
    muatUlang();
  }

  async function handleHapusAlamat(alamatId: string) {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus alamat ini?");
    if (!confirmDelete) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await hapusAlamat(supabase, user.id, alamatId);
    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Alamat berhasil dihapus");
    muatUlang();
  }

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 pb-16">
      {/* STICKY NAV BAR - SHOPEE STYLE */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition focus:outline-none"
              aria-label="Kembali"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Alamat Saya</h1>
              <p className="text-xs text-slate-500">Kelola lokasi pengiriman untuk checkout cepat</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab(activeTab === "tambah" ? "daftar" : "tambah")}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:from-orange-600 hover:to-amber-600"
          >
            {activeTab === "tambah" ? (
              <>
                <ListFilter className="w-3.5 h-3.5" />
                Lihat Alamat ({alamatList.length})
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                Tambah Alamat
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* BANNER CARD - WARM SHOPEEFOOD STYLE */}
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-6 text-white shadow-md">
          <div className="absolute right-0 top-0 -mr-6 -mt-6 h-36 w-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ShopeeFood Express Delivery</span>
              </div>
              <h2 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight">
                Simpan Alamat Favorit Anda
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-orange-100 max-w-lg">
                Gunakan fitur pin lokasi Google Maps agar pengantaran makanan dan pesanan Anda tepat waktu dan akurat.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3 rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-md border border-white/20">
              <ShieldCheck className="w-6 h-6 text-white" />
              <div>
                <p className="text-[11px] uppercase tracking-wider text-orange-100 font-medium">Tersimpan</p>
                <p className="text-lg font-bold text-white leading-tight">
                  {alamatList.length} <span className="text-xs font-normal text-orange-100">Alamat</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* NAVIGATION TABS */}
        <div className="flex rounded-2xl bg-slate-200/70 p-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("daftar")}
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-2.5 transition ${activeTab === "daftar"
              ? "bg-white text-orange-600 shadow-xs font-bold"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <MapPin className="w-4 h-4" />
            Daftar Alamat Tersimpan ({alamatList.length})
          </button>
          <button
            onClick={() => setActiveTab("tambah")}
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-2.5 transition ${activeTab === "tambah"
              ? "bg-white text-orange-600 shadow-xs font-bold"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <Plus className="w-4 h-4" />
            Tambah Alamat Baru
          </button>
        </div>

        {/* TAB CONTENTS */}
        {activeTab === "daftar" ? (
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Daftar Alamat Pengiriman
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Alamat utama akan otomatis terpilih saat Anda melakukan checkout pesanan.
                </p>
              </div>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600 border border-orange-200">
                {alamatList.length} Alamat
              </span>
            </div>

            <AlamatList
              data={alamatList}
              onSetUtama={handleSetUtama}
              onHapus={handleHapusAlamat}
            />
          </section>
        ) : (
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">
                Tambah Alamat Baru
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Tentukan titik lokasi pada peta dan lengkapi detail kontak penerima.
              </p>
            </div>

            <AlamatForm onSubmit={handleTambahAlamat} loading={loading} />
          </section>
        )}
      </div>
    </div>
  );
}

