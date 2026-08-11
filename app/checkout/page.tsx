import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import FormCheckout from "@/app/components/FormCheckout";
import { redirect } from "next/navigation";
// Tambahan icon untuk mempercantik UI
import { MapPin, ShoppingBag, Receipt } from "lucide-react";

type CheckoutItem = {
  id: string;
  nama_produk: string;
  harga: number;
  jumlah_beli: number;
  subtotal: number;
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams:
    | Promise<{ productId?: string; source?: string; jumlah?: string }>
    | { productId?: string; source?: string; jumlah?: string };
}) {
  const params = await searchParams;
  const source = params.source ?? "langsung";
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=belum_login");
  }

  const { data: alamatUtama } = await supabase
    .from("alamat")
    .select("id, label, alamat_lengkap")
    .eq("user_id", user.id)
    .eq("is_utama", true)
    .single();

  if (!alamatUtama) {
    redirect("/alamat?error=belum_ada_alamat");
  }

  let daftarProduk: CheckoutItem[] = [];
  let totalTagihan = 0;
  let maxStok = 0;

  if (source === "keranjang") {
    const { data: keranjang } = await supabase
      .from("keranjang")
      .select("id, jumlah, produk_mitra(id, nama_produk, harga, stok)")
      .eq("user_id", user.id);

    if (!keranjang || keranjang.length === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-gray-500 font-medium">Keranjang Anda kosong.</p>
        </div>
      );
    }

    daftarProduk = keranjang.map((item) => {
      const p = Array.isArray(item.produk_mitra)
        ? item.produk_mitra[0]
        : item.produk_mitra;
      return {
        id: p.id,
        nama_produk: p.nama_produk,
        harga: p.harga,
        jumlah_beli: item.jumlah,
        subtotal: p.harga * item.jumlah,
      };
    });

    totalTagihan = daftarProduk.reduce((acc, curr) => acc + curr.subtotal, 0);
  } else {
    const productId = params.productId ?? "";
    const { data: produk, error } = await supabase
      .from("produk_mitra")
      .select("*")
      .eq("id", productId)
      .single();

    if (error || !produk) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-gray-500 font-medium">Produk tidak ditemukan.</p>
        </div>
      );
    }

    daftarProduk = [
      {
        id: produk.id,
        nama_produk: produk.nama_produk,
        harga: produk.harga,
        jumlah_beli: 1,
        subtotal: produk.harga,
      },
    ];
    totalTagihan = produk.harga;
    maxStok = produk.stok;
  }

  async function prosesBayar(jumlahDariForm: number) {
    "use server";
    const supabaseServer = await createClient();

    if (source === "keranjang") {
      const { error } = await supabaseServer.rpc("checkout_keranjang", {
        p_alamat_id: alamatUtama?.id,
      });

      if (error) {
        return { success: false, message: "Gagal: " + error.message };
      }
    } else {
      const produkPertama = daftarProduk[0];
      const { error } = await supabaseServer.rpc("buat_pesanan", {
        p_produk_id: produkPertama.id,
        p_jumlah: jumlahDariForm,
        p_alamat_id: alamatUtama?.id,
      });

      if (error) {
        return { success: false, message: "Gagal: " + error.message };
      }
    }

    redirect("/pesanan?status=sukses");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-10">
      <div className="max-w-2xl mx-auto px-4 md:px-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

        {/* 1. CARD ALAMAT PENGIRIMAN */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-4">
          <div className="flex items-center gap-2 mb-3 text-gray-800 font-bold border-b border-gray-100 pb-3">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <h2>Alamat Pengiriman</h2>
          </div>
          <div className="pl-7">
            <p className="font-semibold text-gray-900">{alamatUtama.label}</p>
            <p className="text-gray-600 text-sm mt-1 leading-relaxed">
              {alamatUtama.alamat_lengkap}
            </p>
          </div>
        </div>

        {/* 2. CARD RINGKASAN PESANAN */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-4">
          <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold border-b border-gray-100 pb-3">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <h2>Pesanan Anda</h2>
          </div>

          <div className="space-y-4">
            {daftarProduk.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-start gap-4"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-800 line-clamp-2 leading-snug">
                    {item.nama_produk}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.jumlah_beli} item x Rp{" "}
                    {item.harga.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-bold text-gray-900">
                    Rp {item.subtotal.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. CARD RINCIAN PEMBAYARAN & TOMBOL */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold border-b border-gray-100 pb-3">
            <Receipt className="w-5 h-5 text-indigo-600" />
            <h2>Rincian Pembayaran</h2>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
            <p>Subtotal Produk</p>
            <p>Rp {totalTagihan.toLocaleString("id-ID")}</p>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
            <p>Ongkos Kirim</p>
            <p className="text-green-600 font-medium">Gratis</p>{" "}
            {/* Contoh Promo/Dummy */}
          </div>

          <div className="flex justify-between items-center text-lg font-bold text-gray-900 pt-4 border-t border-gray-100 border-dashed">
            <p>Total Tagihan</p>
            <p className="text-indigo-600">
              Rp {totalTagihan.toLocaleString("id-ID")}
            </p>
          </div>

          {/* Area Tombol Bayar */}
          <div className="mt-6">
            {source === "keranjang" ? (
              <form
                action={async (formData: FormData) => {
                  "use server";
                  await prosesBayar(0);
                }}
              >
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold py-3.5 rounded-lg transition-all shadow-md shadow-indigo-600/20"
                >
                  Buat Pesanan
                </button>
              </form>
            ) : (
              // Pastikan komponen FormCheckout Anda juga didesain senada dengan Tailwind agar menyatu dengan baik
              <FormCheckout prosesBayar={prosesBayar} stok={maxStok} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
