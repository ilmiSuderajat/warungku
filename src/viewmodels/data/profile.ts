import { createClient } from "@/utils/supabase/server";

export type Profile = {
  id: string;
  nama: string;
  no_hp: string;
  image_url: string;
};

export async function getProfile(): Promise<Profile[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // WAJIB ADA: Cek apakah user sedang login. Jika tidak, kembalikan array kosong.
  if (!user) return [];

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single(); // PERBAIKAN: Gunakan user.id, bukan user

  if (error) {
    console.log("gagal mengambil data profile :", error.message);
    return [];
  }

  return data || [];
}
