import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.is_admin ?? false;
  }

  return (
    <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-white/10 bg-black/10 px-6 py-4 text-neutral-300 backdrop-blur-lg">
      <div className="flex gap-6">
        <Link href="/">Start</Link>
        <Link href="/krokenkrew">KrökenKrew</Link>
        <Link href="/kontakt">Kontakt</Link>
        <Link href="/hall-of-fame">Hall of Fame</Link>
        <Link href="/kalender">Kalender</Link>
        {isAdmin && (
          <Link href="/admin" className="text-neutral-300 hover:text-white">
            Admin
          </Link>
        )}
      </div>

      <div>
        {user ? (
          <LogoutButton />
        ) : (
          <Link href="/login" className="font-semibold">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}