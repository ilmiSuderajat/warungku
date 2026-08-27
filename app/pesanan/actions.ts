"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function batalkanPesanan(pesananId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Sesi login sudah berakhir." };
  }

  const { error } = await supabase
    .from("pesanan")
    .update({
      status_pesanan: "dibatalkan",
      alasan_pembatalan: "Dibatalkan oleh pembeli",
    })
    .eq("id", pesananId)
    .eq("user_id", user.id)
    .eq("status_pesanan", "menunggu");

  if (error) {
    return { success: false, message: "Pesanan gagal dibatalkan." };
  }

  revalidatePath(`/pesanan/${pesananId}`);
  revalidatePath("/pesanan");
  return { success: true, message: "Pesanan berhasil dibatalkan." };
}
