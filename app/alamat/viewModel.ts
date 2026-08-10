import { SupabaseClient } from "@supabase/supabase-js";

export async function getAlamatList(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("alamat")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function tambahAlamat(
  supabase: SupabaseClient,
  userId: string,
  label: string,
  alamatLengkap: string,
  isUtama: boolean,
) {
  // Kalau alamat baru ditandai utama, alamat lama yang utama perlu di-nonaktifkan dulu
  if (isUtama) {
    await supabase
      .from("alamat")
      .update({ is_utama: false })
      .eq("user_id", userId)
      .eq("is_utama", true);
  }

  const { data, error } = await supabase
    .from("alamat")
    .insert({
      user_id: userId,
      label,
      alamat_lengkap: alamatLengkap,
      is_utama: isUtama,
    })
    .select();

  return { data, error };
}
