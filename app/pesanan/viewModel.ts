import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
export async function listPesanan() {
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
          no_pesanan,
          produk_mitra (
            id,
            nama_produk,
            harga,
            gambar_urls,
            slug
          ),
          alamat (
            id,
            label,
            alamat_lengkap
          )
        `,
    )
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(10);
  if (error) {
    console.log("gagal mengambil data pesanan:", error.message);
    return [];
  }
  return pesanan || [];
}
export async function getPesananById(pesananId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?error=belum_login");

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
          no_pesanan,
          produk_mitra (
            id,
            nama_produk,
            harga,
            gambar_urls,
            slug
          ),
          alamat (
            id,
            label,
            alamat_lengkap
          )
        `,
    )
    .eq("user_id", user.id)
    .eq("id", pesananId)
    .single();

  if (error) {
    console.log("gagal mengambil detail pesanan:", error.message);
    return null;
  }

  return pesanan;
}
