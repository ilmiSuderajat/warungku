"use client";

import { Bell, Package, Megaphone, Info } from "lucide-react";

// Notifikasi dummy untuk tampilan awal
const dummyNotif = [
  {
    id: 1,
    type: "pesanan",
    title: "Pesanan Dikirim",
    message: "Pesanan #WK-20250812 sedang dalam perjalanan ke alamat Anda.",
    time: "5 menit lalu",
    read: false,
  },
  {
    id: 2,
    type: "promo",
    title: "Flash Sale Malam Ini! 🔥",
    message:
      "Diskon hingga 50% untuk semua produk segar. Berlaku pukul 19.00 - 21.00 WIB.",
    time: "1 jam lalu",
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "Verifikasi Alamat Berhasil",
    message:
      "Alamat 'Rumah' Anda berhasil diverifikasi dan siap digunakan untuk pengiriman.",
    time: "Kemarin",
    read: true,
  },
  {
    id: 4,
    type: "pesanan",
    title: "Pesanan Selesai",
    message:
      "Pesanan #WK-20250810 telah diterima. Terima kasih telah berbelanja di WarungKita!",
    time: "2 hari lalu",
    read: true,
  },
];

const typeConfig: Record<string, { icon: typeof Bell; color: string }> = {
  pesanan: { icon: Package, color: "bg-orange-100 text-orange-600" },
  promo: { icon: Megaphone, color: "bg-amber-100 text-amber-600" },
  info: { icon: Info, color: "bg-sky-100 text-sky-600" },
};

export default function NotifikasiPage() {
  const unreadCount = dummyNotif.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50/70 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-4 pt-12 pb-10 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6" />
              <h1 className="text-2xl font-bold tracking-tight">Notifikasi</h1>
            </div>
            {unreadCount > 0 && (
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                {unreadCount} Baru
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-orange-100">
            Pantau pesanan, promo, dan informasi penting lainnya.
          </p>
        </div>
      </div>

      {/* Notification List */}
      <div className="max-w-4xl mx-auto px-4 -mt-5 space-y-3">
        {dummyNotif.map((notif) => {
          const cfg = typeConfig[notif.type] ?? typeConfig.info;
          const Icon = cfg.icon;

          return (
            <div
              key={notif.id}
              className={`relative overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md ${
                notif.read
                  ? "border-slate-200"
                  : "border-orange-200 ring-1 ring-orange-100"
              }`}
            >
              {/* Unread dot */}
              {!notif.read && (
                <span className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-orange-500 shadow-sm" />
              )}

              <div className="flex gap-3.5">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cfg.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 leading-snug">
                    {notif.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {notif.message}
                  </p>
                  <p className="mt-2 text-[11px] font-medium text-slate-400">
                    {notif.time}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
