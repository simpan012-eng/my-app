"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { MAX_IMAGES_PER_ENTRY } from "./constants";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function uploadHallOfFameImage(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Du måste vara inloggad för att ladda upp bilder." };
  }

  const file = formData.get("file") as File | null;
  const entryId = formData.get("entryId") as string | null;

  if (!file || !entryId) {
    return { error: "Filen eller posten saknas." };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Endast JPG, PNG, WEBP eller GIF är tillåtet." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { error: "Bilden är för stor (max 5 MB)." };
  }

  const { count, error: countError } = await supabase
    .from("hall_of_fame_images")
    .select("id", { count: "exact", head: true })
    .eq("entry_id", entryId);

  if (countError) {
    return { error: "Kunde inte kontrollera antal bilder: " + countError.message };
  }

  if ((count ?? 0) >= MAX_IMAGES_PER_ENTRY) {
    return {
      error: `Max ${MAX_IMAGES_PER_ENTRY} bilder är uppnått för den här årgången.`,
    };
  }

  const ext = file.name.split(".").pop();
  const path = `${entryId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("hall-of-fame-images")
    .upload(path, file);

  if (uploadError) {
    return { error: "Uppladdningen misslyckades: " + uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("hall-of-fame-images").getPublicUrl(path);

  const { error: insertError } = await supabase
    .from("hall_of_fame_images")
    .insert({
      entry_id: entryId,
      image_url: publicUrl,
      storage_path: path,
      created_by: user.id,
    });

  if (insertError) {
    return { error: "Kunde inte spara bilden: " + insertError.message };
  }

  revalidatePath("/hall-of-fame");
  return { success: true };
}

export async function deleteHallOfFameImage(imageId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Du måste vara inloggad för att radera bilder." };
  }

  // Hämta filens sökväg innan vi tar bort raden
  const { data: image, error: fetchError } = await supabase
    .from("hall_of_fame_images")
    .select("storage_path")
    .eq("id", imageId)
    .single();

  if (fetchError || !image) {
    return { error: "Bilden kunde inte hittas." };
  }

  // Radera filen i storage. RLS ser till att bara uppladdaren eller en admin kan.
  if (image.storage_path) {
    const { error: storageError } = await supabase.storage
      .from("hall-of-fame-images")
      .remove([image.storage_path]);

    if (storageError) {
      return { error: "Kunde inte radera filen: " + storageError.message };
    }
  }

  // Radera raden i databasen. RLS ser till att bara uppladdaren eller en admin kan.
  const { error: deleteError } = await supabase
    .from("hall_of_fame_images")
    .delete()
    .eq("id", imageId);

  if (deleteError) {
    return { error: "Kunde inte radera bilden: " + deleteError.message };
  }

  revalidatePath("/hall-of-fame");
  return { success: true };
}