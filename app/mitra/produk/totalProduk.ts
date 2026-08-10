import { createClient } from "@/utils/supabase/server";

export async function getTotalProdukMitra() {
  const supabase = await createClient();

  // 1. Ambil user yang sedang login
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  // 2. Cari toko milik user ini berdasarkan pemilik_id
  const { data: toko } = await supabase
    .from("toko_mitra")
    .select("id")
    .eq("pemilik_id", user.id)
    .maybeSingle();

  if (!toko) return 0; // Jika user belum punya toko

  // 3. Hitung total produk berdasarkan toko_id tersebut
  const { count, error } = await supabase
    .from("produk_mitra")
    .select("*", { count: "exact", head: true })
    .eq("toko_id", toko.id);

  if (error) {
    console.error("Gagal menghitung produk:", error.message);
    return 0;
  }

  return count || 0;
}
