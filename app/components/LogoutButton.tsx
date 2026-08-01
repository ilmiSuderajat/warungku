"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh(); // penting: paksa Server Component baca ulang sesi terbaru
    }

    return (
        <button
            className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
            onClick={handleLogout}
            type="button"
        >
            Logout
        </button>
    );
}
