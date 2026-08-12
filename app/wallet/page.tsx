import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/app/components/LogoutButton";
import TopUpForm from "@/app/components/TopUpForm";
import { createClient } from "@/utils/supabase/server";
import {
  formatCurrency,
  formatTransactionDate,
  getWalletViewModel,
  type WalletTransaction,
} from "./wallet.viewmodel";
import {
  Wallet as WalletIcon,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  PlusCircle,
  ShieldCheck,
  CreditCard,
  Store,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
} from "lucide-react";

function getInitial(email?: string) {
  return email?.trim().charAt(0).toUpperCase() || "U";
}

function StatusBadge({ status }: { status: string | null }) {
  const normalizedStatus = status?.toLowerCase() ?? "unknown";
  switch (normalizedStatus) {
    case "success":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="w-3 h-3" />
          Berhasil
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    case "failed":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">
          <XCircle className="w-3 h-3" />
          Gagal
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
          {status ?? "Unknown"}
        </span>
      );
  }
}

function getTransactionMeta(type: string | null, amount: number) {
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
      label: "Hasil Penjualan",
      icon: Store,
      iconBg: "bg-emerald-100 text-emerald-700",
      amountColor: "text-emerald-700",
      prefix: "+",
    };
  }
  if (t === "withdrawal") {
    return {
      label: "Penarikan Saldo",
      icon: WalletIcon,
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

function TransactionRow({ transaction }: { transaction: WalletTransaction }) {
  const amount = transaction.amount ?? 0;
  const meta = getTransactionMeta(transaction.type, amount);
  const IconComponent = meta.icon;

  return (
    <li className="flex items-center justify-between gap-3 py-3 border-b border-gray-200 last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${meta.iconBg}`}
        >
          <IconComponent className="w-4 h-4" />
        </div>
        <div className="min-w-0 space-y-0.5">
          <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
            {meta.label}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {formatTransactionDate(transaction.created_at)}
          </p>
        </div>
      </div>

      <div className="shrink-0 text-right space-y-1">
        <p className={`text-xs sm:text-sm font-bold ${meta.amountColor}`}>
          {meta.prefix} {formatCurrency(Math.abs(amount))}
        </p>
        <div>
          <StatusBadge status={transaction.status} />
        </div>
      </div>
    </li>
  );
}

export default async function WalletPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const viewModel = await getWalletViewModel(user, 5);
  const walletId = viewModel.wallet?.id;

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {/* User Profile Bar */}
        <header className="bg-white shadow-lg rounded-lg border border-gray-100 p-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
              {getInitial(viewModel.user.email)}
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-gray-500">
                  E-Wallet WarungKita
                </p>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                  <ShieldCheck className="w-3 h-3" />
                  Aktif
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-gray-900 truncate">
                {viewModel.user.email}
              </h1>
            </div>
          </div>

          <div className="shrink-0">
            <LogoutButton />
          </div>
        </header>

        {/* Saldo Hero Card (Solid Indigo, No Gradient, No Backdrop Blur) */}
        <section className="bg-indigo-600 text-white shadow-lg rounded-lg p-5 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-indigo-100 text-xs font-medium">
              <span>Saldo Utama</span>
              <span>ID: {walletId ? `${walletId.slice(0, 8)}...` : "-"}</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight">
              {viewModel.balanceLabel}
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-indigo-500">
            <a
              href="#topup-section"
              className="flex flex-col items-center gap-1 p-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 transition-all text-center"
            >
              <div className="w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center">
                <PlusCircle className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-white">Top Up</span>
            </a>

            <Link
              href="/wallet/transaction"
              className="flex flex-col items-center gap-1 p-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 transition-all text-center"
            >
              <div className="w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-white">Transfer</span>
            </Link>

            <Link
              href="/mitra"
              className="flex flex-col items-center gap-1 p-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 transition-all text-center"
            >
              <div className="w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-white">Tarik</span>
            </Link>

            <Link
              href="/wallet/transaction"
              className="flex flex-col items-center gap-1 p-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 transition-all text-center"
            >
              <div className="w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center">
                <History className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-white">Riwayat</span>
            </Link>
          </div>
        </section>

        {/* Section Top Up Saldo Component */}
        <section
          id="topup-section"
          className="bg-white shadow-lg rounded-lg border border-gray-100 p-5 space-y-4"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                Top Up Saldo
              </h2>
              <p className="text-xs text-gray-500">
                Pilih nominal cepat atau ketik nominal top up Anda.
              </p>
            </div>
          </div>

          {walletId ? (
            <TopUpForm walletId={walletId} />
          ) : (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
              Wallet belum tersedia untuk akun ini.
            </div>
          )}
        </section>

        {/* Section Riwayat Transaksi Component */}
        <section className="bg-white shadow-lg rounded-lg border border-gray-100 p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900">
                  Riwayat Transaksi
                </h2>
                <p className="text-xs text-gray-500">
                  5 aktivitas dompet terbaru.
                </p>
              </div>
            </div>

            <Link
              href="/wallet/transaction"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
            >
              Lihat Semua
            </Link>
          </div>

          {viewModel.transactionsError ? (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
              Gagal memuat transaksi: {viewModel.transactionsError}
            </div>
          ) : viewModel.transactions.length > 0 ? (
            <ul className="space-y-1">
              {viewModel.transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </ul>
          ) : (
            <div className="p-6 rounded-lg border border-dashed border-gray-200 text-center space-y-2">
              <WalletIcon className="w-8 h-8 text-gray-500 mx-auto" />
              <p className="text-xs sm:text-sm font-bold text-gray-900">
                Belum Ada Transaksi
              </p>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Riwayat transaksi wallet Anda akan otomatis muncul di sini.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
