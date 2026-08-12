import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import PesananClient, { PesananItem } from "./PesananClient";
import { Suspense } from "react";
import { Clock } from "lucide-react";

export default async function PesananPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=belum_login");
  }

  const { data: pesanan, error } = await supabase
    .from("pesanan")
    .select(`
      id,
      created_at,
      jumlah,
      status_pesanan,
      harga_satuan,
      alasan_pembatalan,
      produk_mitra (
        id,
        nama_produk,
        harga,
        gambar_urls
      ),
      alamat (
        id,
        label,
        alamat_lengkap
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const daftarPesanan: PesananItem[] = (pesanan || []).map((item: any) => ({
    id: item.id,
    created_at: item.created_at,
    jumlah: item.jumlah,
    status_pesanan: item.status_pesanan,
    harga_satuan: item.harga_satuan,
    alasan_pembatalan: item.alasan_pembatalan,
    produk_mitra: Array.isArray(item.produk_mitra)
      ? item.produk_mitra[0] ?? null
      : item.produk_mitra ?? null,
    alamat: Array.isArray(item.alamat)
      ? item.alamat[0] ?? null
      : item.alamat ?? null,
  }));

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="w-5 h-5 animate-spin text-indigo-600" />
            <span className="text-sm font-medium">Memuat pesanan Anda...</span>
          </div>
        </div>
      }
    >
      <PesananClient daftarPesanan={daftarPesanan} />
    </Suspense>
  );
}
