import { SupabaseClient } from "@supabase/supabase-js";

export async function getAlamatList(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("alamat")
    .select("*")
    .eq("user_id", userId)
    .order("is_utama", { ascending: false })
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function tambahAlamat(
  supabase: SupabaseClient,
  userId: string,
  label: string,
  alamatLengkap: string,
  isUtama: boolean,
  koordinat: { lat: number; lng: number } | null,
) {
  // Kalau alamat baru ditandai utama, alamat lama yang utama perlu di-nonaktifkan dulu
  if (isUtama) {
    await supabase
      .from("alamat")
      .update({ is_utama: false })
      .eq("user_id", userId)
      .eq("is_utama", true);
  }

  // Siapkan data yang akan di-insert
  const payload: any = {
    user_id: userId,
    label,
    alamat_lengkap: alamatLengkap,
    is_utama: isUtama,
  };

  // Jika koordinat ada (user mengklik peta), masukkan ke payload
  if (koordinat) {
    payload.latitude = koordinat.lat;
    payload.longitude = koordinat.lng;
  }

  const { data, error } = await supabase
    .from("alamat")
    .insert(payload)
    .select();

  return { data, error };
}

export async function setAlamatUtama(
  supabase: SupabaseClient,
  userId: string,
  alamatId: string,
) {
  // Setel semua alamat user menjadi non-utama lebih dulu
  await supabase
    .from("alamat")
    .update({ is_utama: false })
    .eq("user_id", userId);

  // Setel alamat pilihan menjadi utama
  const { data, error } = await supabase
    .from("alamat")
    .update({ is_utama: true })
    .eq("id", alamatId)
    .eq("user_id", userId)
    .select();

  return { data, error };
}

export async function hapusAlamat(
  supabase: SupabaseClient,
  userId: string,
  alamatId: string,
) {
  const { error } = await supabase
    .from("alamat")
    .delete()
    .eq("id", alamatId)
    .eq("user_id", userId);

  return { error };
}

