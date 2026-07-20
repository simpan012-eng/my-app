import { Suspense } from "react";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import CreateUserForm from "./create-user";
import UserList from "./user-list";

async function AdminContent() {
  const currentUser = await requireAdmin(); // redirects away if not an admin

  const supabaseAdmin = createAdminClient();
  const { data: users } = await supabaseAdmin
    .from("profiles") 
    .select("id, username, is_admin")
    .order("username");

  return (
    <div className="mx-auto max-w-md space-y-16">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">
          Skapa användare
        </h1>
        <p className="text-sm text-neutral-400 mb-8">
          Endast admin kan skapa konton. Den nya användaren loggar in med
          användarnamn och lösenord.
        </p>
        <CreateUserForm />
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-4">Användare</h2>
        <UserList users={users ?? []} currentUserId={currentUser.id} />
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-16">
      <Suspense
        fallback={
          <div className="mx-auto max-w-md animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-neutral-800" />
            <div className="h-40 w-full rounded bg-neutral-900" />
          </div>
        }
      >
        <AdminContent />
      </Suspense>
    </div>
  );
}