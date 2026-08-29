import imageCompression from "browser-image-compression";
import { SupabaseClient } from "@supabase/supabase-js";

export async function uploadFotoPatokan(
  supabase: SupabaseClient,
  userId: string,
  file: File,
): Promise<string | null> {
  if (!file) return null;

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: 0.05,
      maxWidthOrHeight: 800,
      fileType: "image/webp",
      initialQuality: 0.8,
    });

    const fileName = `${userId}/${Date.now()}.webp`;

    const { error } = await supabase.storage
      .from("alamat-foto")
      .upload(fileName, compressed, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Gagal upload foto patokan:", error);
      return null;
    }

    const { data } = supabase.storage
      .from("alamat-foto")
      .getPublicUrl(fileName);
    return data.publicUrl;
  } catch (error) {
    console.error("Terjadi error saat kompres & upload foto patokan:", error);
    return null;
  }
}
