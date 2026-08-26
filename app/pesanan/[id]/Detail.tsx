"use client";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
export default function Detail({ datapesanan }: { datapesanan: any[] }) {
  const router = useRouter();
  const item = datapesanan[0];
  return (
    <div className="w-full min-h-screen bg-gray-50/80">
      <div className="bg-gray-500 text-white p-5 sm:p-6">
        <div className="max-w-3xl mx-auto space-y-1">
          <div className="flex items-center gap-3 text-center">
            <MoveLeft
              onClick={() => router.back()}
              className="w-6 h-6 text-white transition-transform duration-100 ease-in-out active:scale-80"
            />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight ml-15">
              Detail Pesanan
            </h1>
          </div>
        </div>
      </div>

      <div className="bg-white text-black ">
        <p>nomor pesanan: {item?.no_pesanan} </p>
      </div>
    </div>
  );
}
