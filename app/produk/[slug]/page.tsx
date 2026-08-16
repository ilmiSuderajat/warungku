import { createClient } from "@/utils/supabase/server";
import { getTotalKeranjang } from "@/utils/cart";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import TombolKeranjang from "@/app/components/pesanan/TombolKeranjang";
import { Star, MapPin, Store, Clock, ChevronLeft } from "lucide-react";
import SearchBar from "@/app/components/ui/SearchBar";
import GaleriProduk from "@/app/components/products/GaleriProduk";

function formatRupiah(angka: number) {
  return new Intl.NumberFormat("id-ID").format(angka);
}

export default async function DetailProdukPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const totalItem = await getTotalKeranjang();
  const { slug } = await params;
  const supabase = await createClient();

  const { data: item, error } = await supabase
    .from("produk_mitra")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500 gap-4 p-4">
        <p className="font-medium text-lg">Produk tidak ditemukan.</p>
        <Link
          href="/produk"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
        >
          <ChevronLeft size={18} />
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  async function beliSekarang(formData: FormData) {
    "use server";
    const jumlah = formData.get("jumlah") || "1";
    redirect(`/checkout?productId=${item.id}&jumlah=${jumlah}`);
  }

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
        user_id: user.id,
      });
      err = error;
    }
    revalidatePath("/");
    return !err;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        <SearchBar totalItem={totalItem} />

        <div className="relative">
          {/* Back button overlay */}
          <Link
            href="/produk"
            className="absolute top-3 left-3 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-white/40 flex items-center justify-center text-gray-700 hover:bg-white active:scale-95 transition-all "
            aria-label="Kembali"
          >
            <ChevronLeft size={20} />
          </Link>

          <GaleriProduk urls={item.gambar_urls}>
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 p-4">
              <div className="max-w-md mx-auto flex flex-row items-center justify-between gap-3">
                <div className="w-14 h-12 shrink-0">
                  <TombolKeranjang
                    action={tambahKeranjang.bind(null, item.id)}
                  />
                </div>

                <form action={beliSekarang} className="flex-1">
                  <input type="hidden" name="productId" value={item.id} />
                  <input type="hidden" name="jumlah" value="1" />
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl active:scale-95 transition-all shadow-sm shadow-indigo-200"
                  >
                    Beli Sekarang
                  </button>
                </form>
              </div>
            </div>
          </GaleriProduk>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start gap-4 mb-3">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">
              {item.nama_produk}
            </h1>
            <p className="text-indigo-600 font-bold text-xl whitespace-nowrap">
              Rp {formatRupiah(item.harga)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-5 border-b border-gray-100 pb-5">
            <div className="flex items-center gap-1 font-medium text-amber-500">
              <Star size={16} className="fill-amber-500" />
              <span>4.8</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>150+ Penilaian</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>Stok: {item.stok}</span>
          </div>

          <div className="flex items-center gap-3 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
              <Store size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm truncate">
                Mitra UMKM WarungKita
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                <span className="flex items-center gap-0.5">
                  <MapPin size={12} /> 1.2 km
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <Clock size={12} /> 10-15 mnt
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-2">Deskripsi Produk</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {item.deskripsi ||
                "Belum ada deskripsi untuk produk ini. Disiapkan langsung dengan bahan segar ketika Anda memesan. Nikmati jajanan lokal terbaik dengan pengiriman instan."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
