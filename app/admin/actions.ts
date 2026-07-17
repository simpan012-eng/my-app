"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";

type CreateUserResult = { error: string } | { success: true };

export async function createUserAction(
  formData: FormData
): Promise<CreateUserResult> {
  // Throws/redirects if the caller isn't a logged-in admin.
  await requireAdmin();

  const username = String(formData.get("username") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !email || !password) {
    return { error: "Alla fält krävs" };
  }
  if (password.length < 8) {
    return { error: "Lösenordet måste vara minst 8 tecken" };
  }

  const supabaseAdmin = createAdminClient();

  // Create the auth user. email_confirm: true skips the confirmation
  // email flow since an admin is vouching for this account directly.
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user) {
    return { error: error?.message ?? "Kunde inte skapa användaren" };
  }

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .upsert({ id: data.user.id, username, is_admin: false }, { onConflict: "id" });

  if (profileError) {
    // Roll back the auth user so we don't leave an orphaned account
    // with no matching profile/username.
    await supabaseAdmin.auth.admin.deleteUser(data.user.id);
    return { error: "Användarnamnet är upptaget eller ogiltigt" };
  }

  revalidatePath("/admin");
  return { success: true };
}

type DeleteUserResult = { error: string } | { success: true };

export async function deleteUserAction(
  userId: string
): Promise<DeleteUserResult> {
  // Throws/redirects if the caller isn't a logged-in admin.
  const currentUser = await requireAdmin();

  if (userId === currentUser.id) {
    return { error: "Du kan inte ta bort ditt eget konto" };
  }

  const supabaseAdmin = createAdminClient();

  // Delete the profile row explicitly first — don't rely on a cascade
  // being configured on the foreign key, since we can't guarantee it is.
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (profileError) {
    return { error: "Kunde inte ta bort profilen" };
  }

  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
    userId
  );

  if (authError) {
    return { error: authError.message };
  }

  revalidatePath("/admin");
  return { success: true };
}