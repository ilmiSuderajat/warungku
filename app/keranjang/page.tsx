import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
// Tambahkan ikon dari lucide-react
import { Trash2, ShoppingCart, Image as ImageIcon } from "lucide-react";

export default async function KeranjangPage() {
  const supabase = await createClient();
  const session = await supabase.auth.getSession();

  if (!session.data.session) {
    redirect("/login?error=login_keranjang");
  }

  const { data: keranjang, error } = await supabase
    .from("keranjang")
    .select("id,jumlah,produk_mitra(id,nama_produk,harga, gambar_urls)")
    .eq("user_id", session.data.session.user.id);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          Error dari Supabase: {JSON.stringify(error)}
        </div>
      </div>
    );
  }

  // Tampilan ketika keranjang kosong (Empty State ala E-commerce)
  if (!keranjang || keranjang.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <ShoppingCart className="w-24 h-24 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Keranjangmu masih kosong!
        </h2>
        <p className="text-gray-500 mb-6 text-center">
          Yuk, cari barang-barang menarik dan penuhi keranjangmu.
        </p>
        <Link
          href="/"
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Belanja Sekarang
        </Link>
      </div>
    );
  }

  // Logika kalkulasi total tidak diubah
  const totalSemua = keranjang.reduce((total, item) => {
    const produk = Array.isArray(item.produk_mitra)
      ? item.produk_mitra[0]
      : item.produk_mitra;
    const harga = produk?.harga ?? 0;
    return total + item.jumlah * harga;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-10">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Keranjang Belanja
        </h1>

        {/* Layout Grid: Kiri untuk daftar item, Kanan untuk ringkasan (Desktop) */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Kolom Daftar Produk */}
          <div className="flex-1 space-y-4">
            {keranjang.map((item) => {
              const produk = Array.isArray(item.produk_mitra)
                ? item.produk_mitra[0]
                : item.produk_mitra;

              return (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4"
                >
                  {/* Checkbox Dummy */}
                  <div className="pt-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Placeholder Gambar Produk */}
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 border border-gray-200">
                    {produk?.gambar_urls && produk.gambar_urls.length > 0 ? (
                      <img
                        src={produk.gambar_urls[0]} // Ambil gambar pertama
                        alt={produk?.nama_produk}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      // Fallback jika produk tidak punya gambar
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    )}
                  </div>

                  {/* Info Produk */}
                  <div className="flex flex-col flex-1 justify-between">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm md:text-base text-gray-800 font-medium line-clamp-2 leading-snug pr-4">
                        {produk?.nama_produk}
                      </h3>
                      {/* Harga Total per Item */}
                      <p className="text-sm md:text-base font-bold text-gray-900 shrink-0">
                        Rp{" "}
                        {(produk?.harga * item.jumlah).toLocaleString("id-ID")}
                      </p>
                    </div>

                    {/* Harga Satuan */}
                    <p className="text-xs text-gray-500 mb-3">
                      Rp {produk?.harga?.toLocaleString("id-ID")} / item
                    </p>

                    {/* Aksi: Hapus & Atur Jumlah */}
                    <div className="flex items-center justify-end gap-4 mt-auto">
                      <button className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>

                      {/* UI Pengatur Jumlah */}
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md font-medium">
                          -
                        </button>
                        <span className="px-3 py-1 text-sm font-medium border-x border-gray-300 text-gray-800">
                          {item.jumlah}
                        </span>
                        <button className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md font-medium">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Kolom Ringkasan Belanja (Sticky di layar besar) */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Ringkasan Belanja
              </h2>

              <div className="flex justify-between text-gray-600 mb-3 text-sm">
                <span>Total Harga ({keranjang.length} barang)</span>
                <span>Rp {totalSemua.toLocaleString("id-ID")}</span>
              </div>

              <hr className="my-4 border-gray-200" />

              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-gray-900">Total Tagihan</span>
                <span className="font-bold text-lg text-indigo-700">
                  Rp {totalSemua.toLocaleString("id-ID")}
                </span>
              </div>

              {/* Ubah tombol Beli di file KeranjangPage menjadi seperti ini: */}
              <Link
                href="/checkout?source=keranjang"
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg flex items-center justify-center hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md shadow-indigo-600/20"
              >
                Beli ({keranjang.length})
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
