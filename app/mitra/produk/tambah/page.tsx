"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { getTokoId, tambahProduk } from "../viewModels";
import { toast } from "sonner";

export default function TambahProdukPage() {
  const [tokoId, setTokoId] = useState<string | null>(null);
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [stok, setStok] = useState("");
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
    const { error } = await tambahProduk(
      supabase,
      tokoId,
      nama,
      Number(harga),
      Number(stok),
    );
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Produk berhasil ditambahkan");
    setNama("");
    setHarga("");
    setStok("");
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <input
        placeholder="Nama Produk"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        required
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />
      <input
        placeholder="Harga"
        type="number"
        value={harga}
        onChange={(e) => setHarga(e.target.value)}
        required
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />
      <input
        placeholder="Stok"
        type="number"
        value={stok}
        onChange={(e) => setStok(e.target.value)}
        required
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{ width: "100%", padding: 8 }}
      >
        {loading ? "Menyimpan..." : "Tambah Produk"}
      </button>
    </form>
  );
}
