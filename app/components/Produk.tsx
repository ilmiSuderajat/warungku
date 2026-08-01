import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import TombolKeranjang from "./TombolKeranjang";

// Helper formatter
function formatRupiah(angka: number) {
  return new Intl.NumberFormat("id-ID").format(angka);
}

export default async function ProdukPage() {
  const supabase = await createClient();

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

    const { data: itemAda } = await supabase
      .from("keranjang")
      .select("id, jumlah")
      .eq("produk_id", productId)
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

  // --- TAMPILAN (UI) ---
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 mb-20">
      {/* Grid Layout: 2 kolom di HP, 3 di Tablet, 4 di Desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {produk.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-2xl p-4 flex flex-col h-full"
          >
            {/* Placeholder Gambar (Jika nanti ada gambar) */}
            <div className="w-full aspect-square bg-gray-50 rounded-xl mb-4 flex items-center justify-center text-gray-300 text-sm">
              [Gambar Produk]
            </div>

            {/* Info Produk */}
            <div className="grow mb-4">
              <h2 className="font-bold text-gray-800 text-sm md:text-base line-clamp-2">
                {item.nama_produk}
              </h2>
              <p className="text-gray-500 text-xs mt-1">Stok: {item.stok}</p>
              <p className="text-indigo-600 font-bold text-base md:text-lg mt-2">
                Rp {formatRupiah(item.harga)}
              </p>
            </div>

            {/* Area Tombol Aksi */}
            <div className="flex flex-col gap-2 mt-auto">
              <form action={beliSekarang} className="w-full">
                <input type="hidden" name="productId" value={item.id} />
                {/* Tambahkan hidden input jumlah karena di function kamu memanggil formData.get("jumlah") */}
                <input type="hidden" name="jumlah" value="1" />

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 rounded-xl active:scale-95 transition-transform"
                >
                  Beli Sekarang
                </button>
              </form>

              {/* Menggunakan .bind() untuk mengirim ID ke Server Action tanpa membuat inline function baru per item */}
              <TombolKeranjang action={tambahKeranjang.bind(null, item.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
