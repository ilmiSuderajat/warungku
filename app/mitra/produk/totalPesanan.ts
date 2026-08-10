import { createClient } from "@/utils/supabase/server";

export async function getProdukBesertaTotalPesanan() {
  const supabase = await createClient();

  // Mengambil data produk_mitra beserta data pesanan yang berelasi
  const { data: produk, error } = await supabase.from("produk_mitra").select(`
      id,
      nama_produk,
      harga,
      pesanan (
        jumlah
      )
    `);

  if (error) {
    console.error("Gagal ambil data:", error.message);
    return [];
  }

  // Lakukan perhitungan total kuantitas terjual di JavaScript/TypeScript
  const produkDenganTotal = produk.map((item) => {
    // Menjumlahkan kolom 'jumlah' dari semua pesanan yang masuk untuk produk ini
    const totalTerjual = item.pesanan.reduce(
      (sum: number, curr: { jumlah: number }) => sum + curr.jumlah,
      0,
    );

    return {
      ...item,
      totalTerjual,
    };
  });

  return produkDenganTotal;
}
