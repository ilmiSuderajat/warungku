"use client";

interface WaveDotLoaderProps {
  message?: string;
  dotCount?: number;
  color?: "indigo" | "orange" | "emerald"; // 1. Tipe data lebih ketat
}

// 2. Dipindahkan ke luar agar tidak membebani render cycle
const colorMap = {
  indigo: {
    dot: "bg-indigo-500",
    glow: "shadow-indigo-400/50",
    text: "text-indigo-700",
    bg: "bg-indigo-50/80",
    border: "border-indigo-200/60",
  },
  orange: {
    dot: "bg-orange-500",
    glow: "shadow-orange-400/50",
    text: "text-orange-700",
    bg: "bg-orange-50/80",
    border: "border-orange-200/60",
  },
  emerald: {
    dot: "bg-emerald-500",
    glow: "shadow-emerald-400/50",
    text: "text-emerald-700",
    bg: "bg-emerald-50/80",
    border: "border-emerald-200/60",
  },
};

export default function WaveDotLoader({
  message = "Memproses pesanan...",
  dotCount = 5,
  color = "indigo",
}: WaveDotLoaderProps) {
  // Fallback aman jika warna tidak ditemukan
  const colors = colorMap[color] || colorMap.indigo;

  return (
    <div
      className={`
        inline-flex flex-col items-center justify-center 
        gap-2 sm:gap-3 
        px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 
        rounded-xl sm:rounded-2xl 
        border backdrop-blur-sm transition-all duration-300
        ${colors.bg} ${colors.border}
      `}
    >
      {/* Wave dots */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {Array.from({ length: dotCount }).map((_, i) => (
          <span
            key={i}
            className={`
              block rounded-full shadow-md sm:shadow-lg
              w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 
              ${colors.dot} ${colors.glow}
            `}
            style={{
              animation: "waveBounce 1.4s ease-in-out infinite",
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>

      {/* Message */}
      {message && (
        <p
          className={`
            text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide text-center
            mt-1 sm:mt-0 ${colors.text}
          `}
        >
          {message}
        </p>
      )}

      {/* Keyframe styles dengan responsivitas */}
      <style jsx>{`
        /* Ukuran lompatan untuk Mobile */
        @keyframes waveBounce {
          0%,
          60%,
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.5;
          }
          30% {
            transform: translateY(-8px) scale(1.15);
            opacity: 1;
          }
        }

        /* Ukuran lompatan untuk Tablet & Desktop (sm ke atas) */
        @media (min-width: 640px) {
          @keyframes waveBounce {
            0%,
            60%,
            100% {
              transform: translateY(0) scale(1);
              opacity: 0.5;
            }
            30% {
              transform: translateY(-12px) scale(1.2);
              opacity: 1;
            }
          }
        }
      `}</style>
    </div>
  );
}
