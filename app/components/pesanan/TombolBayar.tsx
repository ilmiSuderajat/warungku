"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // Tambahkan ini

export default function TombolBayar({
  action,
}: {
  action: () => Promise<{ success: boolean; message: string }>;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Inisialisasi router

  const handleClick = async () => {
    setLoading(true);
    try {
      // 1. Panggil Server Action
      const hasil = await action();

      if (hasil.success) {
        // 2. Munculkan Toast
        toast.success(hasil.message);

        setTimeout(() => {
          router.push('/pesanan?status=sukses');
        }, 1000);

      } else {
        toast.error(hasil.message);
        setLoading(false); // Matikan loading karena proses gagal, user harus coba lagi
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan sistem");
      console.log(err);
      setLoading(false); // Matikan loading jika error
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        background: loading ? "#9ca3af" : "#2563eb", // Warna redup jika loading
        color: "white",
        padding: "12px 24px",
        border: "none",
        borderRadius: "8px",
        cursor: loading ? "not-allowed" : "pointer",
        fontWeight: "bold",
        width: "100%", // Tombol full width biasanya lebih bagus untuk checkout
      }}
    >
      {loading ? "Memproses..." : "Konfirmasi & Bayar Sekarang"}
    </button>
  );
}