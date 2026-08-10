import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Store } from "lucide-react";

export default async function StoreControlCard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Ambil status toko mitra langsung dari tabel toko_mitra
  const { data: toko } = await supabase
    .from("toko_mitra")
    .select("is_buka")
    .eq("pemilik_id", user.id)
    .single();

  const isOpen = toko?.is_buka ?? true;

  async function toggleStore() {
    "use server";
    const sb = await createClient();

    const {
      data: { user },
    } = await sb.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const { data: currentProfile, error: fetchError } = await sb
      .from("toko_mitra")
      .select("is_buka")
      .eq("pemilik_id", user.id)
      .single();

    if (fetchError || !currentProfile) {
      throw new Error("Profil toko tidak ditemukan");
    }

    const { error: updateError } = await sb
      .from("toko_mitra")
      .update({
        is_buka: !currentProfile.is_buka,
      })
      .eq("pemilik_id", user.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    revalidatePath("/mitra");
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            isOpen
              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
              : "bg-red-50 text-red-700 ring-1 ring-red-100"
          }`}
        >
          <Store className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">
            Status Operasional Toko
          </p>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            {isOpen
              ? "Warung sedang buka dan menerima pesanan."
              : "Warung sedang tutup"}
          </p>
        </div>
      </div>

      <form action={toggleStore} className="mt-5">
        <button
          type="submit"
          className={`w-full rounded-xl px-4 py-2.5 text-sm font-bold transition ${
            isOpen
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          }`}
        >
          {isOpen ? "Tutup Warung" : "Buka Warung"}
        </button>
      </form>
    </section>
  );
}
