import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { ProdukGambarSlider } from "../components/ProdukGambarSlider";

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
    <div className="max-w-6xl mx-auto p-4 md:p-6 ">
      <div className="grid grid-cols-2 h-24 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {produk.map((item) => (
          <Link
            key={item.id}
            href={`/produk/${item.slug}`}
            className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-3 md:p-4 flex flex-col h-full group"
          >
            {/* Placeholder Gambar */}
            <div className="w-full aspect-square bg-gray-200 relative overflow-hidden">
              <ProdukGambarSlider urls={item.gambar_urls} />

              {/* Dummy Badge Promo */}
              <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                Promo
              </div>
            </div>

            {/* Info Produk */}
            <div className="grow flex flex-col">
              <h2 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                {item.nama_produk}
              </h2>

              {/* Rating Bintang & Terjual (Dummy) */}
              <div className="flex items-center gap-1.5 mt-1.5 text-[11px] md:text-xs text-gray-500">
                <div className="flex items-center gap-0.5 text-amber-500 font-medium">
                  <Star size={13} className="fill-amber-500 text-amber-500" />
                  <span>4.8</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span>150+ terjual</span>
              </div>

              {/* Jarak (Dummy) */}
              <div className="flex items-center gap-1 mt-1 text-[11px] md:text-xs text-gray-500">
                <MapPin size={12} className="text-emerald-500" />
                <span>1.2 km • 10 mnt</span>
              </div>

              {/* Harga & Stok */}
              <div className="mt-3 flex items-end justify-between mb-1">
                <div>
                  <p className="text-gray-400 text-[10px] mb-0.5">
                    Stok: {item.stok}
                  </p>
                  <p className="text-red-400 font-bold text-base md:text-lg leading-none">
                    Rp {formatRupiah(item.harga)}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
