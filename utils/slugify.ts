import { SupabaseClient } from "@supabase/supabase-js";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function generateUniqueSlug(
  supabase: SupabaseClient,
  nama: string,
): Promise<string> {
  let slug = slugify(nama);
  let counter = 1;

  while (true) {
    const { data } = await supabase
      .from("produk_mitra")
      .select("id")
      .eq("slug", slug);

    if (!data || data.length === 0) break;

    slug = `${slugify(nama)}-${counter}`;
    counter++;
  }

  return slug;
}
