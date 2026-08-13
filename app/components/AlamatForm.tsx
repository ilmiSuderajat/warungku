import { useState, useEffect, FormEvent } from "react";
import dynamic from "next/dynamic";
import { MapPin, User, Phone, FileText, Tag, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { cariLokasiTerdekat } from "@/app/alamat/viewModel";

const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false });

interface AlamatFormProps {
  onSubmit: (data: {
    label: string;
    alamatLengkap: string;
    namaLokasi: string;
    isUtama: boolean;
    koordinat: { lat: number; lng: number };
  }) => Promise<void>;
  loading: boolean;
}

export default function AlamatForm({ onSubmit, loading }: AlamatFormProps) {
  const [label, setLabel] = useState("Rumah");
  const [namaPenerima, setNamaPenerima] = useState("");
  const [nomorHp, setNomorHp] = useState("");
  const [alamatOtomatis, setAlamatOtomatis] = useState("");
  const [detailAlamat, setDetailAlamat] = useState("");
  const [isUtama, setIsUtama] = useState(false);
  const [koordinat, setKoordinat] = useState<{ lat: number; lng: number } | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [namaLokasi, setNamaLokasi] = useState("");
  const [rekomendasi, setRekomendasi] = useState<any[]>([]);

  const supabase = createClient();

  useEffect(() => {
    if (!koordinat) {
      setAlamatOtomatis("");
      return;
    }

    async function ambilNamaJalan() {
      setIsGeocoding(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${koordinat!.lat}&lon=${koordinat!.lng}&format=json`,
          {
            headers: {
              "Accept-Language": "id",
            },
          }
        );
        const data = await res.json();

        if (data.display_name) {
          setAlamatOtomatis(data.display_name);
        } else {
          setAlamatOtomatis(`Lat: ${koordinat!.lat.toFixed(5)}, Lng: ${koordinat!.lng.toFixed(5)}`);
        }
      } catch (error) {
        console.error("Gagal reverse geocoding:", error);
        setAlamatOtomatis(`Lat: ${koordinat!.lat.toFixed(5)}, Lng: ${koordinat!.lng.toFixed(5)}`);
      } finally {
        setIsGeocoding(false);
      }
    }

    ambilNamaJalan();
  }, [koordinat]);

  useEffect(() => {
    if (!koordinat) {
      setRekomendasi([]);
      return;
    }

    async function muatRekomendasi() {
      const { data } = await cariLokasiTerdekat(supabase, koordinat!.lat, koordinat!.lng);
      setRekomendasi(data);
    }

    muatRekomendasi();
  }, [koordinat]);

  async function handlePilihRekomendasi(lokasi: { latitude: number; longitude: number; nama_lokasi: string }) {
    setKoordinat({ lat: lokasi.latitude, lng: lokasi.longitude });
    setNamaLokasi(lokasi.nama_lokasi);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!koordinat || !namaPenerima.trim() || !nomorHp.trim() || !label.trim() || !namaLokasi.trim()) return;

    let alamatLengkap = `${namaLokasi}${alamatOtomatis ? ` (${alamatOtomatis})` : ""}`;
    if (detailAlamat.trim()) {
      alamatLengkap += ` - ${detailAlamat.trim()}`;
    }
    alamatLengkap += ` | Penerima: ${namaPenerima.trim()} (${nomorHp.trim()})`;

    await onSubmit({
      label: label.trim(),
      alamatLengkap,
      namaLokasi: namaLokasi.trim(),
      isUtama,
      koordinat,
    });

    setLabel("Rumah");
    setNamaPenerima("");
    setNomorHp("");
    setAlamatOtomatis("");
    setDetailAlamat("");
    setNamaLokasi("");
    setIsUtama(false);
    setKoordinat(null);
    setRekomendasi([]);
  }

  const isFormValid = Boolean(
    koordinat && namaPenerima.trim() && nomorHp.trim() && label.trim() && namaLokasi.trim()
  );

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* LANGKAH 1: MAP PICKER */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-indigo-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900">1. Titik Lokasi Peta</p>
              <p className="text-xs text-slate-500">Tentukan titik lokasi pengiriman agar kurir presisi.</p>
            </div>
          </div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700">
            Langkah 1
          </span>
        </div>

        <MapPicker position={koordinat} setPosition={setKoordinat} />

        {koordinat ? (
          <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-800">
                  Lokasi Terdeteksi
                </p>

                {isGeocoding ? (
                  <p className="mt-1 flex items-center gap-2 text-sm text-indigo-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Mencari alamat lokasi...
                  </p>
                ) : (
                  <>
                    <input
                      type="text"
                      required
                      value={namaLokasi}
                      onChange={(e) => setNamaLokasi(e.target.value)}
                      placeholder={alamatOtomatis || "Contoh: Gang Rawa RT.1/3"}
                      className="mt-1 w-full rounded-xl border border-indigo-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Isi nama jalan/gang atau RT/RW agar lokasi ini bisa membantu pengguna lain menemukan alamat serupa.
                    </p>

                    {rekomendasi.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        <p className="text-xs font-medium text-slate-500">Lokasi terdekat yang pernah disimpan:</p>
                        {rekomendasi.map((lokasi, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handlePilihRekomendasi(lokasi)}
                            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-left text-xs text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50"
                          >
                            📍 {lokasi.nama_lokasi}{" "}
                            <span className="text-slate-400">({Math.round(lokasi.jarak_meter)}m)</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-800">Pilih titik lokasi di peta</p>
              <p className="mt-0.5 text-xs text-amber-700">
                Klik titik lokasi pada peta di atas atau tekan &quot;Gunakan Lokasi Saat Ini&quot;.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* LANGKAH 2: DETAIL FORM INPUT */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-indigo-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900">2. Detail Penerima &amp; Alamat</p>
              <p className="text-xs text-slate-500">Lengkapi data kontak dan alamat penerima.</p>
            </div>
          </div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700">
            Langkah 2
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Penerima <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Nama lengkap penerima"
                value={namaPenerima}
                onChange={(e) => setNamaPenerima(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nomor HP <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="tel"
                required
                placeholder="08xxxxxxxxxx"
                value={nomorHp}
                onChange={(e) => setNomorHp(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Detail Alamat / Patokan <span className="text-slate-400 font-normal">(Opsional)</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <textarea
              placeholder="Contoh: No. 12, RT 02/RW 03, Pagar hitam, samping masjid..."
              value={detailAlamat}
              onChange={(e) => setDetailAlamat(e.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Label Alamat <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {["Rumah", "Kantor", "Toko"].map((lbl) => (
              <button
                key={lbl}
                type="button"
                onClick={() => setLabel(lbl)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition ${label === lbl
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                  }`}
              >
                <Tag className="h-3.5 w-3.5" />
                {lbl}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={isUtama}
              onChange={(e) => setIsUtama(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            Jadikan sebagai alamat utama
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Menyimpan Alamat...
            </>
          ) : (
            "Simpan Alamat"
          )}
        </button>

        {!koordinat && (
          <p className="text-center text-xs text-amber-600 font-medium mt-2">
            * Harap tentukan titik lokasi di peta terlebih dahulu sebelum menyimpan.
          </p>
        )}
      </div>
    </form>
  );
}