"use server";
import { createClient } from "@/utils/supabase/server";

export async function prosesBayar(
  jumlahDariForm: number,
  source: string,
  alamatUtamaId: string,
  produkPertamaId?: string,
) {
  const supabaseServer = await createClient();

  if (source === "keranjang") {
    const { error } = await supabaseServer.rpc("checkout_keranjang", {
      p_alamat_id: alamatUtamaId,
    });
    if (error) return { success: false, message: "Gagal: " + error.message };
  } else {
    const { error } = await supabaseServer.rpc("buat_pesanan", {
      p_produk_id: produkPertamaId,
      p_jumlah: jumlahDariForm,
      p_alamat_id: alamatUtamaId,
    });
    if (error) return { success: false, message: "Gagal: " + error.message };
  }

  return { success: true, message: "Pesanan berhasil dibuat!" };
}
