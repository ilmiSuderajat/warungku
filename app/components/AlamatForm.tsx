import { useState, useEffect, FormEvent } from "react";
import dynamic from "next/dynamic";
import { MapPin, User, Phone, FileText, Tag, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false });

interface AlamatFormProps {
  onSubmit: (data: {
    label: string;
    alamatLengkap: string;
    isUtama: boolean;
    koordinat: { lat: number; lng: number } | null;
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

  useEffect(() => {
    if (!koordinat) {
      setAlamatOtomatis("");
      return;
    }

    async function ambilNamaJalan() {
      setIsGeocoding(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          setAlamatOtomatis(`Lat: ${koordinat!.lat.toFixed(5)}, Lng: ${koordinat!.lng.toFixed(5)}`);
          return;
        }
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${koordinat!.lat},${koordinat!.lng}&key=${apiKey}`,
        );
        const data = await res.json();

        if (data.results && data.results.length > 0) {
          setAlamatOtomatis(data.results[0].formatted_address);
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!koordinat || !namaPenerima.trim() || !nomorHp.trim() || !label.trim()) return;

    let alamatLengkap = alamatOtomatis || `Koordinat: ${koordinat.lat.toFixed(5)}, ${koordinat.lng.toFixed(5)}`;
    if (detailAlamat.trim()) {
      alamatLengkap += ` (${detailAlamat.trim()})`;
    }
    alamatLengkap += ` | Penerima: ${namaPenerima.trim()} (${nomorHp.trim()})`;

    await onSubmit({
      label: label.trim(),
      alamatLengkap,
      isUtama,
      koordinat,
    });

    setLabel("Rumah");
    setNamaPenerima("");
    setNomorHp("");
    setAlamatOtomatis("");
    setDetailAlamat("");
    setIsUtama(false);
    setKoordinat(null);
  }

  const isFormValid = Boolean(koordinat && namaPenerima.trim() && nomorHp.trim() && label.trim());

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

        {/* Status Lokasi Terdeteksi */}
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
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {alamatOtomatis || `Lat: ${koordinat.lat.toFixed(5)}, Lng: ${koordinat.lng.toFixed(5)}`}
                  </p>
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
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition ${
                  label === lbl
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

