import { getTotalKeranjang } from "@/utils/cart";
import BannerPromo from "./components/BannerPromo";
import DataKeranjang from "./components/DataKeranjang";
import KategoriCard from "./components/KategoriCard";
import Produk from "./components/Produk";
import SearchBar from "./components/SearchBar";
import TopCard from "./components/TopCard";
import ProdukPage from "./produk/page";
export default async function Home() {
  const totalItem = await getTotalKeranjang();
  return (
    <div className="w-full  bg-gray-100 ">
      <SearchBar totalItem={totalItem} />
      <div className="w-full md:w-[80%] md:mx-auto ">
        <TopCard />
        <KategoriCard />
        <BannerPromo />
      </div>
      <div className="min-h-screen">
        <ProdukPage />
      </div>
    </div>
  );
}
