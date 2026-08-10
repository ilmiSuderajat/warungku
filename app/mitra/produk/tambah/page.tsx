"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { getTokoId, tambahProduk } from "../viewModels";
import { compressImage } from "@/utils/imageCompression";
import { toast } from "sonner";

export default function TambahProdukPage() {
  const [tokoId, setTokoId] = useState<string | null>(null);
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [stok, setStok] = useState("");
  const [gambarFile, setGambarFile] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    getTokoId(supabase).then(setTokoId);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tokoId) {
      toast.error("Toko tidak ditemukan");
      return;
    }

    setLoading(true);
    try {
      let gambarUrl: string[] = [];

      if (gambarFile.length > 0) {
        const uploadPromises = gambarFile.map(async (file, index) => {
          const compressed = await compressImage(file);
          const path = `${tokoId}/${Date.now()}-${index}.webp`;

          const { error: uploadError } = await supabase.storage
            .from("produk-image")
            .upload(path, compressed);

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from("produk-image")
            .getPublicUrl(path);

          return urlData.publicUrl;
        });

        gambarUrl = await Promise.all(uploadPromises);
      }

      const { error } = await tambahProduk(
        supabase,
        tokoId,
        nama,
        Number(harga),
        Number(stok),
        gambarUrl,
      );

      if (error) throw error;

      toast.success("Produk berhasil ditambahkan");
      setNama("");
      setHarga("");
      setStok("");
      setGambarFile([]);
    } catch (err: any) {
      toast.error(err.message ?? "Gagal menambahkan produk");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center py-4 justify-center bg-white text-gray-800 border-indigo-600">
      <form
        className="flex flex-col items-center p-5 gap-2"
        onSubmit={handleSubmit}
        style={{ maxWidth: 400 }}
      >
        <input
          className="w-[60%] h-5 border-indigo-500 border-2 outline rounded-lg py-5 px-5"
          placeholder="Nama Produk"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
        />
        <input
          className="w-[60%] h-5 border-indigo-500 border-2 outline rounded-lg py-5 px-5"
          placeholder="Harga"
          type="number"
          value={harga}
          onChange={(e) => setHarga(e.target.value)}
          required
        />
        <input
          className="w-[60%] h-5 border-indigo-500 border-2 outline rounded-lg py-5 px-5"
          placeholder="Stok"
          type="number"
          value={stok}
          onChange={(e) => setStok(e.target.value)}
          required
        />
        <input
          className="w-[60%] h-5 border-indigo-500 border-2 outline rounded-lg py-5 px-5"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setGambarFile(Array.from(e.target.files ?? []))}
        />
        <button
          className="bg-indigo-500 text-white w-full h-8 rounded-lg"
          type="submit"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Tambah Produk"}
        </button>
      </form>
    </div>
  );
}
