// file: @/app/alamat/page.tsx
import { listAlamat } from "./server";
import AlamatCard from "@/app/components/alamat/AlamatCard";

export default async function AlamatPage() {
  // Ambil data dari server (Supabase)
  const dataAlamat = await listAlamat();

  // Lempar data ke komponen UI (Client)
  return (
    <div className="bg-gray-50/80 w-full">
      <AlamatCard data={dataAlamat} />;
    </div>
  );
}
