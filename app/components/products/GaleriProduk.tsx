"use client";

import { useState } from "react";
import { ProdukGambarSlider } from "./ProdukGambarSlider";

export default function GaleriProduk({
  urls,
  children,
}: {
  urls: string[];
  children: React.ReactNode;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      <div className="w-full aspect-square bg-gray-200 relative overflow-hidden">
        <ProdukGambarSlider
          urls={urls}
          enableFullscreen
          onFullscreenChange={setIsFullscreen}
        />
      </div>

      {!isFullscreen && children}
    </>
  );
}
