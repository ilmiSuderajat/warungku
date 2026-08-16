import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
export default async function DataKeranjang() {
  const supabase = await createClient();
  const session = await supabase.auth.getSession();

  const { data: keranjang, error } = await supabase
    .from("keranjang")
    .select("jumlah");
  if (!session.data.session) {
    return <div>Anda harus login untuk melihat keranjang</div>;
  }
  if (error) {
    return <div>Error dari Supabase: {JSON.stringify(error)}</div>;
  }

  return (
    <div>
      <h1>keranjang Saya</h1>
      <p>
        Total item di keranjang:{" "}
        {keranjang.reduce((total, item) => total + item.jumlah, 0)}
      </p>
      <Link href="/keranjang">
        <button className="rounded-xl px-4 bg-amber-50 text-indigo-800 hover:bg-indigo-800 hover:text-white">
          halaman keranjang
        </button>
      </Link>
    </div>
  );
}
