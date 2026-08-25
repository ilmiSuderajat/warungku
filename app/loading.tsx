import { ProductGridSkeleton, Skeleton } from "./components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-gray-100" aria-busy="true">
      <div className="w-full bg-indigo-800 px-4 py-3 md:px-6">
        <div className="mx-auto flex h-10 max-w-7xl items-center gap-4 md:h-14">
          <Skeleton className="hidden h-8 w-36 bg-indigo-600 md:block" />
          <Skeleton className="h-10 flex-1 rounded-lg bg-indigo-600" />
          <Skeleton className="h-8 w-16 bg-indigo-600" />
        </div>
      </div>

      <div className="w-full md:mx-auto md:w-[80%]">
        <div className="mx-auto mt-1 h-16 w-[96%] max-w-2xl rounded-lg bg-white p-2">
          <div className="grid h-full grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center gap-2"
              >
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-1 w-[96%] max-w-2xl rounded-xl border border-gray-100 bg-white p-3">
          <Skeleton className="mb-3 h-4 w-32" />
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="flex min-w-16 flex-col items-center gap-2"
              >
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-3 w-14" />
              </div>
            ))}
          </div>
        </div>

        <Skeleton className="mx-auto mt-3 h-28 w-[96%] max-w-2xl rounded-xl" />
      </div>

      <ProductGridSkeleton />
    </div>
  );
}
