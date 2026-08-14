"use client";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { tambahAlamat } from "@/app/alamat/viewModel";
import { createClient } from "@/utils/supabase/client";
import InteractiveMap from "./InteraktiveMap";

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
  const supabase = createClient();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormAlamat>();

  // Daftarkan lat/lng tanpa elemen <input> — supaya ikut tervalidasi & masuk ke data submit
  useEffect(() => {
    register("lat", { required: "Silakan pilih lokasi di peta" });
    register("lng", { required: "Silakan pilih lokasi di peta" });
  }, [register]);

  const onSubmit = async (data: FormAlamat) => {
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

    if (error) console.error(error);
    else console.log("Alamat tersimpan:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white/95 rounded-lg">
        <InteractiveMap
          defaultCenter={{ lat: -6.2, lng: 106.8 }}
          onLocationChange={(coords) => {
            setValue("lat", coords.lat, { shouldValidate: true });
            setValue("lng", coords.lng, { shouldValidate: true });
          }}
        />
      </div>
      <input
        {...register("label", { required: "Label wajib diisi" })}
        placeholder="Label (Rumah/Kantor)"
      />
      {errors.label && <p style={{ color: "red" }}>{errors.label.message}</p>}

      <input
        {...register("alamatLengkap", { required: "Alamat wajib diisi" })}
        placeholder="Alamat lengkap"
      />
      {errors.alamatLengkap && (
        <p style={{ color: "red" }}>{errors.alamatLengkap.message}</p>
      )}

      <input
        {...register("namaLokasi", { required: true })}
        placeholder="Nama lokasi"
      />
      <input
        {...register("namaPenerima", { required: true })}
        placeholder="Nama penerima"
      />
      <input
        {...register("noHp", { required: true, valueAsNumber: true })}
        placeholder="No HP"
      />
      <input {...register("intruksiKhusus")} placeholder="Instruksi khusus" />
      <input {...register("detailIntruksi")} placeholder="Detail instruksi" />

      <label>
        <input type="checkbox" {...register("isUtama")} /> Jadikan alamat utama
      </label>

      {(errors.lat || errors.lng) && (
        <p style={{ color: "red" }}>
          {errors.lat?.message || errors.lng?.message}
        </p>
      )}

      <button type="submit">Simpan Alamat</button>
    </form>
  );
}
