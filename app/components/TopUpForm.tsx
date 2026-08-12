"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { PlusCircle, Loader2 } from "lucide-react";

type TopUpFormProps = {
  walletId: string;
};

const minimumAmount = 1_000;
const presetAmounts = [10_000, 25_000, 50_000, 100_000, 250_000, 500_000];

function formatRupiah(angka: number) {
  return new Intl.NumberFormat("id-ID").format(angka);
}

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
    setSuccess("Top up saldo berhasil diproses!");
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={handleTopUp}>
      {/* Quick Amount Preset Chips */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500">
          Pilih Nominal Cepat
        </label>
        <div className="grid grid-cols-3 gap-2">
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAmount(preset.toString())}
              className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                amount === preset.toString()
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-900 border-gray-200 hover:border-indigo-600"
              }`}
            >
              Rp {formatRupiah(preset)}
            </button>
          ))}
        </div>
      </div>

      {/* Manual Input */}
      <div className="space-y-1">
        <label
          htmlFor="top-up-amount"
          className="text-xs font-semibold text-gray-500"
        >
          Atau Masukkan Nominal Lain
        </label>
        <div className="flex items-center rounded-lg border border-gray-200 bg-white overflow-hidden focus-within:border-indigo-600">
          <span className="bg-gray-50 px-3 py-2.5 text-xs font-semibold text-gray-500 border-r border-gray-200">
            Rp
          </span>
          <input
            id="top-up-amount"
            type="number"
            min={minimumAmount}
            step="1000"
            placeholder="Contoh: 50.000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
            required
            className="w-full px-3 py-2.5 text-sm text-gray-900 focus:outline-none placeholder:text-gray-500"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-3 rounded-lg transition-all disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Memproses...
          </>
        ) : (
          <>
            <PlusCircle className="w-4 h-4" />
            Konfirmasi Top Up Saldo
          </>
        )}
      </button>
    </form>
  );
}
