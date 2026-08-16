import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { ProdukGambarSlider } from "../components/products/ProdukGambarSlider";

function formatRupiah(angka: number) {
  return new Intl.NumberFormat("id-ID").format(angka);
}

export default async function ProdukPage() {
  const supabase = await createClient();
  const { data: produk, error } = await supabase
    .from("produk_mitra")
    .select("*");

  if (error) {
    return (
      <div className="flex justify-center items-center h-40 text-red-500 font-medium">
        Gagal memuat produk: {error.message}
      </div>
    );
  }

  if (!produk || produk.length === 0) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500 font-medium">
        Belum ada produk yang tersedia.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {produk.map((item) => (
          <Link
            key={item.id}
            href={`/produk/${item.slug}`}
            className="bg-white/90 border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
          >
            {/* Area Gambar */}
            <div className="w-full aspect-square relative overflow-hidden bg-gray-50">
              <ProdukGambarSlider urls={item.gambar_urls} />

              {/* Badge Promo */}
              <div className="absolute top-2 left-0 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-r-md z-10 shadow-sm">
                PROMO
              </div>
            </div>

            {/* Area Info Produk */}
            <div className="p-3 flex flex-col grow">
              {/* JUDUL PRODUK - Diperbarui */}
              {/* Menggunakan font-medium, text-gray-900, dan leading-tight agar lebih tegas namun tetap elegan */}
              <h2 className="text-[12px] leading-[1.3] text-gray-800 line-clamp-2 mb-1.5 font-medium">
                {item.nama_produk}
              </h2>

              {/* Harga */}
              <div className="mb-2">
                <p className="text-red-600 font-bold text-base md:text-lg leading-none">
                  Rp {formatRupiah(item.harga)}
                </p>
              </div>

              {/* Area Bawah (Jarak, Rating, Stok) */}
              <div className="mt-auto flex flex-col gap-1.5">
                {/* Jarak (Dummy) */}
                <div className="flex items-center gap-1 text-[10px] md:text-xs text-gray-500">
                  <MapPin size={12} className="text-gray-400 shrink-0" />
                  <span className="truncate">1.2 km • 10 mnt</span>
                </div>

                {/* Rating, Terjual & Stok */}
                <div className="flex items-center justify-between text-[10px] md:text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star
                      size={12}
                      className="fill-amber-400 text-amber-400 shrink-0"
                    />
                    <span className="text-gray-700">4.8</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-gray-400 mx-0.5"></span>
                    <span>150+ terjual</span>
                  </div>

                  <span className="text-gray-400">Stok: {item.stok}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
