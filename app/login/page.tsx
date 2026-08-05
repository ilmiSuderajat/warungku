"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { login } from "./viewModel";
import { createClient } from "@/utils/supabase/client";
import { getUserRole } from "@/app/viewModels/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("error") === "belum_login") {
      toast.error("Anda harus login untuk melanjutkan ke checkout.");
    }
    if (searchParams.get("error") === "login_keranjang") {
      toast.error("Anda harus login untuk melihat keranjang.");
    }
  }, [searchParams]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await login(email, password);

    if (!result.success) {
      setLoading(false);
      setError(result.message);
      return;
    }

    const supabase = await createClient();
    const role = await getUserRole(supabase);
    setLoading(false);

    // Ganti router.push jadi window.location.href (full reload)
    window.location.href = role === "mitra" ? "/mitra" : "/";
  }
  return (
    <div style={{ maxWidth: 400, margin: "80px auto" }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 12 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{ padding: 8, width: "100%" }}
        >
          {loading ? "Memproses..." : "Login"}
        </button>
      </form>
    </div>
  );
}
