import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Package, Plus } from "lucide-react";
import Link from "next/link";

export default async function ProductManagement() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: produk } = await supabase
    .from("produk_mitra")
    .select("*")
    .eq("mitra_id", user.id);

  async function toggleStok(id: string, stokAktif: number) {
    "use server";
    const sb = await createClient();
    const stokBaru = stokAktif > 0 ? 0 : 10; // Toggle cepat: 0 (Habis) atau 10 (Ada)
    await sb.from("produk_mitra").update({ stok: stokBaru }).eq("id", id);
    revalidatePath("/mitra");
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">
            Kelola Menu Produk
          </h2>
        </div>
        <Link
          href="/mitra/produk/tambah"
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-indigo-700 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Tambah Menu
        </Link>
      </div>

      {!produk || produk.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center text-sm text-slate-500">
          Belum ada produk yang didaftarkan.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {produk.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">
                  {item.nama_produk}
                </p>
                <p className="mt-1 text-sm font-bold text-indigo-700">
                  Rp {item.harga.toLocaleString("id-ID")}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Stok: {item.stok > 0 ? item.stok : "Habis"}
                </p>
              </div>
              <form action={toggleStok.bind(null, item.id, item.stok)}>
                <button
                  type="submit"
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    item.stok > 0
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-100"
                      : "bg-red-50 text-red-700 ring-1 ring-red-100 hover:bg-red-100"
                  }`}
                >
                  {item.stok > 0 ? "Tersedia" : "Habis"}
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
