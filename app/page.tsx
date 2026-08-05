import DataKeranjang from "./components/DataKeranjang";
import Produk from "./components/Produk";
import SearchBar from "./components/SearchBar";
import TopCard from "./components/TopCard";
import ProdukPage from "./produk/page";
export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gray-50/90 ">
      <SearchBar />
      <div className="w-full md:w-[80%] md:mx-auto  ">
        <TopCard />
      </div>
      <div>
        <ProdukPage />
      </div>
    </div>
  );
}
