import { SupabaseClient } from "@supabase/supabase-js";

export async function getTokoMitra(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("toko_mitra")
    .select("id, is_buka")
    .eq("pemilik_id", userId)
    .single();
  return data;
}
export async function getPendapatanHariIni(
  supabase: SupabaseClient,
  userId: string,
) {
  const hariIni = new Date().toISOString().split("T")[0];

  const { data: wallet } = await supabase
    .from("wallets")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (!wallet) return 0;

  const { data } = await supabase
    .from("wallet_transactions")
    .select("amount")
    .eq("wallet_id", wallet.id)
    .eq("type", "payment")
    .eq("status", "success")
    .gte("created_at", `${hariIni}T00:00:00`)
    .lte("created_at", `${hariIni}T23:59:59`);

  return data?.reduce((total, row) => total + row.amount, 0) ?? 0;
}
export async function getPesananAktif(
  supabase: SupabaseClient,
  tokoId: string,
) {
  const { count } = await supabase
    .from("pesanan")
    .select("*", { count: "exact", head: true })
    .eq("toko_id", tokoId)
    .in("status", ["baru", "diproses", "siap_diambil"]);

  return count ?? 0;
}
