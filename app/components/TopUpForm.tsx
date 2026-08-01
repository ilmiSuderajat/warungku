"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type TopUpFormProps = {
  walletId: string;
};

const minimumAmount = 1_000;

export default function TopUpForm({ walletId }: TopUpFormProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleTopUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount < minimumAmount) {
      setError("Nominal top up minimal Rp1.000.");
      setSuccess(null);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const supabase = createClient();
    const { error } = await supabase.rpc("topup_wallet", {
      p_wallet_id: walletId,
      p_amount: parsedAmount,
      p_reference_id: crypto.randomUUID(),
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setAmount("");
    setSuccess("Top up berhasil diproses.");
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={handleTopUp}>
      <div>
        <label
          htmlFor="top-up-amount"
          className="text-sm font-semibold text-slate-700"
        >
          Nominal
        </label>
        <div className="mt-2 flex overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm focus-within:border-slate-500 focus-within:ring-2 focus-within:ring-slate-200">
          <span className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-500">
            Rp
          </span>
          <input
            id="top-up-amount"
            type="number"
            min={minimumAmount}
            step="1000"
            placeholder="50000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
            required
            className="min-w-0 flex-1 border-0 px-3 py-2.5 text-sm text-slate-950 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {loading ? "Memproses..." : "Top up sekarang"}
      </button>
    </form>
  );
}
