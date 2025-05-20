import { supabaseClient } from "../SupaBaseClient";

export async function DeleteMenuItem(menuTable, itemID) {
  if (!menuTable || typeof menuTable !== "string") {
    throw new Error("Invalid menuTable value");
  }

  const { error: menuItemDeleteError } = await supabaseClient
    .from(menuTable)
    .delete()
    .eq("item_id", itemID);

  if (menuItemDeleteError) {
    throw new Error(
      `Failed to delete menu item from ${menuTable}: ${menuItemDeleteError.message}`
    );
  }

  const { error: contextDeleteError } = await supabaseClient
    .from("menu_context")
    .delete()
    .eq("item_id", itemID);

  if (contextDeleteError) {
    throw new Error(
      `Failed to delete menu context from menu_context: ${contextDeleteError.message}`
    );
  }

  return true;
}
