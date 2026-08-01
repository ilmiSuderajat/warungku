'use client'
import { useState } from "react";
import { toast } from "sonner";

export default function TombolKeranjang({ action }: { action: () => Promise<boolean> }) {
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
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
                {loading ? "Menambahkan..." : "Tambah ke Keranjang"}
            </button>
        </div>
    )
}