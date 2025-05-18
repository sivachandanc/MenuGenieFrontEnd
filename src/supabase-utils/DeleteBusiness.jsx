import { supabaseClient } from "./SupaBaseClient";

const tablesToPurge = ["business", "business_chat_info", "menu_context"];

const business_specific_tables = {
  restaurant: "menu_item_restaurant",
  cafe: "menu_item_cafe",
  food_truck: "menu_item_food_truck",
  bakery: "menu_item_bakery",
};

export async function DeleteBusiness(businessId, businessType) {
  try {
    // Generic tables
    for (const table of tablesToPurge) {
      const { error } = await supabaseClient
        .from(table)
        .delete()
        .eq("business_id", businessId);

      if (error) {
        throw new Error(`Failed to delete from "${table}": ${error.message}`);
      }
    }

    // Business-specific table
    const businessTable = business_specific_tables[businessType];
    if (!businessTable) {
      throw new Error(`Unsupported business type: ${businessType}`);
    }

    const { error: bizError } = await supabaseClient
      .from(businessTable)
      .delete()
      .eq("business_id", businessId);

    if (bizError) {
      throw new Error(
        `Failed to delete from business-specific table "${businessTable}": ${bizError.message}`
      );
    }
  } catch (err) {
    console.error("DeleteBusiness error:", err.message);
    throw err;
  }
}
