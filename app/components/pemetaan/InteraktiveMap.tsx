"use client";
import { useState, useEffect, useRef } from "react";
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

  const mapRef = useRef<google.maps.Map | null>(null);
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mapWrapperRef.current || !mapRef.current) return;
    const observer = new ResizeObserver(() => {
      google.maps.event.trigger(mapRef.current!, "resize");
    });
    observer.observe(mapWrapperRef.current);
    return () => observer.disconnect();
  }, []);
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
    <div className="flex flex-col w-full">
      {/* WRAPPER PETA — static, bukan sticky, biar tidak nimpa konten di bawah */}
      <div
        ref={mapWrapperRef}
        className="relative w-full h-[clamp(160px,28dvh,220px)] overflow-hidden bg-gray-200 z-0"
      >
        <div className="absolute top-0 left-0 w-full z-10 bg-yellow-100 px-4 py-2 shadow-sm border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-orange-500 shrink-0" />
            <p className="text-xs sm:text-sm text-red-500 font-medium leading-snug">
              Mohon periksa pin lokasimu, kami akan mengirimkan pesananmu sesuai
              pin lokasi.
            </p>
          </div>
        </div>

        <GoogleMap
          mapContainerClassName="w-full h-full"
          center={mapCenter}
          zoom={18}
          onClick={handleMapClick}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          options={{
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: false,
            gestureHandling: "greedy",
            clickableIcons: false,
          }}
        >
          {markerPosition && (
            <Marker
              position={markerPosition}
              draggable
              onDragEnd={(e) => {
                if (e.latLng) {
                  handleMapClick({
                    latLng: e.latLng,
                  } as google.maps.MapMouseEvent);
                }
              }}
            />
          )}
        </GoogleMap>
      </div>

      <div className="relative z-10 p-3 bg-white border-b border-gray-100 space-y-3">
        <button
          onClick={handleCurrentLocation}
          disabled={isLocating}
          className="w-full text-gray-700 text-sm font-semibold py-3 px-4 rounded-xl border border-gray-200 bg-white shadow-sm active:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 transition-colors flex items-center justify-center gap-2"
        >
          {isLocating ? "Mencari Lokasi..." : "📍 Gunakan Lokasi Saat Ini"}
        </button>

        <div className="flex justify-between items-center px-2 text-[10px] text-gray-400 font-mono">
          <span>Lat: {markerPosition.lat.toFixed(6)}</span>
          <span>Lng: {markerPosition.lng.toFixed(6)}</span>
        </div>
      </div>
    </div>
  );
}
