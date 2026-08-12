import { createClient } from "@/utils/supabase/server";
import type { User } from "@supabase/supabase-js";

export type Wallet = {
  id: string;
  balance: number | null;
  user_id: string;
  created_at?: string | null;
  updated_at?: string | null;
};

export type WalletTransaction = {
  id: string;
  type: string | null;
  amount: number | null;
  status: string | null;
  reference_id: string | null;
  created_at: string | null;
  jumlah_kotor?: number | null;
  komisi?: number | null;
};

export type WalletViewModel = {
  user: User;
  wallet: Wallet | null;
  transactions: WalletTransaction[];
  balanceLabel: string;
  joinedLabel: string;
  lastTransactionLabel: string;
  transactionsError: string | null;
};

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatCurrency(value: number | null | undefined) {
  return currencyFormatter.format(value ?? 0);
}

export function formatTransactionDate(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  return dateTimeFormatter.format(new Date(value));
}

export async function getWalletViewModel(
  user: User,
  limitTransactions: number = 8
): Promise<WalletViewModel> {
  const supabase = await createClient();

  const { data: wallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", user.id)
    .single<Wallet>();

  let transactions: WalletTransaction[] = [];
  let transactionsError: string | null = null;

  if (wallet?.id) {
    const { data, error } = await supabase
      .from("wallet_transactions")
      .select("id,type,amount,status,reference_id,created_at,jumlah_kotor,komisi")
      .eq("wallet_id", wallet.id)
      .order("created_at", { ascending: false })
      .limit(limitTransactions)
      .returns<WalletTransaction[]>();

    transactions = data ?? [];
    transactionsError = error?.message ?? null;
  }

  const lastTransaction = transactions[0];

  return {
    user,
    wallet,
    transactions,
    balanceLabel: formatCurrency(wallet?.balance),
    joinedLabel: user.created_at ? formatTransactionDate(user.created_at) : "-",
    lastTransactionLabel: lastTransaction
      ? formatTransactionDate(lastTransaction.created_at)
      : "Belum ada transaksi",
    transactionsError,
  };
}
