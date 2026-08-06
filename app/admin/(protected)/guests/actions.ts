"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { GUEST_CATEGORIES, GUEST_SIDES } from "@/lib/types";
import type { GuestCategory } from "@/lib/types";
import { familyLabel } from "./family-label";
import {
  parseEnum,
  parseId,
  parseString,
  parseNullable,
  parseEmail,
  parseEmailList,
} from "@/app/shared/action-helpers";

// ---------------------------------------------------------------------------
// Guest CRUD
// ---------------------------------------------------------------------------

export async function createGuest(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const name = parseString(formData.get("name"));
  const category = parseEnum(formData.get("category"), GUEST_CATEGORIES);
  const family_id = parseId(formData.get("family_id"));

  if (!name) throw new Error("Name is required.");
  if (!category) throw new Error("Pick a category.");
  if (family_id === null) throw new Error("Family is required.");

  const { error } = await supabase
    .from("guests")
    .insert({ name, category, family_id });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/guests");
}

export async function updateGuest(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = parseId(formData.get("id"));
  const name = parseString(formData.get("name"));
  const category = parseEnum(formData.get("category"), GUEST_CATEGORIES);

  if (id === null) return { error: "Invalid id." };
  if (!name) return { error: "Name is required." };
  if (!category) return { error: "Pick a category." };

  const { error } = await supabase
    .from("guests")
    .update({ name, category })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/guests");
  return { success: true };
}

export async function deleteGuest(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = parseId(formData.get("id"));
  if (id === null) return { error: "Invalid id." };

  const { error } = await supabase.from("guests").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/guests");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Family CRUD
// ---------------------------------------------------------------------------

// Creates the family and its guests in one round trip, then reports back the
// new id and label so the caller can offer a "jump to it" link.
export async function createFamily(formData: FormData) {
  const { supabase } = await requireAdmin();
  const side = parseEnum(formData.get("side"), GUEST_SIDES);
  const { emails, invalid } = parseEmailList(formData.get("emails"));
  const phone = parseNullable(formData.get("phone"));

  if (!side) return { success: false as const, error: "Pick a side." };
  if (invalid)
    return { success: false as const, error: `Invalid email: ${invalid}` };

  // Rows are paired by index; blank names are treated as unused rows.
  const names = formData.getAll("guest_name");
  const categories = formData.getAll("guest_category");
  const guests: { name: string; category: GuestCategory }[] = [];
  for (let i = 0; i < names.length; i++) {
    const name = parseString(names[i]);
    if (!name) continue;
    const category = parseEnum(categories[i] ?? null, GUEST_CATEGORIES);
    if (!category)
      return {
        success: false as const,
        error: `Pick a category for "${name}".`,
      };
    guests.push({ name, category });
  }

  const { data, error } = await supabase
    .from("guest_families")
    .insert({ side, email: emails, phone })
    .select("id")
    .single();
  if (error) return { success: false as const, error: error.message };

  const familyId = data.id;

  if (guests.length > 0) {
    const { error: guestError } = await supabase
      .from("guests")
      .insert(guests.map((g) => ({ ...g, family_id: familyId })));
    if (guestError) {
      // The family exists, so surface the id rather than stranding it silently.
      revalidatePath("/admin/guests");
      return {
        success: false as const,
        error: `Family #${familyId} was created, but its guests could not be added: ${guestError.message}`,
      };
    }
  }

  revalidatePath("/admin/guests");
  return {
    success: true as const,
    id: familyId,
    side,
    label: familyLabel(
      guests.map((g) => g.name),
      familyId,
    ),
  };
}

export async function updateFamily(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = parseId(formData.get("id"));
  const side = parseEnum(formData.get("side"), GUEST_SIDES);
  const { emails, invalid } = parseEmailList(formData.get("emails"));
  const phone = parseNullable(formData.get("phone"));

  if (id === null) return { error: "Invalid id." };
  if (!side) return { error: "Pick a side." };
  if (invalid) return { error: `Invalid email: ${invalid}` };

  const { error } = await supabase
    .from("guest_families")
    .update({ side, email: emails, phone })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/guests");
  return { success: true };
}

export async function appendFamilyEmail(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = parseId(formData.get("id"));
  const email = parseEmail(formData.get("email"));

  if (id === null) return { error: "Invalid id." };
  if (!email) return { error: "Invalid email." };

  const { error } = await supabase.rpc("append_family_email", {
    family_row_id: id,
    new_email: email,
  });
  if (error) return { error: error.message };

  revalidatePath("/admin/guests");
  return { success: true };
}

export async function deleteFamily(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = parseId(formData.get("id"));
  if (id === null) return { error: "Invalid id." };

  const { error } = await supabase
    .from("guest_families")
    .delete()
    .eq("id", id);
  if (error) {
    return {
      error:
        error.message.includes("foreign key")
          ? "This family still has guests linked to it. Move or delete them first."
          : error.message,
    };
  }

  revalidatePath("/admin/guests");
  return { success: true };
}
