// app/lokasi/MapList.tsx
"use client";

import { useState, useEffect } from "react";
import { searchLokasi } from "@/app/alamat/searchActions";

type Lokasi = {
  id: string;
  nama_lokasi: string;
};

export default function MapList() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Lokasi[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!keyword.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const data = await searchLokasi(keyword);
        setResults(data);
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  return (
    <div className="w-full">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Cari lokasi"
        className="h-10 w-full rounded-lg border border-indigo-600 bg-gray-50/10 px-4 text-sm text-gray-800 placeholder-gray-400 transition-all focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />

      {/* Container Loading */}
      <div className="w-full bg-gray-50/90">
        {isLoading && <p className="text-sm text-gray-500 py-2">Mencari...</p>}
      </div>

      {/* Menampilkan List JIKA ADA hasil */}
      {results.length > 0 && (
        <ul className="rounded shadow-sm divide-y mt-1 border border-gray-100">
          {results.map((item) => (
            <li
              key={item.id}
              className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {item.nama_lokasi}
            </li>
          ))}
        </ul>
      )}

      {/* FALLBACK: Menampilkan pesan JIKA TIDAK ADA hasil */}
      {keyword.trim() !== "" && !isLoading && results.length === 0 && (
        <div className="mt-1 p-4 text-center text-sm text-gray-500 bg-gray-50 rounded-lg border border-gray-100">
          Lokasi{" "}
          <span className="font-semibold text-slate-700">"{keyword}"</span>{" "}
          tidak ditemukan.
        </div>
      )}
    </div>
  );
}
