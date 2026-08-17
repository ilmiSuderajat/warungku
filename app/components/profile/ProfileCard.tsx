// components/produk/CardProduk.tsx
import { Profile } from "@/src/viewmodels/data/profile";
export default function ProfileHeader({ data }: { data: Profile }) {
  return (
    <div className="w-full bg-indigo-600 rounded-b-lg  hover:shadow-md transition-shadow p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-center gap-5">
      {/* Area Foto Profil */}
      <div className="relative shrink-0">
        <img
          src={
            data?.image_url ||
            `https://ui-avatars.com/api/?name=${data?.nama || "User"}&background=F3F4F6&color=374151`
          }
          alt={`Profil ${data?.nama}`}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm"
        />
        {/* Indikator Verifikasi (Opsional untuk E-commerce) */}
        <div
          className="absolute bottom-1 right-1 bg-green-500 border-2 border-white rounded-full p-1"
          title="Akun Terverifikasi"
        >
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      {/* Area Informasi Akun */}
      <div className="flex-1 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-50 mb-1">
          {data?.nama || "Nama Pengguna"}
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 mt-2">
          {/* Nomor HP */}
          <span className="flex items-center justify-center sm:justify-start text-gray-50 gap-1.5 px-1 mr-5">
            <svg
              className="w-4 h-4 text-gray-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            {data?.no_hp || "Belum ada no. HP"}
          </span>

          {/* Garis Pemisah (Sembunyi di mobile, tampil di desktop) */}
          <span className="hidden sm:inline-block text-gray-300">|</span>

          {/* ID Pelanggan */}
          <span className="flex items-center justify-center sm:justify-start gap-1.5 text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
            ID Pelanggan:{" "}
            <span className="font-mono text-xs font-semibold text-gray-700">
              {data?.id || "---"}
            </span>
          </span>
        </div>
      </div>

      {/* Area Tombol Aksi */}
      <div className="mt-4 sm:mt-0 w-full sm:w-auto">
        <button className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-transparent rounded-lg transition-colors flex items-center justify-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          Edit Profil
        </button>
      </div>
    </div>
  );
}
