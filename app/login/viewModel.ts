import { createClient } from "@/utils/supabase/client";

export async function login(email: string, password: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message === "Invalid login credentials") {
      return {
        success: false,
        message: "Email atau password salah. Silakan coba lagi.",
      };
    }
    return { success: false, message: error.message };
  }

  return { success: true, message: null };
}
