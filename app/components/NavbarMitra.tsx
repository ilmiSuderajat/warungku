import { createClient } from "@/utils/supabase/server";
import { Store, List } from "lucide-react";
export default async function NavbarMitra() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: item, error } = await supabase
    .from("toko_mitra")
    .select("nama_toko")
    .eq("pemilik_id", user?.id)
    .single();

  if (error) {
    console.error("Error fetching toko_mitra:", error);
    return <div>Error fetching toko_mitra: {error.message}</div>;
  }
  return (
    <div className="bg-indigo-600 shadow-lg py-4 px-6 flex  text-center items-center justify-between">
      <Store className="h-8 w-8 mr-5 text-white" />
      <h1 className="text-white text-xl font-bold font-['Arimo'] letter-spacing-wide">
        Mitra {item?.nama_toko}
      </h1>
      <List className="h-8 w-8 ml-18 text-white md:hidden transition-transform duration-100 ease-in-out active:scale-85" />
      <div className="flex items-center space-x-4"></div>
    </div>
  );
}
