import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  History,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowDownLeft,
  Store,
  CreditCard,
  Wallet,
} from "lucide-react";

function formatRupiah(angka: number | null) {
  return new Intl.NumberFormat("id-ID").format(angka ?? 0);
}

function formatDate(dateString: string | null) {
  if (!dateString) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

function getStatusBadge(status: string | null) {
  const s = status?.toLowerCase() ?? "";
  switch (s) {
    case "success":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="w-3 h-3" />
          Berhasil
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    case "failed":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
          <XCircle className="w-3 h-3" />
          Gagal
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
          {status ?? "-"}
        </span>
      );
  }
}

function getTransactionMeta(type: string | null) {
  const t = type?.toLowerCase() ?? "";
  if (t === "topup") {
    return {
      label: "Top Up Saldo",
      icon: ArrowDownLeft,
      iconBg: "bg-emerald-100 text-emerald-700",
      amountColor: "text-emerald-700",
      prefix: "+",
    };
  }
  if (t === "penjualan") {
    return {
      label: "Hasil Penjualan Toko",
      icon: Store,
      iconBg: "bg-emerald-100 text-emerald-700",
      amountColor: "text-emerald-700",
      prefix: "+",
    };
  }
  if (t === "withdrawal") {
    return {
      label: "Penarikan Saldo",
      icon: Wallet,
      iconBg: "bg-amber-100 text-amber-700",
      amountColor: "text-red-600",
      prefix: "-",
    };
  }
  return {
    label: "Pembayaran Pesanan",
    icon: CreditCard,
    iconBg: "bg-indigo-100 text-indigo-600",
    amountColor: "text-red-600",
    prefix: "-",
  };
}

export default async function TransactionPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Ambil data wallet user terlebih dahulu
  const { data: wallet } = await supabase
    .from("wallets")
    .select("id")
    .eq("user_id", user.id)
    .single();

  let transactions: any[] = [];
  let fetchError = null;

  if (wallet?.id) {
    const { data, error } = await supabase
      .from("wallet_transactions")
      .select("*")
      .eq("wallet_id", wallet.id)
      .order("created_at", { ascending: false });

    transactions = data ?? [];
    fetchError = error?.message;
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Header Banner */}
      <div className="bg-indigo-600 text-white p-5 sm:p-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <Link
            href="/wallet"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-100 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Wallet
          </Link>
          <div className="flex items-center gap-2">
            <History className="w-6 h-6" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Riwayat Transaksi
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-indigo-100">
            Daftar lengkap seluruh transaksi dompet digital Anda.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-4 space-y-4">
        {fetchError && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
            Gagal memuat transaksi: {fetchError}
          </div>
        )}

        {transactions.length === 0 ? (
          <div className="bg-white/95 shadow-lg rounded-lg border border-gray-100 p-5 text-center space-y-4 my-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-500">
              <History className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Belum Ada Transaksi
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
                Riwayat transaksi wallet Anda akan tercatat secara otomatis di halaman ini.
              </p>
            </div>
            <div>
              <Link
                href="/wallet"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-lg transition-all"
              >
                Top Up Sekarang
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white/95 shadow-lg rounded-lg border border-gray-100 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h2 className="text-sm font-bold text-gray-900">
                Semua Transaksi ({transactions.length})
              </h2>
            </div>

            <ul className="space-y-1 divide-y divide-gray-200">
              {transactions.map((tx) => {
                const meta = getTransactionMeta(tx.type);
                const IconComponent = meta.icon;
                const amount = tx.amount ?? 0;

                return (
                  <li
                    key={tx.id}
                    className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${meta.iconBg}`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {meta.label}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {tx.reference_id
                            ? `Ref: ${tx.reference_id}`
                            : "Tanpa Ref"}{" "}
                          • {formatDate(tx.created_at)}
                        </p>

                        {/* Tampilkan Komisi jika ada */}
                        {tx.komisi && tx.komisi > 0 ? (
                          <p className="text-xs text-gray-500">
                            Potongan komisi: Rp {formatRupiah(tx.komisi)}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="shrink-0 text-right space-y-1">
                      <p className={`text-sm font-bold ${meta.amountColor}`}>
                        {meta.prefix} Rp {formatRupiah(Math.abs(amount))}
                      </p>
                      <div>{getStatusBadge(tx.status)}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}