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
  namaPenerima: string,
  noHp: string,
  intruksiKhusus: string,
  detailIntruksi: String,
) {
  const { data, error } = await supabase.rpc("simpan_alamat_dan_sumbang", {
    p_user_id: userId,
    p_label: label,
    p_nama_alamat: namaLokasi, // ini yang disumbang ke lokasi_referensi
    p_alamat_lengkap: alamatLengkap,
    p_is_utama: isUtama,
    p_lat: koordinat.lat,
    p_lng: koordinat.lng,
    p_nama_penerima: namaPenerima,
    p_no_hp: noHp,
    p_intruksi_khusus: intruksiKhusus,
    p_detail_intruksi: detailIntruksi,
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

export async function getSemuaLokasi(supabase: SupabaseClient) {
  // Hanya melakukan select semua data
  const { data, error } = await supabase
    .from("lokasi_referensi")
    .select("id, nama_lokasi");

  // Opsional: cetak pesan jika error untuk memudahkan proses debug
  if (error) {
    console.error("Error mengambil semua lokasi:", error.message);
  }

  return { data, error };
}

export type Alamat = {
  id: string;
  user_id: string;
  label: string;
  alamat_lengkap: string;
  latitude: number;
  longitude: number;
  is_utama: boolean;
  created_at: string;
  nama_penerima: string;
  no_hp: string;
  intruksi_khusus: string;
  detail_intruksi: string;
};
