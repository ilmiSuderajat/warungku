"use client";

import { useState } from "react";
import { toast } from "sonner"; // Atau import { toast } dari 'sonner' tergantung yang kamu pakai

export default function TombolBayar({
  action,
}: {
  action: () => Promise<{ success: boolean; message: string }>;
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      // Panggil Server Action dari props
      const hasil = await action();

      if (hasil.success) {
        toast.success(hasil.message);
      } else {
        toast.error(hasil.message);
      }
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        background: "blue",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      {loading ? "Memproses..." : "Konfirmasi & Bayar Sekarang"}
    </button>
  );
}
