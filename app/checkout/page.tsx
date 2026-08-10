import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import FormCheckout from "@/app/components/FormCheckout";
import { redirect } from "next/navigation";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { productId: string };
}) {
  const params = await searchParams;
  const productId = params.productId;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=belum_login");
  }

  const { data: produk, error } = await supabase
    .from("produk_mitra")
    .select("*")
    .eq("id", productId)
    .single();

  if (error || !produk) {
    return <div>Produk tidak ditemukan.</div>;
  }

  // Cek alamat utama SEBELUM render, biar user diarahkan lebih dulu kalau belum ada
  const { data: alamatUtama } = await supabase
    .from("alamat")
    .select("id, label, alamat_lengkap")
    .eq("user_id", user.id)
    .eq("is_utama", true)
    .single();

  if (!alamatUtama) {
    redirect("/alamat?error=belum_ada_alamat");
  }

  async function prosesBayar(jumlah: number) {
    "use server";
    const supabaseServer = await createClient();

    const { data, error } = await supabaseServer.rpc("buat_pesanan", {
      p_produk_id: produk.id,
      p_jumlah: jumlah,
      p_alamat_id: alamatUtama?.id,
    });

    if (error) {
      console.error("Gagal:", error.message);
      return {
        success: false,
        message: "Gagal Membuat Pesanan: " + error.message,
      };
    }
    revalidatePath("/checkout");
    return { success: true, message: "Berhasil Membuat Pesanan" };
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Halaman Checkout</h1>
      <hr />
      <div
        style={{
          background: "#f9f9f9",
          padding: "15px",
          margin: "15px 0",
          borderRadius: "8px",
          color: "#333",
        }}
      >
        <h3>Ringkasan Pesanan Kamu:</h3>
        <p>
          <strong>Produk:</strong> {produk.nama_produk}
        </p>
        <p>
          <strong>Harga:</strong> Rp {produk.harga}
        </p>
        <p>
          <strong>Stok Tersedia:</strong> {produk.stok}
        </p>
        <p>
          <strong>Dikirim ke:</strong> {alamatUtama.label} -{" "}
          {alamatUtama.alamat_lengkap}
        </p>
      </div>

      <FormCheckout prosesBayar={prosesBayar} stok={produk.stok} />
    </div>
  );
}
