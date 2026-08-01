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

function getInitial(email?: string) {
  return email?.trim().charAt(0).toUpperCase() || "U";
}

function StatusBadge({ status }: { status: string | null }) {
  const normalizedStatus = status?.toLowerCase() ?? "unknown";
  const className =
    normalizedStatus === "success"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/15"
      : normalizedStatus === "pending"
        ? "bg-amber-50 text-amber-700 ring-amber-600/15"
        : "bg-slate-100 text-slate-600 ring-slate-600/10";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${className}`}
    >
      {status ?? "Unknown"}
    </span>
  );
}

function TransactionRow({ transaction }: { transaction: WalletTransaction }) {
  const amount = transaction.amount ?? 0;
  const isIncome = amount >= 0 || transaction.type?.toLowerCase() === "topup";

  return (
    <li className="flex items-center justify-between gap-4 border-b border-slate-100 py-4 last:border-0">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-950">
          {transaction.type ?? "Transaksi wallet"}
        </p>
        <p className="mt-1 truncate text-xs text-slate-500">
          {transaction.reference_id ?? "Tanpa referensi"} -{" "}
          {formatTransactionDate(transaction.created_at)}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p
          className={`text-sm font-bold ${
            isIncome ? "text-emerald-700" : "text-rose-700"
          }`}
        >
          {formatCurrency(amount)}
        </p>
        <div className="mt-1">
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

  const viewModel = await getWalletViewModel(user, 8); // Limit transaksi terbaru yang ditampilkan
  const walletId = viewModel.wallet?.id;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-full bg-slate-950 text-sm font-bold text-white">
              {getInitial(viewModel.user.email)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Warungku Wallet
              </p>
              <h1 className="truncate text-xl font-bold text-slate-950">
                {viewModel.user.email}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/wallet/transaction"
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
            >
              Riwayat
            </Link>
            <LogoutButton />
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Saldo tersedia
                </p>
                <p className="mt-3 text-4xl font-bold tracking-normal text-slate-950 sm:text-5xl">
                  {viewModel.balanceLabel}
                </p>
                <p className="mt-3 text-sm text-slate-500">
                  Update terakhir: {viewModel.lastTransactionLabel}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 md:w-64">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Wallet ID
                </p>
                <p className="mt-2 break-all font-mono text-xs text-slate-700">
                  {walletId ?? "Wallet belum tersedia"}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Status
                </p>
                <p className="mt-2 text-sm font-semibold text-emerald-700">
                  Aktif
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Bergabung
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {viewModel.joinedLabel}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Transaksi tampil
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {viewModel.transactions.length} terbaru
                </p>
              </div>
            </div>
          </section>

          <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-950">Top up saldo</h2>
              <p className="mt-1 text-sm text-slate-500">
                Masukkan nominal yang ingin ditambahkan ke wallet.
              </p>
            </div>
            {walletId ? (
              <TopUpForm walletId={walletId} />
            ) : (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Wallet belum ditemukan untuk akun ini.
              </div>
            )}
          </aside>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Transaksi terbaru
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Aktivitas wallet yang paling baru tercatat.
              </p>
            </div>
            <Link
              href="/wallet/transaction"
              className="text-sm font-semibold text-slate-700 underline-offset-4 hover:underline"
            >
              Lihat semua
            </Link>
          </div>

          {viewModel.transactionsError ? (
            <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Transaksi belum bisa dimuat: {viewModel.transactionsError}
            </div>
          ) : viewModel.transactions.length > 0 ? (
            <ul className="mt-3 divide-y divide-slate-100">
              {viewModel.transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </ul>
          ) : (
            <div className="mt-5 rounded-lg border border-dashed border-slate-300 p-8 text-center">
              <p className="text-sm font-semibold text-slate-700">
                Belum ada transaksi
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Setelah top up atau pembayaran berhasil, riwayat akan muncul di
                sini.
              </p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
