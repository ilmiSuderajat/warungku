import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import TombolKeranjang from "@/app/components/TombolKeranjang";
import SearchBar from "@/app/components/SearchBar";

function formatRupiah(angka: number) {
  return new Intl.NumberFormat("id-ID").format(angka);
}

export default async function DetailProdukPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: item, error } = await supabase
    .from("produk_mitra")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !item) {
    return <div>Produk tidak ditemukan.</div>;
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
    <div className="w-full min-h-screen grid grid-rows-[auto_1fr] bg-gray-50/90">
      <div className="max-w-2xl mx-auto p-6">
        <div className="w-full aspect-square bg-gray-50 rounded-xl mb-4 flex items-center justify-center text-gray-300 text-sm">
          [Gambar Produk]
        </div>

        <h1 className="text-xl font-bold text-gray-800">{item.nama_produk}</h1>
        <p className="text-gray-500 text-sm mt-1">Stok: {item.stok}</p>
        <p className="text-indigo-600 font-bold text-lg mt-2">
          Rp {formatRupiah(item.harga)}
        </p>

        <div className="flex flex-col gap-2 mt-6">
          <form action={beliSekarang}>
            <input type="hidden" name="productId" value={item.id} />
            <input type="hidden" name="jumlah" value="1" />
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 rounded-xl active:scale-95 transition-transform"
            >
              Beli Sekarang
            </button>
          </form>

          <TombolKeranjang action={tambahKeranjang.bind(null, item.id)} />
        </div>
      </div>
    </div>
  );
}
