import { createClient } from "@/utils/supabase/server";
import { Menu, Store } from "lucide-react";

export default async function NavbarMitra() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: item } = await supabase
    .from("toko_mitra")
    .select("nama_toko")
    .eq("pemilik_id", user?.id)
    .maybeSingle();

  return (
    <header className="border-b border-indigo-500/20 bg-indigo-700 text-white shadow-sm">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
            <Store className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-100">
              Mitra Warungku
            </p>
            <h1 className="truncate text-base font-bold sm:text-lg">
              {item?.nama_toko || "Dashboard Mitra"}
            </h1>
          </div>
        </div>

        <button
          type="button"
          aria-label="Buka menu mitra"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 transition hover:bg-white/15 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
