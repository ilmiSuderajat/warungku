// 1. PERBAIKAN: Ubah "client" menjadi "server"
import { createClient } from "@/utils/supabase/server";
import { TicketPercent, Wallet, Coins, ScanLine } from "lucide-react";
import Link from "next/link";

export default async function TopCard() {
  // createClient server memang butuh await
  const supabase = await createClient();

  // Ambil user yang sedang login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch data wallet berdasarkan user.id
  const { data: wallet, error } = await supabase
    .from("wallets")
    .select("balance")
    .eq("user_id", user?.id)
    .single();

  if (error && error.code !== "PGRST116") {
    // Abaikan error PGRST116 (No Rows) jika user belum punya wallet
    console.error("Gagal load saldo:", error.message);
  }

  // Set default saldo 0 jika wallet tidak ditemukan
  const saldo = wallet?.balance || 0;

  return (
    <div className="w-[96%] max-w-2xl mx-auto bg-white/95 rounded-lg shadow-lg py-2 px-1 mt-1">
      <div className="h-[20%] grid grid-cols-4 gap-2">
        {/* Item 1: Wallet */}
        <Link
          href="/wallet"
          className="flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform border-r-2 border-gray-200"
        >
          <Wallet className="w-6 h-6 sm:w-6 sm:h-6 text-indigo-800" />
          <p className="text-gray-600 text-[10px] sm:text-xs font-bold text-center mt-0.5">
            Saldo:{" "}
            <strong>{saldo ? saldo.toLocaleString("id-ID") : "0"}</strong>
          </p>
        </Link>

        {/* Item 2: Voucher */}
        <div className="flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform border-r-2 border-gray-200">
          <TicketPercent className="w-6 h-6 sm:w-6 sm:h-6 text-green-800" />
          <p className="text-gray-600 text-[10px] sm:text-xs font-bold text-center mt-0.5">
            Voucher: <strong>0</strong>
          </p>
        </div>

        {/* Item 3: Points */}
        <div className="flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform border-r-2 border-gray-200">
          <Coins className="w-6 h-6 sm:w-6 sm:h-6 text-yellow-500" />
          <p className="text-gray-600 text-[10px] sm:text-xs text-center font-bold mt-0.5">
            Points: <strong>0</strong>
          </p>
        </div>

        {/* Item 4: Scan QR */}
        {/* 2. PERBAIKAN: Hapus border-r-2 di item terakhir agar rapi */}
        <div className="flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform">
          <ScanLine className="w-6 h-6 sm:w-6 sm:h-6 text-indigo-800" />
          <p className="text-gray-600 text-[10px] sm:text-xs font-bold text-center mt-0.5">
            Scan QR
          </p>
        </div>
      </div>
    </div>
  );
}
