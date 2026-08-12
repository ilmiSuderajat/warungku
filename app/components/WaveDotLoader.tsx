"use client";

interface WaveDotLoaderProps {
  message?: string;
  dotCount?: number;
  color?: string;
}

export default function WaveDotLoader({
  message = "Memproses pesanan...",
  dotCount = 5,
  color = "indigo",
}: WaveDotLoaderProps) {
  const colorMap: Record<string, { dot: string; glow: string; text: string; bg: string; border: string }> = {
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

  const colors = colorMap[color] || colorMap.indigo;

  return (
    <div
      className={`inline-flex flex-col items-center gap-3 px-6 py-4 rounded-2xl ${colors.bg} border ${colors.border} backdrop-blur-sm`}
    >
      {/* Wave dots */}
      <div className="flex items-center gap-[6px]">
        {Array.from({ length: dotCount }).map((_, i) => (
          <span
            key={i}
            className={`block w-[10px] h-[10px] rounded-full ${colors.dot} ${colors.glow} shadow-lg`}
            style={{
              animation: "waveBounce 1.4s ease-in-out infinite",
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>

      {/* Message */}
      {message && (
        <p className={`text-xs font-semibold ${colors.text} tracking-wide`}>
          {message}
        </p>
      )}

      {/* Keyframe styles */}
      <style jsx>{`
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
      `}</style>
    </div>
  );
}
