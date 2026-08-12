import { LayoutGrid, ShoppingBag, MapPin, Wallet, Store, Truck, Headphones, CreditCard } from "lucide-react";
import Link from "next/link";

const layananItems = [
  {
    title: "Belanja",
    desc: "Temukan produk kebutuhan Anda",
    href: "/produk",
    icon: ShoppingBag,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Alamat Saya",
    desc: "Kelola alamat pengiriman",
    href: "/alamat",
    icon: MapPin,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Dompet",
    desc: "Top up & riwayat transaksi",
    href: "/wallet",
    icon: Wallet,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    title: "Keranjang",
    desc: "Lihat keranjang belanja Anda",
    href: "/keranjang",
    icon: ShoppingBag,
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "Mitra Dashboard",
    desc: "Kelola toko & produk Anda",
    href: "/mitra",
    icon: Store,
    color: "bg-sky-100 text-sky-600",
  },
  {
    title: "Pesanan",
    desc: "Lacak status pesanan aktif",
    href: "/pesanan",
    icon: Truck,
    color: "bg-violet-100 text-violet-600",
  },
  {
    title: "Pembayaran",
    desc: "Metode pembayaran tersimpan",
    href: "/checkout",
    icon: CreditCard,
    color: "bg-rose-100 text-rose-600",
  },
  {
    title: "Bantuan",
    desc: "Pusat bantuan & FAQ",
    href: "#",
    icon: Headphones,
    color: "bg-slate-100 text-slate-600",
  },
];

export default function LayananPage() {
  return (
    <div className="min-h-screen bg-slate-50/70 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-4 pt-12 pb-10 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <LayoutGrid className="w-6 h-6" />
            <h1 className="text-2xl font-bold tracking-tight">Layanan</h1>
          </div>
          <p className="text-sm text-orange-100">
            Akses semua fitur WarungKita dalam satu halaman.
          </p>
        </div>
      </div>

      {/* Grid Layanan */}
      <div className="max-w-4xl mx-auto px-4 -mt-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {layananItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-orange-200 text-center"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color} transition group-hover:scale-110`}
              >
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{item.title}</p>
                <p className="mt-0.5 text-[11px] text-slate-500 leading-snug">
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
