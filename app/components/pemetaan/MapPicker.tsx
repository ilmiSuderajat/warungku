import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useState, FormEvent } from "react";

const containerStyle = {
  width: "100%",
  height: "320px",
  borderRadius: "24px",
};

const defaultCenter = {
  lat: -6.2,
  lng: 106.816666,
};

interface MapPickerProps {
  position: { lat: number; lng: number } | null;
  setPosition: (pos: { lat: number; lng: number }) => void;
}

export default function MapPicker({ position, setPosition }: MapPickerProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const onLoadMap = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmountMap = useCallback(() => {
    setMap(null);
  }, []);

  const onClickMap = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          searchQuery,
        )}&key=${apiKey}`,
      );
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setPosition({ lat: location.lat, lng: location.lng });
        map?.panTo({ lat: location.lat, lng: location.lng });
        map?.setZoom(16);
      } else {
        alert("Lokasi tidak ditemukan. Coba kata kunci lain.");
      }
    } catch (error) {
      console.error("Gagal mencari lokasi:", error);
      alert("Terjadi kesalahan saat mencari lokasi.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung fitur lokasi.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setPosition({ lat, lng });
        map?.panTo({ lat, lng });
        map?.setZoom(16);
        setIsLocating(false);
      },
      (err) => {
        console.error("Gagal mengambil lokasi:", err);
        alert("Gagal mendapatkan lokasi. Pastikan izin lokasi aktif.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true },
    );
  };

  if (!isLoaded) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
        Memuat peta...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSearch}
        className="grid gap-3 sm:grid-cols-[1fr_auto]"
      >
        <input
          type="text"
          placeholder="Ketik nama jalan atau kota..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSearching ? "Sedang mencari..." : "Cari"}
        </button>
      </form>

      <button
        type="button"
        onClick={handleCurrentLocation}
        disabled={isLocating}
        className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        <span>📍</span>
        {isLocating ? "Mencari lokasi..." : "Gunakan Lokasi Saat Ini"}
      </button>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={position || defaultCenter}
          zoom={position ? 16 : 12}
          onLoad={onLoadMap}
          onUnmount={onUnmountMap}
          onClick={onClickMap}
          options={{
            mapTypeControl: false,
            streetViewControl: false,
          }}
        >
          {position && <Marker position={position} />}
        </GoogleMap>
      </div>

      {position && (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 shadow-sm">
          <p className="font-semibold text-slate-900">Koordinat Pilihan</p>
          <p className="mt-1 text-slate-500">
            Latitude: {position.lat.toFixed(6)}, Longitude:{" "}
            {position.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
}
