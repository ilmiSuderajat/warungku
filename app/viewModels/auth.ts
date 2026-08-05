import { SupabaseClient } from "@supabase/supabase-js";

export async function getUserRole(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return typeof data?.role === "string" ? data.role.trim().toLowerCase() : null;
}
