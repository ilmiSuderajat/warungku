import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import TombolKeranjang from "./pesanan/TombolKeranjang";
import { Star, MapPin } from "lucide-react";
// Helper formatter
function formatRupiah(angka: number) {
  return new Intl.NumberFormat("id-ID").format(angka);
}

export default async function ProdukPage() {
  const supabase = await createClient();
  const session = await supabase.auth.getSession();

  if (!session.data.session) {
    redirect("/login");
  }

  // Fetch Data
  const { data: produk, error } = await supabase
    .from("produk_mitra")
    .select("*");

  // Handle Error & Empty State
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

  // --- SERVER ACTIONS ---

  // 1. Action Beli Sekarang
  async function beliSekarang(formData: FormData) {
    "use server";
    const productId = formData.get("productId");
    // Beri nilai default "1" jika input jumlah tidak ada
    const jumlahPasti = formData.get("jumlah") || "1";

    redirect(`/checkout?productId=${productId}&jumlah=${jumlahPasti}`);
  }

  // 2. Action Tambah Keranjang (Dipisah agar lebih rapi & tidak dilooping)
  async function tambahKeranjang(productId: string) {
    "use server";
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const { data: itemAda } = await supabase
      .from("keranjang")
      .select("id, jumlah")
      .eq("produk_id", productId)
      .eq("user_id", user.id)
      .maybeSingle();

    let err;
    if (itemAda) {
      const { error } = await supabase
        .from("keranjang")
        .update({ jumlah: itemAda.jumlah + 1 })
        .eq("id", itemAda.id);
      err = error;
    } else {
      const { error } = await supabase.from("keranjang").insert({
        produk_id: productId,
        jumlah: 1,
      });
      err = error;
    }

    revalidatePath("/");
    return !err; // Return true jika sukses, false jika error
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 mb-20">
      {/* Grid Layout: 2 kolom di HP, 3 di Tablet, 4 di Desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {produk.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-3 md:p-4 flex flex-col h-full group"
          >
            {/* Placeholder Gambar (Jika nanti ada gambar) */}
            <div className="w-full aspect-square bg-gray-50 rounded-xl mb-3 flex items-center justify-center text-gray-300 text-sm overflow-hidden relative">
              <span className="z-10">[Gambar]</span>

              {/* Dummy Badge Promo (Opsional) */}
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

              {/* Jarak (Dummy) - Sangat penting untuk konteks jajanan terdekat */}
              <div className="flex items-center gap-1 mt-1 text-[11px] md:text-xs text-gray-500">
                <MapPin size={12} className="text-emerald-500" />
                <span>1.2 km • 10 mnt</span>
              </div>

              {/* Harga & Stok */}
              <div className="mt-3 flex items-end justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-[10px] mb-0.5">
                    Stok: {item.stok}
                  </p>
                  <p className="text-gray-900 font-bold text-base md:text-lg leading-none">
                    Rp {formatRupiah(item.harga)}
                  </p>
                </div>
              </div>
            </div>

            {/* Area Tombol Aksi */}
            <div className="flex flex-col gap-2 mt-auto">
              <form action={beliSekarang} className="w-full">
                <input type="hidden" name="productId" value={item.id} />
                <input type="hidden" name="jumlah" value="1" />

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-semibold py-2 md:py-2.5 rounded-xl active:scale-95 transition-all shadow-sm shadow-indigo-200"
                >
                  Beli Sekarang
                </button>
              </form>

              <TombolKeranjang action={tambahKeranjang.bind(null, item.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
