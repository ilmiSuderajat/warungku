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
  namaLokasi: string,
  isUtama: boolean,
  koordinat: { lat: number; lng: number },
) {
  const { data, error } = await supabase.rpc("simpan_alamat_dan_sumbang", {
    p_user_id: userId,
    p_label: label,
    p_nama_alamat: namaLokasi,   // ini yang disumbang ke lokasi_referensi
    p_alamat_lengkap: alamatLengkap,
    p_is_utama: isUtama,
    p_lat: koordinat.lat,
    p_lng: koordinat.lng,
  });

  return { data, error };
}

export async function setAlamatUtama(
  supabase: SupabaseClient,
  userId: string,
  alamatId: string,
) {
  await supabase
    .from("alamat")
    .update({ is_utama: false })
    .eq("user_id", userId);

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

export async function cariLokasiTerdekat(
  supabase: SupabaseClient,
  lat: number,
  lng: number,
) {
  const { data, error } = await supabase.rpc("cari_lokasi_terdekat", {
    p_lat: lat,
    p_lng: lng,
  });

  return { data: data ?? [], error };
}