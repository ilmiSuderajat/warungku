"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react"; // Tambahkan useState
import { tambahAlamat } from "@/app/alamat/viewModel";
import { createClient } from "@/utils/supabase/client";
import InteractiveMap from "./InteraktiveMap";
import { toast } from "sonner"; // Import sonner
import { Loader2 } from "lucide-react"; // Import ikon loading
import { useRouter } from "next/navigation";
import { MoveLeft } from "lucide-react";
interface FormAlamatBaruProps {
  userId: string;
  defaultCenter: { lat: number; lng: number };
}

type FormAlamat = {
  label: string;
  alamatLengkap: string;
  namaLokasi: string;
  isUtama: boolean;
  lat: number;
  lng: number;
  namaPenerima: string;
  noHp: string;
  intruksiKhusus: string;
  detailIntruksi: string;
};

export default function FormAlamatBaru({
  userId,
  defaultCenter,
}: FormAlamatBaruProps) {
  const router = useRouter();
  const supabase = createClient();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormAlamat>();

  // STATE UNTUK LOADING
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    register("lat", { required: "Silakan pilih lokasi di peta" });
    register("lng", { required: "Silakan pilih lokasi di peta" });
  }, [register]);

  const onSubmit = async (data: FormAlamat) => {
    setIsSubmitting(true); // Mulai loading
    const loadingToast = toast.loading("Menyimpan alamat..."); // Toast loading berjalan

    try {
      const { error } = await tambahAlamat(
        supabase,
        userId,
        data.label,
        data.alamatLengkap,
        data.namaLokasi,
        data.isUtama,
        { lat: data.lat, lng: data.lng },
        data.namaPenerima,
        data.noHp,
        data.intruksiKhusus,
        data.detailIntruksi,
      );

      if (error) {
        console.error(error);
        toast.error("Gagal menyimpan alamat", { id: loadingToast }); // Ubah loading toast jadi error
      } else {
        toast.success("Alamat berhasil disimpan!", { id: loadingToast }); // Ubah loading toast jadi success
        setTimeout(() => {
          router.push("/alamat");
        }, 1000);
        // Opsional: Anda bisa menambahkan fungsi di sini untuk kembali ke halaman sebelumnya
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan sistem", { id: loadingToast });
    } finally {
      setIsSubmitting(false); // Matikan loading di tombol
    }
  };

  return (
    <div className="bg-[#f2f2f4]  min-h-screen relative font-sans text-gray-800 max-w-md mx-auto shadow-xl overflow-y-auto">
      <div className="w-full bg-white/90 shadow-md sticky top-0 z-50">
        <div className="flex  items-center gap-14 px-4 py-3 md:px-6 max-w-7xl mx-auto h-16 md:h-20">
          <MoveLeft
            onClick={() => router.back()}
            className="w-8 h-10 text-indigo-600 transition-transform duration-100 ease-in-out active:scale-80"
          />
          <h1 className="text-slate-700 text-xl ">Tambah Alamat Baru</h1>
        </div>
      </div>
      <form
        id="addressForm"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 p-1 pb-28"
      >
        {/* Seksi Peta & Info Lokasi */}
        <div className="bg-white w-full rounded-xl overflow-hidden border border-gray-100">
          <div className="h-[35dvh] relative w-full bg-gray-200">
            <InteractiveMap
              defaultCenter={defaultCenter} // Menggunakan props dari parent sesuai kode asli
              onLocationChange={(coords) => {
                setValue("lat", coords.lat, { shouldValidate: true });
                setValue("lng", coords.lng, { shouldValidate: true });
              }}
            />
          </div>

          <div className="p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between cursor-pointer active:bg-gray-50 gap-2">
              <div className="flex gap-3 items-start w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-500 mt-0.5 shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="w-full">
                  <input
                    className="font-bold text-gray-800 w-full outline-none bg-transparent placeholder-gray-400"
                    placeholder="Nama Lokasi (Cth: RT.1/RW.4)"
                    {...register("namaLokasi", { required: true })}
                  />
                  {errors.namaLokasi && (
                    <p className="text-red-500 text-[10px] mt-1">
                      Nama lokasi wajib diisi
                    </p>
                  )}
                  {/* Teks statis ini bisa Anda ganti menjadi dinamis jika ada data kecamatan/desa dari Maps API */}
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                    Area lokasi yang dipilih
                  </p>
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {(errors.lat || errors.lng) && (
              <p className="text-red-500 text-xs pb-1">
                Titik koordinat wajib dipilih di peta
              </p>
            )}
          </div>
        </div>

        {/* Seksi Detail Form */}
        <div className="bg-white rounded-xl p-4 space-y-6 border border-gray-100">
          {/* Rincian Alamat */}
          <div>
            <input
              className="w-full text-sm outline-none border-b border-gray-200 pb-2 focus:border-gray-400 transition-colors"
              placeholder="Rincian Alamat (Cth. Blok, No. Rumah, Patokan)"
              {...register("alamatLengkap", { required: "Alamat wajib diisi" })}
            />
            {errors.alamatLengkap && (
              <p className="text-red-500 text-xs mt-1">
                {errors.alamatLengkap.message}
              </p>
            )}
          </div>

          {/* Alert Kuning */}
          <div className="bg-[#fff8e6] text-[#856404] text-xs p-3 rounded-md leading-relaxed">
            Masukkan No. Rumah (jika ada), agar Driver bisa mengantarkan pesanan
            dengan mudah
          </div>

          {/* Nama Lengkap */}
          <div>
            <input
              className={`w-full text-sm outline-none border-b pb-2 transition-colors ${
                errors.namaPenerima
                  ? "border-red-500 placeholder-red-400 text-red-500"
                  : "border-gray-200 focus:border-gray-400"
              }`}
              placeholder="Masukkan Nama Lengkap *"
              {...register("namaPenerima", {
                required: "Mohon masukkan nama lengkap",
              })}
            />
            {errors.namaPenerima && (
              <p className="text-red-500 text-xs mt-1">
                {errors.namaPenerima.message}
              </p>
            )}
          </div>

          {/* No Handphone */}
          <div>
            <label className="text-xs text-gray-500 flex items-center gap-1">
              No. Handphone <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className={`w-full text-sm outline-none border-b pb-2 mt-2 transition-colors ${
                errors.noHp
                  ? "border-red-500 text-red-500"
                  : "border-gray-200 focus:border-gray-400"
              }`}
              placeholder="Contoh: 628123456789"
              {...register("noHp", {
                required: "Nomor HP wajib diisi",
                valueAsNumber: true,
              })}
            />
            {errors.noHp && (
              <p className="text-red-500 text-xs mt-1">{errors.noHp.message}</p>
            )}
          </div>
        </div>

        {/* Seksi Instruksi Khusus */}
        <div className="bg-white rounded-xl p-4 space-y-4 border border-gray-100 relative">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-gray-800">
              Tambahkan instruksi khusus
            </h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div className="flex gap-3">
            <label className="flex-1">
              <input
                type="radio"
                value="Tinggalkan di pintu"
                className="peer sr-only"
                {...register("intruksiKhusus")}
              />
              <div className="py-2.5 px-2 rounded-lg bg-[#f7f9fa] text-center text-sm text-gray-700 peer-checked:bg-orange-50 peer-checked:text-orange-600 peer-checked:border-orange-200 border border-transparent cursor-pointer transition-all">
                Tinggalkan di pintu
              </div>
            </label>
            <label className="flex-1">
              <input
                type="radio"
                value="Serahkan ke saya"
                className="peer sr-only"
                {...register("intruksiKhusus")}
              />
              <div className="py-2.5 px-2 rounded-lg bg-[#f7f9fa] text-center text-sm text-gray-700 peer-checked:bg-orange-50 peer-checked:text-orange-600 peer-checked:border-orange-200 border border-transparent cursor-pointer transition-all">
                Serahkan ke saya
              </div>
            </label>
          </div>

          <textarea
            className="w-full bg-[#f7f9fa] rounded-lg p-3 text-sm outline-none border border-transparent focus:border-gray-300 resize-none placeholder-gray-400"
            rows={3}
            placeholder="Contoh: Titip di pos satpam, gunakan lift servis, atau hubungi saat sudah sampai"
            {...register("detailIntruksi")}
          ></textarea>

          {/* Dummy Button Foto (Opsional, jika Anda belum mengimplementasikan upload foto) */}
          <button
            type="button"
            className="w-16 h-16 border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-[10px]">Foto</span>
          </button>
        </div>

        {/* Seksi Ekstra (Label & Alamat Utama) */}
        <div className="bg-white rounded-xl  p-4 space-y-4 border border-gray-100">
          <div>
            <input
              className="w-full text-sm outline-none border-b border-gray-200 pb-2 focus:border-gray-400"
              placeholder="Label (Contoh: Rumah / Kantor)"
              {...register("label", { required: "Label wajib diisi" })}
            />
            {errors.label && (
              <p className="text-red-500 text-xs mt-1">
                {errors.label.message}
              </p>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 accent-orange-500 rounded"
              {...register("isUtama")}
            />
            Jadikan alamat utama
          </label>
        </div>
      </form>

      {/* Footer Fixed Bar (Konfirmasi) - Harus berada diluar tag <form> */}
      <div className="fixed bottom-0 max-w-md w-full bg-white p-3 border-t border-gray-100 z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.03)]">
        <button
          type="submit"
          form="addressForm"
          disabled={isSubmitting} // Nonaktifkan tombol saat loading
          className="w-full bg-indigo-600 hover:to-blue-400 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform duration-100 ease-in-out active:scale-95"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Konfirmasi"
          )}
        </button>
      </div>
    </div>
  );
}
