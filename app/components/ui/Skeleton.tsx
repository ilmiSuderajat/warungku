interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6" aria-label="Memuat produk">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white"
          >
            <Skeleton className="aspect-square rounded-none" />
            <div className="space-y-3 p-3">
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-5 w-3/5" />
              <Skeleton className="h-3 w-2/5" />
              <div className="flex justify-between gap-2">
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PesananSkeleton() {
  return (
    <div
      className="min-h-screen bg-gray-50/90 pb-24"
      aria-label="Memuat pesanan"
    >
      <div className="bg-indigo-800 p-5 sm:p-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 bg-indigo-600" />
            <Skeleton className="h-7 w-40 bg-indigo-600" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-4 px-4 pt-4">
        <div className="flex gap-2 overflow-hidden pb-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-20 shrink-0" />
          ))}
        </div>

        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="space-y-4 rounded-lg border border-gray-100 bg-white p-5"
          >
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="space-y-2">
                <Skeleton className="h-3 w-36" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
            <div className="flex items-start gap-4">
              <Skeleton className="h-16 w-16 shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-3 w-2/5" />
              </div>
            </div>
            <Skeleton className="h-12 w-full" />
            <div className="flex items-center justify-between border-t border-gray-200 pt-3">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
