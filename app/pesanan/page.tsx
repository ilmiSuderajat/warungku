import { createClient } from "@/utils/supabase/server";
import PesananClient, { PesananItem } from "./PesananClient";
import { Suspense } from "react";
import { PesananSkeleton } from "../components/ui/Skeleton";
import { listPesanan } from "./viewModel";
export default async function PesananPage() {
  const listData = await listPesanan();
  const daftarPesanan: PesananItem[] = (listData || []).map((item: any) => ({
    id: item.id,
    created_at: item.created_at,
    jumlah: item.jumlah,
    status_pesanan: item.status_pesanan,
    harga_satuan: item.harga_satuan,
    no_pesanan: item.no_pesanan,
    alasan_pembatalan: item.alasan_pembatalan,
    produk_mitra: Array.isArray(item.produk_mitra)
      ? (item.produk_mitra[0] ?? null)
      : (item.produk_mitra ?? null),
    alamat: Array.isArray(item.alamat)
      ? (item.alamat[0] ?? null)
      : (item.alamat ?? null),
  }));

  return (
    <Suspense fallback={<PesananSkeleton />}>
      <PesananClient daftarPesanan={daftarPesanan} />
    </Suspense>
  );
}
