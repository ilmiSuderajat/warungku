import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { CheckCircle2, Clock3, ShoppingBag } from "lucide-react";

export default async function OrderListMitra() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: toko } = await supabase
    .from("toko_mitra")
    .select("id")
    .eq("pemilik_id", user.id)
    .maybeSingle();

  if (!toko?.id) {
    return null;
  }

  const { data: produkMitra } = await supabase
    .from("produk_mitra")
    .select("id")
    .eq("toko_id", toko.id);

  const produkIds = produkMitra?.map((item) => item.id) ?? [];

  const { data: pesanan, error } = await supabase
    .from("pesanan")
    .select(
      "id, created_at, jumlah, status_pesanan, harga_satuan, produk_id, produk_mitra(id, nama_produk, harga), user_id",
    )
    .in("produk_id", produkIds)
    .order("created_at", { ascending: false });

  async function updateStatus(orderId: string, statusBaru: string) {
    "use server";
    const sb = await createClient();
    await sb
      .from("pesanan")
      .update({ status_pesanan: statusBaru })
      .eq("id", orderId);
    revalidatePath("/mitra");
  }

  const statusClass = (status?: string | null) => {
    if (status === "selesai") {
      return "bg-emerald-50 text-emerald-700 ring-emerald-100";
    }

    if (status === "diproses") {
      return "bg-indigo-50 text-indigo-700 ring-indigo-100";
    }

    return "bg-amber-50 text-amber-700 ring-amber-100";
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">Pesanan Masuk</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          {pesanan?.length ?? 0} pesanan
        </span>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          Pesanan belum dapat dimuat. Coba muat ulang halaman.
        </div>
      ) : !pesanan || pesanan.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center text-sm text-slate-500">
          Belum ada pesanan masuk saat ini.
        </div>
      ) : (
        <div className="space-y-3">
          {pesanan.map((item) => {
            const produk = Array.isArray(item.produk_mitra)
              ? item.produk_mitra[0]
              : item.produk_mitra;

            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {produk?.nama_produk || "Produk"}
                      </p>
                      <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-indigo-700 ring-1 ring-indigo-100">
                        x{item.jumlah}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold capitalize ring-1 ${statusClass(
                          item.status_pesanan,
                        )}`}
                      >
                        {item.status_pesanan || "menunggu"}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">
                      Total: Rp {Number(item.harga_satuan ?? 0).toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="flex w-full gap-2 md:w-auto">
                    <form
                      action={updateStatus.bind(null, item.id, "diproses")}
                      className="flex-1 md:flex-none"
                    >
                      <button
                        type="submit"
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-indigo-700"
                      >
                        <Clock3 className="h-4 w-4" />
                        Terima
                      </button>
                    </form>
                    <form
                      action={updateStatus.bind(null, item.id, "selesai")}
                      className="flex-1 md:flex-none"
                    >
                      <button
                        type="submit"
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Selesai
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
