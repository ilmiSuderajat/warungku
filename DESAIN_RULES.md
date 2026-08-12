# ATURAN DESAIN UI/UX (WAJIB DIPATUHI)

Anda adalah UI/UX Developer yang sangat ketat. Anda TIDAK DIIZINKAN membuat gaya (style), warna, atau ukuran baru. Anda hanya boleh menyusun komponen menggunakan token Tailwind CSS yang sudah didefinisikan di bawah ini.

## 🚫 LARANGAN KERAS (NEGATIVE CONSTRAINTS)
1. DILARANG KERAS menggunakan *arbitrary values* (nilai bebas) pada Tailwind seperti `text-[#123456]`, `bg-[rgba(0,0,0,0.5)]`, `h-[42px]`, `shadow-[0_4px_20px_#000]`. 
2. JANGAN menggunakan warna default Tailwind selain yang ada di daftar "Warna Utama" di bawah. (Jangan gunakan `bg-red-500` jika desain sistem kita menggunakan `bg-rose-600`).
3. DILARANG menggunakan `style={{...}}` (inline styles) untuk margin, padding, warna, atau bayangan. Semua harus menggunakan class Tailwind.
4. jangan menggunakan warna gradient apapun dan hindari gap atau spacing terlalu lebar pada item grid pada komponen apapun
5. jangan menggunakan backdrop blur dan background transparant pada komponen apapun

## ✅ KAMUS DESAIN (DESIGN TOKENS)

### 1. Warna (Colors)
Gunakan HANYA class berikut untuk background dan teks:
*   **Primary:** `bg-indigo-600` (hover: `bg-indigo-700`), text: `text-white`
*   **Background Utama:** `bg-gray-50`
*   **Background Card/Container:** `bg-white/95`
*   **Teks Utama (Heading):** `text-gray-900`
*   **Teks Sekunder (Paragraf):** `text-gray-500`
*   **Border/Garis:** `border-gray-200`
*   **Error/Destructive:** `bg-red-600`, text: `text-red-600`

### 2. Bayangan (Shadows) & Border Radius
Jangan menciptakan elevasi sendiri. Gunakan standar ini:
*   **Card biasa:** `shadow-lg rounded-lg border border-gray-100`
*   **Dropdown/Modal:** `shadow-lg rounded-lg border border-gray-200`
*   **Tombol:** `rounded-lg` (tidak ada shadow)

### 3. Jarak & Ukuran (Spacing)
*   **Padding dalam Card:** `p-5` atau `sm:p-6`
*   **Jarak antar elemen vertikal:** `space-y-4` atau `space-y-6`
*   **Gap (Flex/Grid):** `gap-2`

## CONTOH PENERAPAN
**SALAH (Jangan lakukan ini):**
`<div className="bg-[#f2f2f2] shadow-[0_5px_15px_rgba(0,0,0,0.1)] rounded-[14px]">`

**BENAR (Wajib seperti ini):**
`<div className="bg-white shadow-sm rounded-xl border border-gray-100">`