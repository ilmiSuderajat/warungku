"use client";
import { useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Bell } from "lucide-react";
interface InteractiveMapProps {
  defaultCenter: {
    lat: number;
    lng: number;
  };

  onLocationChange: (coords: { lat: number; lng: number }) => void;
}
export default function InteractiveMap({
  defaultCenter,
  onLocationChange,
}: InteractiveMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  // 1. KITA BUTUH 2 STATE KOORDINAT SEKARANG
  const [markerPosition, setMarkerPosition] = useState(defaultCenter); // Untuk posisi pin
  const [mapCenter, setMapCenter] = useState(defaultCenter); // Untuk posisi kamera peta

  // State untuk efek loading di tombol
  const [isLocating, setIsLocating] = useState(false);

  // Fungsi saat peta diklik manual
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setMarkerPosition(coords);
      onLocationChange(coords);
    }
  };

  // 2. FUNGSI UNTUK MELACAK GPS BROWSER
  const handleCurrentLocation = () => {
    // Cek apakah browser mendukung fitur lokasi
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung fitur lokasi.");
      return;
    }

    setIsLocating(true); // Ubah tombol jadi "Mencari..."

    // Minta koordinat ke browser
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setMarkerPosition(currentLocation);
        setMapCenter(currentLocation);
        onLocationChange(currentLocation);
        setIsLocating(false);
      },
      (error) => {
        console.error("Gagal mendapatkan lokasi:", error);
        alert(
          "Gagal melacak lokasi. Pastikan izin lokasi / GPS aktif di browser Anda.",
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  if (!isLoaded) return <div className="p-4">Memuat Peta...</div>;

  return (
    <div className="flex flex-col gap-2">
      {/* WRAPPER PETA (harus relative agar teks bisa melayang di dalamnya) */}
      <div className="relative w-full h-[28dvh] rounded-lg overflow-hidden border border-gray-200">
        {/* TEKS OVERLAY (melayang di atas peta) */}
        <div className="absolute top-0 left-0 w-full z-10 bg-yellow-50 backdrop-blur-sm px-3 py-2 text-center border-b border-gray-200">
          <div className="flex items-start ">
            {/* Ikon dipisah ke div tersendiri agar posisinya stabil */}
            <div className="shrink-0 mt-0.5 rounded-full p-2 bg-red-400">
              <Bell className="w-5 h-5 text-yellow-200" />
            </div>

            {/* Teks berdiri sendiri */}
            <p className="text-xs font-semibold text-red-400 leading-snug">
              Mohon periksa pin lokasimu, kami akan mengirimkan pesananmu sesuai
              pin lokasi.
            </p>
          </div>
        </div>

        {/* PETA */}
        <GoogleMap
          mapContainerClassName="w-full h-full rounded-lg" // Ubah menjadi h-full karena tinggi sudah diatur di wrapper parent (h-44)
          center={mapCenter}
          zoom={18}
          onClick={handleMapClick}
          options={{
            mapTypeControl: false,
            streetViewControl: false,
          }}
        >
          {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>
      </div>

      {/* TOMBOL */}
      <div>
        <button
          onClick={handleCurrentLocation}
          disabled={isLocating}
          // Saya hapus mt-20 dan tambahkan border agar tombolnya terlihat lebih rapi
          className="w-full text-indigo-600 font-semibold py-3 px-4 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
        >
          {isLocating ? "Mencari Lokasi..." : "📍 Gunakan Lokasi Saat Ini"}
        </button>
      </div>

      {/* INFO KOORDINAT */}
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800">
        <p className="font-semibold">Koordinat Terpilih:</p>
        <p className="mt-1">
          Lat: {markerPosition.lat.toFixed(6)}, Lng:{" "}
          {markerPosition.lng.toFixed(6)}
        </p>
      </div>
    </div>
  );
}
