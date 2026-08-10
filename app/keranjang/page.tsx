import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function keranjangPage() {
  const supabase = await createClient();
  const session = await supabase.auth.getSession();

  if (!session.data.session) {
    redirect("/login?error=login_keranjang");
  }
  const { data: keranjang, error } = await supabase
    .from("keranjang")
    .select("id,jumlah,produk_mitra(id,nama_produk,harga)")
    .eq("user_id", session.data.session.user.id);
  if (error) {
    return <div>Error dari Supabase: {JSON.stringify(error)}</div>;
  }
  if (!keranjang || keranjang.length === 0) {
    return <div>Keranjang anda masih kosong!</div>;
  }

  const totalSemua = keranjang.reduce((total, item) => {
    // produk_mitra can be returned as an array by Supabase relation
    const produk = Array.isArray(item.produk_mitra)
      ? item.produk_mitra[0]
      : item.produk_mitra;
    const harga = produk?.harga ?? 0;
    return total + item.jumlah * harga;
  }, 0);

  return (
    <div>
      <h1>Keranjang</h1>
      {keranjang.map((item) => {
        const produk = Array.isArray(item.produk_mitra)
          ? item.produk_mitra[0]
          : item.produk_mitra;
        return (
          <div key={item.id}>
            <p>{produk?.nama_produk}</p>
            <p>Jumlah: {item.jumlah}</p>
            <p>Harga: Rp {produk?.harga}</p>
          </div>
        );
      })}
      <p>Total: {totalSemua}</p>
    </div>
  );
}
