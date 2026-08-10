import imageCompression from "browser-image-compression";

export async function compressImage(file) {
  const options = {
    maxSizeMB: 0.02, // target ~20KB
    maxWidthOrHeight: 512, // resize dulu biar gak perlu resolusi gede
    fileType: "image/webp",
    initialQuality: 0.7,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Gagal kompres gambar:", error);
    throw error;
  }
}
