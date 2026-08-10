"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { getAlamatList, tambahAlamat } from "./viewModel";
import { toast } from "sonner";

export default function AlamatPage() {
  const [alamatList, setAlamatList] = useState<any[]>([]);
  const [label, setLabel] = useState("");
  const [alamatLengkap, setAlamatLengkap] = useState("");
  const [isUtama, setIsUtama] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function muatUlang() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const data = await getAlamatList(supabase, user.id);
    setAlamatList(data);
  }

  useEffect(() => {
    muatUlang();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setLoading(true);
    const { error } = await tambahAlamat(
      supabase,
      user.id,
      label,
      alamatLengkap,
      isUtama,
    );
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Alamat berhasil ditambahkan");
    setLabel("");
    setAlamatLengkap("");
    setIsUtama(false);
    muatUlang();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Alamat Saya</h1>

      {alamatList.map((a) => (
        <div
          key={a.id}
          style={{ border: "1px solid #ccc", padding: 10, marginBottom: 8 }}
        >
          <strong>{a.label}</strong> {a.is_utama && "(Utama)"}
          <p>{a.alamat_lengkap}</p>
        </div>
      ))}

      <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <input
          placeholder="Label (Rumah/Kantor)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <textarea
          placeholder="Alamat Lengkap"
          value={alamatLengkap}
          onChange={(e) => setAlamatLengkap(e.target.value)}
          required
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <label style={{ display: "block", marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={isUtama}
            onChange={(e) => setIsUtama(e.target.checked)}
          />{" "}
          Jadikan alamat utama
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Tambah Alamat"}
        </button>
      </form>
    </div>
  );
}
