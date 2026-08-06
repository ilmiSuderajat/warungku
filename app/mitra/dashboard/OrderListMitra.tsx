import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { CheckCircle2, Clock3, ShoppingBag } from "lucide-react";

export default async function OrderListMitra() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Ambil data pesanan yang masuk ke produk milik mitra ini
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*, produk_mitra(nama_produk)")
    .eq("mitra_id", user.id)
    .order("created_at", { ascending: false });

  // Server Action untuk mengubah status pesanan
  async function updateStatus(orderId: string, statusBaru: string) {
    "use server";
    const sb = await createClient();
    await sb.from("orders").update({ status: statusBaru }).eq("id", orderId);
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
          <h2 className="text-base font-bold text-slate-900">
            Pesanan Masuk
          </h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          {orders?.length ?? 0} pesanan
        </span>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          Pesanan belum dapat dimuat. Coba muat ulang halaman.
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center text-sm text-slate-500">
          Belum ada pesanan masuk saat ini.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {order.produk_mitra?.nama_produk || "Produk"}
                    </p>
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-indigo-700 ring-1 ring-indigo-100">
                      x{order.jumlah}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold capitalize ring-1 ${statusClass(
                        order.status
                      )}`}
                    >
                      {order.status || "menunggu"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    Catatan: {order.catatan || "Tidak ada catatan"}
                  </p>
                </div>

                <div className="flex w-full gap-2 md:w-auto">
                  <form
                    action={updateStatus.bind(null, order.id, "diproses")}
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
                    action={updateStatus.bind(null, order.id, "selesai")}
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
          ))}
        </div>
      )}
    </section>
  );
}
