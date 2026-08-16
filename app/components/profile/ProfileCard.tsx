// components/produk/CardProduk.tsx
import { Profile } from "@/src/viewmodels/data/profile";
import { ShoppingBag } from "lucide-react"; // Opsional untuk icon

// Komponen ini MINTA dikirimkan properti bernama 'data' yang berisi 1 objek Produk
export default function ProfileCard({ data }: { data: Profile }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      <p className="text-black">{data.nama}</p>
    </div>
  );
}
