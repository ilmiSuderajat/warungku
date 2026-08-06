"use client";
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingCartIcon, PlusIcon } from "@heroicons/react/24/outline";
export default function TombolKeranjang({
  action,
}: {
  action: () => Promise<boolean>;
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const berhasil = await action();
      if (berhasil) {
        toast.success("Berhasil menambahkan ke keranjang! 🎉");
      }
    } catch (error) {
      toast.error("Gagal menambahkan ke keranjang.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        title="Tambah ke Keranjang"
        className="w-full h-full  text-indigo-600 rounded-xl flex items-center justify-center active:scale-95 transition-all border border-indigo-100  disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <div className="relative flex items-center justify-center">
            {/* Ikon Keranjang */}
            <ShoppingCartIcon className="w-8 h-8 text-indigo-600" />
            {/* Tanda Plus di tengah/pojok ikon */}
            <PlusIcon className="w-4 h-4 text-white bg-indigo-600 rounded-full absolute -top-1 -right-1 p-0.5 font-extrabold shadow-sm" />
          </div>
        )}
      </button>
    </div>
  );
}
