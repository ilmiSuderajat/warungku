import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getUserRole } from "@/app/viewModels/auth";

export default async function MitraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const role = await getUserRole(supabase);

  if (role !== "mitra") {
    redirect("/login");
  }

  return <>{children}</>;
}
