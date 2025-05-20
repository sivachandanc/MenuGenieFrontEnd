import { supabaseClient } from "../SupaBaseClient";

export async function UpdateBotPersonality(
  businessID,
  newPersonality
) {
  // Update Bot Personality in business table
  const { error: updateBotPersonality } = await supabaseClient
    .from("business")
    .update({
      bot_personality: newPersonality,
      updated_at: new Date().toISOString(),
    })
    .eq("business_id", businessID);

  if (updateBotPersonality) {
    throw new Error(
      `Failed to update "business" table: ${updateBotPersonality.message}`
    );
  }

  return true;
}
