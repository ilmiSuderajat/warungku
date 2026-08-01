import { createClient } from "@/utils/supabase/server";

export async function getTotalKeranjang() {
  const supabase = await createClient();
  const { data: keranjang, error } = await supabase
    .from("keranjang")
    .select("jumlah");

  if (error || !keranjang) {
    console.error("Error Supabase:", error);
    return 0;
  }

  // Hitung total jumlah menggunakan .reduce()
  return keranjang.reduce((total, item) => total + item.jumlah, 0);
}
