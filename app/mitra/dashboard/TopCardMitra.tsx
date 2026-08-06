import { createClient } from "@/utils/supabase/server";
import { Banknote, Clock3, ShoppingBag, Store } from "lucide-react";

export default async function TopCardMitra() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Silakan login sebagai mitra.</p>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_open")
    .eq("id", user.id)
    .single();

  const pendapatanHariIni = 145000;
  const pesananAktif = 3;
  const isOpen = profile?.is_open ?? true;
  const stats = [
    {
      label: "Pendapatan Hari Ini",
      value: `Rp ${pendapatanHariIni.toLocaleString("id-ID")}`,
      icon: Banknote,
      tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    },
    {
      label: "Pesanan Diproses",
      value: `${pesananAktif} Pesanan`,
      icon: ShoppingBag,
      tone: "bg-amber-50 text-amber-700 ring-amber-100",
    },
    {
      label: "Jam Operasional",
      value: isOpen ? "Menerima pesanan" : "Tidak menerima pesanan",
      icon: Clock3,
      tone: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 md:text-lg">
              Ringkasan Hari Ini
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Ringkasan performa penjualan Anda hari ini
          </p>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${
            isOpen
              ? "border-emerald-100 bg-emerald-50 text-emerald-700"
              : "border-red-100 bg-red-50 text-red-700"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isOpen ? "bg-emerald-500" : "bg-red-500"
            }`}
          />
          {isOpen ? "Warung Buka" : "Warung Tutup"}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <div
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${stat.tone}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {stat.label}
              </p>
              <p className="mt-1 text-base font-bold text-slate-950">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
