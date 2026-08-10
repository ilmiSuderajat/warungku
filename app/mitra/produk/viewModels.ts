import { SupabaseClient } from "@supabase/supabase-js";
import { generateUniqueSlug } from "@/utils/slugify";

export async function getTokoId(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("toko_mitra")
    .select("id")
    .eq("pemilik_id", user.id)
    .single();
  console.log("DEBUG getTokoId:", { userId: user.id, data, error });

  return data?.id ?? null;
}

export async function tambahProduk(
  supabase: SupabaseClient,
  tokoId: string,
  namaProduk: string,
  harga: number,
  stok: number,
  gambarUrl: String[],
) {
  const slug = await generateUniqueSlug(supabase, namaProduk);

  const { data, error } = await supabase
    .from("produk_mitra")
    .insert({
      toko_id: tokoId,
      nama_produk: namaProduk,
      harga,
      stok,
      slug,
      gambar_urls: gambarUrl,
    })
    .select();

  return { data, error };
}
