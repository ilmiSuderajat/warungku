'use client'
import { useState } from "react";
import TombolBayar from "./TombolBayar";

export default function FormCheckout({
  prosesBayar,
  stok,
}: {
    prosesBayar: (jumlah: number) => Promise<{ success: boolean; message: string }>;
  stok: number;
}) {
  const [jumlah, setJumlah] = useState(1);

  return (
    <div>
      <input
        type="number"
        value={jumlah}
        onChange={(e) => setJumlah(Number(e.target.value))}
        min={1}
        max={stok}
      />
      <TombolBayar action={async () => await prosesBayar(jumlah)} />
    </div>
  );
}