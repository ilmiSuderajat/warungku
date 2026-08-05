import { createClient } from "@/utils/supabase/server";
import NavbarMitra from "../components/NavbarMitra";
import TopCardMitra from "../components/TopCardMitra";

export default async function MitraDashboard() {
  return (
    <div className="min-h-screen bg-gray-50/90">
      <NavbarMitra />

      <div className="w-full h-full flex flex-col items-center justify-start mt-2">
        <TopCardMitra />
      </div>
    </div>
  );
}
