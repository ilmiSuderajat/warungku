import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
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
    <div className="max-w-6xl mx-auto p-4 md:p-6 mb-20">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {produk.map((item) => (
          <Link
            key={item.id}
            href={`/produk/${item.slug}`}
            className="bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-2xl p-4 flex flex-col h-full"
          >
            <div className="w-full aspect-square bg-gray-50 rounded-xl mb-4 flex items-center justify-center text-gray-300 text-sm">
              [Gambar Produk]
            </div>
            <div className="grow">
              <h2 className="font-bold text-gray-800 text-sm md:text-base line-clamp-2">
                {item.nama_produk}
              </h2>
              <p className="text-gray-500 text-xs mt-1">Stok: {item.stok}</p>
              <p className="text-indigo-600 font-bold text-base md:text-lg mt-2">
                Rp {formatRupiah(item.harga)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
