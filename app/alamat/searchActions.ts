// app/lokasi/actions.ts
"use server"; // Wajib ada untuk menandakan ini adalah Server Action

// Import createClient dari utility Supabase server-mu
// (Sesuaikan path-nya dengan struktur folder Next.js milikmu)
import { createClient } from "@/utils/supabase/server";

type Lokasi = {
  id: string;
  nama_lokasi: string;
};

// Fungsi ini akan dipanggil dari Client, tapi dieksekusi di Server
export async function searchLokasi(keyword: string): Promise<Lokasi[]> {
  if (!keyword.trim()) return [];

  // Inisialisasi client Supabase khusus server (aman memanggil await di sini)
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lokasi_referensi")
    .select("id, nama_lokasi")
    .ilike("nama_lokasi", `%${keyword}%`)
    .limit(7);

  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }

  return data ?? [];
}
