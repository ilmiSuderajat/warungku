import { createClient } from "@/utils/supabase/server";
import { Wallet, ArrowUpRight } from "lucide-react";

export default async function WithdrawCard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: wallet } = await supabase
    .from("wallets")
    .select("balance")
    .eq("user_id", user.id)
    .maybeSingle();

  const saldo = wallet?.balance || 0;

  return (
    <section className="rounded-2xl bg-linear-to-br from-indigo-950 via-indigo-800 to-slate-900 p-5 text-white shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
          <Wallet className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-indigo-100">
            Saldo Siap Tarik
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight">
            Rp {saldo.toLocaleString("id-ID")}
          </p>
          <p className="mt-1 text-xs leading-5 text-indigo-100/80">
            Dana masuk dari pesanan yang sudah selesai.
          </p>
        </div>
      </div>

      <button className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-indigo-950 shadow-sm transition hover:bg-indigo-50">
        Tarik Saldo
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </section>
  );
}
