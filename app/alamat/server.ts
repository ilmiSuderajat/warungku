import { createClient } from "@/utils/supabase/server";
import type { Alamat } from "./viewModel";

export async function listAlamat(): Promise<Alamat[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("alamat")
    .select("*")
    .eq("user_id", user.id)
    .order("is_utama", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.log("gagal mengambil data Alamat :", error.message);
    return [];
  }

  return data || [];
}
