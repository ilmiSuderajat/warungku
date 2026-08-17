import { getProfile } from "@/src/viewmodels/data/profile";
import ProfileCard from "@/app/components/profile/ProfileCard";
import ItemList from "@/app/components/profile/ItemList";

export default async function ProfilPage() {
  const dataProfile = await getProfile();

  // Guard Clause: Cegah error jika dataProfile ternyata kosong/null
  // (Misal user baru daftar dan belum punya data di tabel profiles)
  if (
    !dataProfile ||
    (Array.isArray(dataProfile) && dataProfile.length === 0)
  ) {
    return (
      <div className="w-full min-h-screen bg-gray-50/80 text-black flex justify-center items-center">
        <p>Data profil belum tersedia.</p>
      </div>
    );
  }

  // Jika getProfile mengembalikan array (karena kamu tidak pakai .single() di Supabase),
  // kita ambil data pertama saja menggunakan [0].
  // Jika getProfile mengembalikan object tunggal, kita langsung pakai dataProfile.
  const profilYangAkanDitampilkan = Array.isArray(dataProfile)
    ? dataProfile[0]
    : dataProfile;

  return (
    <div className=" bg-gray-50/90 ">
      <ProfileCard data={profilYangAkanDitampilkan} />
      <ItemList />
    </div>
  );
}
