"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  ReceiptText,
  Truck,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { batalkanPesanan } from "../actions";

type PesananDetail = {
  id: string;
  created_at: string;
  jumlah: number;
  status_pesanan: string;
  harga_satuan: number | null;
  no_pesanan: string;
  produk_mitra:
    | { nama_produk: string; harga: number; slug: string; gambar_urls: string }
    | {
        nama_produk: string;
        harga: number;
        slug: string;
        gambar_urls: string;
      }[]
    | null;
  alamat:
    | { label: string; alamat_lengkap: string }
    | { label: string; alamat_lengkap: string }[]
    | null;
};

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

function StatusInfo({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase();
  const isDelivered = normalizedStatus === "dikirim";
  const isComplete = normalizedStatus === "selesai";
  const isCancelled = normalizedStatus === "dibatalkan";
  const Icon = isCancelled
    ? XCircle
    : isComplete
      ? CheckCircle2
      : isDelivered
        ? Truck
        : Clock3;
  const label = isCancelled
    ? "Pesanan dibatalkan"
    : isComplete
      ? "Pesanan selesai"
      : isDelivered
        ? "Pesanan sedang dikirim"
        : normalizedStatus === "diproses"
          ? "Pesanan sedang diproses"
          : "Menunggu konfirmasi";

  return (
    <div className="flex items-center gap-3 border-b border-gray-200 pb-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">
          Status pengiriman diperbarui oleh mitra
        </p>
      </div>
    </div>
  );
}

export default function Detail({
  datapesanan,
}: {
  datapesanan: PesananDetail[];
}) {
  const router = useRouter();
  const item = datapesanan[0];
  if (!item)
    return (
      <div className="min-h-screen bg-gray-50 p-5 text-center text-gray-500">
        Pesanan tidak ditemukan.
      </div>
    );
  const produk = Array.isArray(item.produk_mitra)
    ? item.produk_mitra[0]
    : item.produk_mitra;
  const alamat = Array.isArray(item.alamat) ? item.alamat[0] : item.alamat;
  const hargaSatuan = item.harga_satuan ?? produk?.harga ?? 0;
  const subtotal = hargaSatuan * item.jumlah;
  const bolehDibatalkan = item.status_pesanan.toLowerCase() === "menunggu";
  const sedangDiproses = item.status_pesanan.toLowerCase() === "diproses";
  const sudahDibatalkan = item.status_pesanan.toLowerCase() === "dibatalkan";
  const gambarUrl =
    produk?.gambar_urls && produk.gambar_urls.length > 0
      ? produk.gambar_urls[0]
      : null;

  async function handleCancel() {
    const toastId = toast.custom(
      (id) => (
        <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
          <p className="font-bold text-gray-900">Batalkan pesanan?</p>
          <p className="mt-1 text-sm text-gray-500">
            Pesanan yang dibatalkan tidak dapat diproses kembali.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => toast.dismiss(id)}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-500"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={async () => {
                toast.dismiss(id);
                const result = await batalkanPesanan(item.id);
                if (result.success) {
                  toast.success(result.message);
                  router.refresh();
                } else toast.error(result.message);
              }}
              className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white"
            >
              Batalkan
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
    return toastId;
  }
  return (
    <main className="min-h-screen bg-gray-100 pb-28 text-gray-900">
      <header className="bg-indigo-600 p-5 text-white sm:p-6">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <button
            type="button"
            aria-label="Kembali"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-6 h-6 text-white transition-transform duration-100 ease-in-out active:scale-80" />
          </button>
          <div>
            <p className="text-xs text-white">Detail pesanan</p>
            <h1 className="text-xl font-bold">#{item.no_pesanan}</h1>
          </div>
        </div>
      </header>

      {(bolehDibatalkan || sedangDiproses) && (
        <div className="mx-auto max-w-3xl px-2 pt-1 sm:px-6">
          <div className="flex items-start gap-2 rounded-lg border border-red-600 bg-white/95 p-3 text-sm text-red-600 ">
            <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              {sedangDiproses
                ? "Pesanan tidak dapat dibatalkan karena status pesanan sedang diproses."
                : "Pesanan masih menunggu konfirmasi dan dapat dibatalkan."}
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl space-y-2 p-2 sm:p-6">
        <section className="space-y-4 rounded-lg border border-gray-100/80 bg-white/95 p-2  sm:p-6">
          <StatusInfo status={item.status_pesanan} />
          <div className="flex items-start gap-3">
            <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
              {gambarUrl ? (
                <img
                  src={gambarUrl}
                  alt={produk?.nama_produk || "Produk"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="w-8 h-8 text-gray-500" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-gray-900">item</h2>
              <p className="text-sm text-gray-500">
                {item.jumlah} {produk?.nama_produk ?? "Produk tidak tersedia"} x
                Rp {formatRupiah(hargaSatuan)}
              </p>
            </div>
          </div>
          <p className="border-t  border-gray-200 pt-3 text-xs text-gray-500">
            Dibuat {formatDate(item.created_at)}
          </p>
        </section>

        <section className="space-y-4 rounded-lg border border-gray-100 bg-white/95 p-2  sm:p-6">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
            <MapPin className="h-5 w-5 text-indigo-600" />
            <h2 className="font-bold">Alamat Pengiriman</h2>
          </div>
          {alamat ? (
            <div>
              <p className="font-semibold">{alamat.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                {alamat.alamat_lengkap}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Alamat pengiriman tidak tersedia.
            </p>
          )}
        </section>

        <section className="space-y-4 rounded-lg border border-gray-100 bg-white/95 p-2  sm:p-6">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
            <ReceiptText className="h-5 w-5 text-indigo-600" />
            <h2 className="font-bold">Informasi Pembayaran</h2>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            <CreditCard className="h-5 w-5 text-indigo-600" />
            <div>
              <p className="text-sm font-semibold">Saldo WarungKu</p>
              <p className="text-xs text-gray-500">Metode pembayaran pesanan</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal produk</span>
              <span>Rp {formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Ongkos kirim</span>
              <span>Gratis</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold">
              <span>Total pembayaran</span>
              <span className="text-indigo-600">
                Rp {formatRupiah(subtotal)}
              </span>
            </div>
          </div>
        </section>
      </div>

      {(bolehDibatalkan || sedangDiproses || sudahDibatalkan) && (
        <div className="fixed inset-x-0 bottom-0 z-10 border-t border-gray-200 bg-white p-4">
          <div className="mx-auto max-w-3xl">
            {sudahDibatalkan ? (
              <a
                href={produk?.slug ? `/produk/${produk.slug}` : "/produk"}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white"
              >
                <Package className="h-4 w-4" />
                Beli Lagi
              </a>
            ) : (
              <button
                type="button"
                onClick={handleCancel}
                disabled={sedangDiproses}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                Batalkan Pesanan
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
