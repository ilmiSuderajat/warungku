import { MapPin, CheckCircle2, Trash2, Star, Navigation } from "lucide-react";

interface Alamat {
  id: string;
  label: string;
  is_utama: boolean;
  alamat_lengkap: string;
  latitude?: number;
  longitude?: number;
}

interface AlamatListProps {
  data: Alamat[];
  onSetUtama?: (id: string) => Promise<void>;
  onHapus?: (id: string) => Promise<void>;
}

export default function AlamatList({ data, onSetUtama, onHapus }: AlamatListProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600 mb-3 shadow-inner">
          <MapPin className="h-8 w-8" />
        </div>
        <p className="text-base font-bold text-slate-800">Belum Ada Alamat Tersimpan</p>
        <p className="mt-1 text-xs text-slate-500 max-w-xs leading-relaxed">
          Tambahkan lokasi pengiriman Anda untuk mempercepat pemesanan dan proses checkout.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((alamat) => (
        <div
          key={alamat.id}
          className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 ${
            alamat.is_utama
              ? "border-orange-300 bg-gradient-to-r from-orange-50/50 via-white to-white shadow-sm ring-1 ring-orange-200/50"
              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
          }`}
        >
          {/* Main indicator accent bar */}
          {alamat.is_utama && (
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500" />
          )}

          <div className="p-4 sm:p-5 pl-5 sm:pl-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {alamat.label || "Alamat"}
                </span>
                {alamat.is_utama && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-600">
                    <Star className="h-3 w-3 fill-orange-500 text-orange-500" />
                    Utama
                  </span>
                )}
                {alamat.latitude && alamat.longitude && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                    <Navigation className="h-3 w-3" />
                    Pin Peta OK
                  </span>
                )}
              </div>

              {/* Delete button */}
              {onHapus && (
                <button
                  type="button"
                  onClick={() => onHapus(alamat.id)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-red-600 transition"
                  title="Hapus alamat"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Hapus</span>
                </button>
              )}
            </div>

            <div className="mt-3 flex items-start gap-3">
              <MapPin className={`h-5 w-5 shrink-0 mt-0.5 ${alamat.is_utama ? 'text-orange-500' : 'text-slate-400'}`} />
              <div className="flex-1">
                <p className="text-sm leading-relaxed font-normal text-slate-800">
                  {alamat.alamat_lengkap}
                </p>
              </div>
            </div>

            {/* Bottom action for setting as main address */}
            {!alamat.is_utama && onSetUtama && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => onSetUtama(alamat.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 border border-orange-200 bg-orange-50/60 hover:bg-orange-100/80 px-3 py-1.5 rounded-xl transition shadow-xs"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Atur Sebagai Alamat Utama
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

