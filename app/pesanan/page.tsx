import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import PesananClient, { PesananItem } from "./PesananClient";
import { Suspense } from "react";
import { PesananSkeleton } from "../components/ui/Skeleton";

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
    .select(
      `
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
    `,
    )
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
