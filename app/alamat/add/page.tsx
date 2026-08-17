import { createClient } from "@/utils/supabase/server";
import FormAlamatBaru from "@/app/components/pemetaan/TambahAlamatBaru";

export default async function AlamatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Siapkan koordinat fallback (misal: Jakarta Pusat)
  let initialCenter = { lat: -6.2, lng: 106.816666 };

  // 2. Jika user login, cari alamat utamanya
  if (user) {
    const { data: alamatUtama, error } = await supabase
      .from("alamat")
      .select("latitude, longitude")
      .eq("user_id", user.id)
      .eq("is_utama", true)
      .single(); // Ambil satu data saja

    if (!error && alamatUtama?.latitude && alamatUtama?.longitude) {
      // Ubah dari numeric/string database menjadi Number agar dibaca benar oleh Google Maps
      initialCenter = {
        lat: Number(alamatUtama.latitude),
        lng: Number(alamatUtama.longitude),
      };
    }
  }

  // 3. Render komponen Client dan lempar koordinatnya sebagai props
  return (
    <div className="bg-gray-50/90  ">
      <div className="">
        <FormAlamatBaru userId={user?.id || ""} defaultCenter={initialCenter} />
      </div>
    </div>
  );
}
