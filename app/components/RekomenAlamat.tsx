"use client";
import { createClient } from "@/utils/supabase/client";
import { getSemuaLokasi } from "../alamat/viewModel";
import { useState, useEffect } from "react";
export default function RekomenAlamat() {
  const [lokasiList, setLokasiList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const supabase = createClient();
  // 2. Buat fungsi untuk memanggil data
  const muatDataLokasi = async () => {
    setIsLoading(true);

    // Panggil fungsi getSemuaLokasi
    const { data, error } = await getSemuaLokasi(supabase);

    if (error) {
      setErrorMsg("Gagal memuat data dari database.");
    } else {
      setLokasiList(data || []);
    }

    setIsLoading(false);
  };

  // 3. Gunakan useEffect agar data diambil otomatis saat komponen pertama kali muncul di layar
  useEffect(() => {
    muatDataLokasi();
  }, []);

  // 4. Tampilan saat loading
  if (isLoading) return <div className="p-4 text-gray-500">Memuat data...</div>;

  // 5. Tampilan saat error
  if (errorMsg) return <div className="p-4 text-red-500">{errorMsg}</div>;
  return (
    <div className="w-full bg-white/90 text-slate-500 flex flex-col">
      <p>Rekomendasi Lokasi</p>
      <div>
        {lokasiList && lokasiList.length > 0 ? (
          <ul className="space-y-2">
            {lokasiList.map((lokasi) => (
              <li key={lokasi.id} className="p-2 border rounded shadow-sm">
                {lokasi.nama_lokasi}
              </li>
            ))}
          </ul>
        ) : (
          <p>Tidak ada data lokasi ditemukan.</p>
        )}
      </div>
    </div>
  );
}
