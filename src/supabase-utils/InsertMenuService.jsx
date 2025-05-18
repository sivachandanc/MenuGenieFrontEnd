import { supabaseClient } from "./SupaBaseClient";

/**
 * Builds the correct payload based on business type and extracted item
 */
function buildMenuItemPayload(args, userId, businessID, businessType) {
  if (businessType === "cafe") {
    return {
      user_id: userId,
      business_id: businessID,
      name: args.name,
      category: args.category,
      description: args.description,
      size_options: args.size_options,
      dairy_options: args.dairy_options,
      tags: args.tags,
      form_options: args.form_options,
      available: true,
    };
  }

  // Add other business types as needed
  throw new Error(`Unsupported business type: ${businessType}`);
}

/**
 * Inserts a menu item into the proper Supabase table based on business type
 */
export async function insertMenuItem(args, userId, businessID, businessType) {
  const payload = buildMenuItemPayload(args, userId, businessID, businessType);

  // Map business type to table name
  const tableMap = {
    cafe: "menu_item_cafe",
    // restaurant: "menu_item_restaurant",
    // Add other types as needed
  };

  const table = tableMap[businessType];
  if (!table) throw new Error(`No table configured for: ${businessType}`);

  const { error } = await supabaseClient.from(table).insert([payload]);
  if (error) throw new Error(error.message);
}
