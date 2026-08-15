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

  if (!isLoaded)
    return (
      <div className="p-4 text-sm text-gray-500 text-center bg-gray-100 h-55 flex items-center justify-center">
        Memuat Peta...
      </div>
    );

  return (
    <div className="flex flex-col w-full relative">
      {/* WRAPPER PETA (Diubah menjadi tinggi fix h-[220px] agar form di bawahnya lega) */}
      <div className="relative w-full h-55 overflow-hidden bg-gray-200">
        {/* TEKS OVERLAY (melayang di atas peta, dibuat ala notifikasi UI) */}
        <div className="absolute top-0 left-0 w-full z-10 bg-white/95 backdrop-blur-sm px-4 py-2.5 shadow-sm border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-full p-1.5 bg-orange-50">
              <Bell className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-[11px] font-medium text-gray-700 leading-snug">
              Mohon periksa pin lokasimu, kami akan mengirimkan pesananmu sesuai
              pin lokasi.
            </p>
          </div>
        </div>

        {/* PETA */}
        <GoogleMap
          mapContainerClassName="w-full h-full" // Diubah menjadi h-full agar mengikuti wrapper h-[220px]
          center={mapCenter}
          zoom={18}
          onClick={handleMapClick}
          options={{
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          }}
        >
          {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>
      </div>

      {/* WRAPPER KONTROL */}
      <div className="p-3 bg-white border-b border-gray-100 space-y-3">
        {/* TOMBOL */}
        <button
          onClick={handleCurrentLocation}
          disabled={isLocating}
          className="w-full text-gray-700 text-sm font-semibold py-3 px-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition-colors flex items-center justify-center gap-2"
        >
          {isLocating ? "Mencari Lokasi..." : "📍 Gunakan Lokasi Saat Ini"}
        </button>

        {/* INFO KOORDINAT */}
        <div className="flex justify-between items-center px-2 text-[10px] text-gray-400 font-mono">
          <span>Lat: {markerPosition.lat.toFixed(6)}</span>
          <span>Lng: {markerPosition.lng.toFixed(6)}</span>
        </div>
      </div>
    </div>
  );
}
