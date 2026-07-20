"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";

type CreateUserResult = { error: string } | { success: true };

// Gör om användarnamnet till en e-postsäker sträng: tar bort åäö-prickar,
// gör allt till gemener, och byter ut allt som inte är a-z/0-9 mot inget.
function slugifyUsername(username: string) {
  return username
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // tar bort diakritiska tecken (å->a, ä->a, ö->o)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export async function createUserAction(
  formData: FormData
): Promise<CreateUserResult> {
  // Throws/redirects if the caller isn't a logged-in admin.
  await requireAdmin();

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Alla fält krävs" };
  }
  if (password.length < 8) {
    return { error: "Lösenordet måste vara minst 8 tecken" };
  }

  const slug = slugifyUsername(username);
  if (!slug) {
    return { error: "Användarnamnet måste innehålla minst en bokstav eller siffra" };
  }

  // Ingen riktig inkorg finns bakom denna adress — den används bara internt
  // av Supabase Auth som kontoidentifierare. Användaren loggar alltid in
  // med username, aldrig med denna adress.
  const email = `${slug}@krokenkrew.local`;

  const supabaseAdmin = createAdminClient();

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user) {
    if (error?.message.toLowerCase().includes("already been registered")) {
      return { error: "Ett konto med ett liknande användarnamn finns redan" };
    }
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

type ResetPasswordResult = { error: string } | { success: true };

export async function resetPasswordAction(
  userId: string,
  newPassword: string
): Promise<ResetPasswordResult> {
  // Throws/redirects if the caller isn't a logged-in admin.
  await requireAdmin();

  if (newPassword.length < 8) {
    return { error: "Lösenordet måste vara minst 8 tecken" };
  }

  const supabaseAdmin = createAdminClient();

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}