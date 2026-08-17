import {
  TicketPercent,
  Tags,
  Crown,
  Ticket,
  Coins,
  Heart,
  Wallet,
  MapPin,
  Briefcase,
  Truck,
  Store,
  Smartphone,
  ChevronRight,
} from "lucide-react";

export default function ItemList() {
  // Mengelompokkan item dalam array 2 dimensi untuk membuat pemisah (jarak antar card)
  const menuGroups = [
    [
      {
        label: "WarungKita Deals",
        href: "/deals",
        icon: Tags,
        iconColor: "text-red-500",
      },
      {
        label: "WarungKita Missions",
        href: "/missions",
        icon: TicketPercent,
        iconColor: "text-blue-600",
      },
      {
        label: "WarungVIP",
        href: "/vip",
        icon: Crown,
        iconColor: "text-red-600",
        trailingText: "Beli Disini",
        trailingColor: "text-red-500",
      },
      {
        label: "Voucher Saya",
        href: "/vouchers",
        icon: Ticket,
        iconColor: "text-red-500",
        trailingText: "6 Voucher",
        trailingColor: "text-gray-500",
      },
      {
        label: "Koin WarungKita Saya",
        href: "/coins",
        icon: Coins,
        iconColor: "text-yellow-500",
      },
    ],
    [
      {
        label: "Favorit",
        href: "/favorites",
        icon: Heart,
        iconColor: "text-red-400",
      },
      {
        label: "Metode Pembayaran",
        href: "/payments",
        icon: Wallet,
        iconColor: "text-blue-500",
      },
      {
        label: "Alamat",
        href: "/alamat",
        icon: MapPin,
        iconColor: "text-teal-500",
      },
    ],
    [
      {
        label: "WarungKita Affiliate",
        href: "/affiliate",
        icon: Briefcase,
        iconColor: "text-orange-500",
      },
      {
        label: "Kirim Instant",
        href: "/instant",
        icon: Truck,
        iconColor: "text-red-600",
      },
      {
        label: "Untuk Pemilik Outlet",
        href: "/merchant",
        icon: Store,
        iconColor: "text-yellow-500",
      },
    ],
    [
      {
        label: "Shortcut WarungKita",
        href: "/shortcut-app",
        icon: Smartphone,
        iconColor: "text-red-500",
      },
      {
        label: "Shortcut Kirim Instant",
        href: "/shortcut-instant",
        icon: Smartphone,
        iconColor: "text-pink-500",
      },
    ],
  ];

  return (
    <div className="w-full bg-gray-100 min-h-screen py-3 flex flex-col gap-3">
      {menuGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="bg-white border-y border-gray-200">
          {group.map((item, itemIndex) => {
            const Icon = item.icon;
            // Deteksi item terakhir di setiap grup agar tidak ada border-bottom yang ganda
            const isLastItem = itemIndex === group.length - 1;

            return (
              <a
                key={itemIndex}
                href={item.href} // Jika menggunakan Next.js, ganti tag <a> dengan <Link>
                className={`flex items-center justify-between px-4 py-3.5 bg-white hover:bg-gray-50 transition-colors ${
                  !isLastItem ? "border-b border-gray-100" : ""
                }`}
              >
                {/* Area Kiri: Ikon & Label */}
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 ${item.iconColor || "text-gray-700"}`}
                    strokeWidth={2}
                  />
                  <span className="text-gray-800 text-[15px] font-medium">
                    {item.label}
                  </span>
                </div>

                {/* Area Kanan: Trailing Text & Chevron */}
                <div className="flex items-center gap-2">
                  {item.trailingText && (
                    <span
                      className={`text-sm font-medium ${item.trailingColor}`}
                    >
                      {item.trailingText}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </a>
            );
          })}
        </div>
      ))}
    </div>
  );
}
