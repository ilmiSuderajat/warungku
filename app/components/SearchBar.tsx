import {
  ChatBubbleLeftEllipsisIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { getTotalKeranjang } from "@/utils/cart";
import Link from "next/link";
import Button from "./Button";
import { createClient } from "@/utils/supabase/client";

export default function SearchBar() {
  const totalItem = getTotalKeranjang();

  return (
    <div className="w-full h-20 grid grid-rows-3 md:grid-rows-4 md:w-[80%] md:mx-auto  ">
      <div className="h-20 px-3 py-2 row-span-1 flex items-center justify-center bg-indigo-800 ">
        <h1 className="text-white font-bold text-3xl hidden md:block mr-8 font-['Sacramento']">
          WarungKita
        </h1>
        <input
          className="bg-white w-[80%] h-[70%] text-center rounded-sm indigo-700 text-gray-800 placeholder:text-indigo-300 border-none focus:outline-none md:w-[60%] md:h-[70%]"
          type="text"
          placeholder="Cari Apakih ..?"
        />
        <div className="relative inline-block ml-3 md:ml-4">
          <Link href="/chat">
            <ChatBubbleLeftEllipsisIcon className="w-8 h-8 text-white transition-transform duration-100 ease-in-out active:scale-85" />
          </Link>
          <p
            id="countChat"
            className="absolute -top-1 -right-1 bg-white text-indigo-700 text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center md:h-5 md:w-5 md:text-sm md:-top-2 md:right-0.5"
          >
            0
          </p>
        </div>
        <div className="relative inline-block ml-2 md:ml-4 ">
          <Link href="/keranjang">
            <ShoppingCartIcon className="w-8 h-8 text-white transition-transform duration-100 ease-in-out active:scale-85 " />
          </Link>
          <p
            id="count"
            className="absolute -top-1 -right-1  bg-white text-indigo-700 text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center md:h-5 md:w-5 md:text-sm md:-top-2 md:right-0.5"
          >
            {totalItem}
          </p>
        </div>
      </div>
    </div>
  );
}
