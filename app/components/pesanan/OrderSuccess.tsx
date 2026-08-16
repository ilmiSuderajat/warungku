"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ShoppingBag, ArrowRight, Home } from "lucide-react";
import WaveDotLoader from "../ui/WaveDotLoader";
import Link from "next/link";

interface OrderSuccessProps {
  show: boolean;
}

export default function OrderSuccess({ show }: OrderSuccessProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<"loading" | "success">("loading");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;

    // Fade in
    requestAnimationFrame(() => setVisible(true));

    // After loading animation, switch to success
    const timer = setTimeout(() => {
      setPhase("success");
    }, 2200);

    return () => clearTimeout(timer);
  }, [show]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-200 flex items-center justify-center transition-all duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

      {/* Content card */}
      <div
        className={`relative mx-4 w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-900/20 transition-all duration-700 ${
          visible ? "scale-100 translate-y-0" : "scale-90 translate-y-8"
        }`}
      >
        {/* Top gradient accent bar */}
        <div className="h-1.5 bg-linear-to-r from-indigo-500 via-violet-500 to-purple-500" />

        {/* ===== LOADING PHASE ===== */}
        {phase === "loading" && (
          <div className="flex flex-col items-center px-6 py-12">
            {/* Pulsing bag icon */}
            <div className="relative mb-6">
              <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center animate-pulse">
                <ShoppingBag className="h-10 w-10 text-indigo-500" />
              </div>
              {/* Outer ring animation */}
              <div className="absolute inset-0 rounded-full border-2 border-indigo-300/40 animate-ping" />
            </div>

            <h2 className="text-lg font-bold text-slate-800 mb-4">
              Memproses Pesanan
            </h2>

            {/* Wave dot loader */}
            <WaveDotLoader
              message="Mohon tunggu sebentar..."
              dotCount={5}
              color="indigo"
            />
          </div>
        )}

        {/* ===== SUCCESS PHASE ===== */}
        {phase === "success" && (
          <div className="flex flex-col items-center px-6 py-10">
            {/* Success icon with pop animation */}
            <div className="relative mb-5">
              <div
                className="h-24 w-24 rounded-full bg-linear-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-400/30"
                style={{
                  animation:
                    "popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                }}
              >
                <CheckCircle
                  className="h-12 w-12 text-white"
                  strokeWidth={2.5}
                />
              </div>
              {/* Sparkle rings */}
              <div
                className="absolute inset-2 rounded-full border-2 border-emerald-200"
                style={{
                  animation: "ringExpand 1s ease-out forwards",
                }}
              />
              <div
                className="absolute inset-4 rounded-full border border-emerald-100"
                style={{
                  animation: "ringExpand 1s ease-out 0.15s forwards",
                  opacity: 0,
                }}
              />
            </div>

            {/* Text */}
            <h2
              className="text-xl font-bold text-slate-900 mb-1"
              style={{
                animation: "fadeUp 0.4s ease-out 0.3s both",
              }}
            >
              Pesanan Berhasil! 🎉
            </h2>
            <p
              className="text-sm text-slate-500 text-center leading-relaxed mb-8 max-w-65"
              style={{
                animation: "fadeUp 0.4s ease-out 0.45s both",
              }}
            >
              Pesanan kamu sedang diproses oleh mitra kami. Pantau statusnya di
              halaman pesanan.
            </p>

            {/* Action buttons */}
            <div
              className="w-full space-y-3"
              style={{
                animation: "fadeUp 0.4s ease-out 0.6s both",
              }}
            >
              <Link
                href="/pesanan"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.98] transition-all"
              >
                Lihat Pesanan
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 active:scale-[0.98] transition-all"
              >
                <Home className="h-4 w-4" />
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        )}

        {/* Inline keyframes */}
        <style jsx>{`
          @keyframes popIn {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes ringExpand {
            0% {
              transform: scale(0.8);
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: scale(1.15);
              opacity: 0;
            }
          }

          @keyframes fadeUp {
            0% {
              transform: translateY(12px);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
