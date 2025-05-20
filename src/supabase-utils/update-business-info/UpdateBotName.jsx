import { supabaseClient } from "../SupaBaseClient";

export async function UpdateBotName(
  businessID,
  newName
) {
  // Update description in business table
  const { error: updateBotName } = await supabaseClient
    .from("business")
    .update({
      bot_name: newName,
      updated_at: new Date().toISOString(),
    })
    .eq("business_id", businessID);

  if (updateBotName) {
    throw new Error(
      `Failed to update "business" table: ${updateBotName.message}`
    );
  }

  const { error: updateBotNameInInfo } = await supabaseClient
    .from("business_chat_info")
    .update({
      bot_name: newName,
      updated_at: new Date().toISOString(),
    })
    .eq("business_id", businessID);

  if (updateBotNameInInfo) {
    throw new Error(
      `Failed to update "business_chat_info" table: ${updateBotNameInInfo.message}`
    );
  }

  return true;
}
