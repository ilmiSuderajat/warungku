import DataKeranjang from "./components/DataKeranjang";
import Produk from "./components/Produk";
import SearchBar from "./components/SearchBar";
import TopCard from "./components/TopCard";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gray-50/90 ">
      <SearchBar />
      <div>
        <TopCard />
      </div>
      <div>
        <Produk />
      </div>
    </div>
  );
}
