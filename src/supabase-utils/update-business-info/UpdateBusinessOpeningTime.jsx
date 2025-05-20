import { supabaseClient } from "../SupaBaseClient";

export async function UpdateBusinessOpeningTime(
  businessID,
  newOpeningTime,
  businessData
) {
  // Update description in business table
  const { error: updateDescriptionError } = await supabaseClient
    .from("business")
    .update({
      opening_time: newOpeningTime,
      updated_at: new Date().toISOString(),
    })
    .eq("business_id", businessID);

  if (updateDescriptionError) {
    throw new Error(
      `Failed to update "business" table: ${updateDescriptionError.message}`
    );
  }

  // Construct new context string
  const newContext = `Name of ${businessData.business_type} is ${businessData.name}\nDescription:\n${businessData.description}\nLocation: ${businessData.location}\nOpens at: ${newOpeningTime}\nCloses at: ${businessData.closing_time}`;

  // Get new embedding from embedding service
  const embeddingResponse = await fetch(
    `${import.meta.env.VITE_EMBEDDING_BACKEND_URL}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ context: newContext }]),
    }
  );

  if (!embeddingResponse.ok) {
    const errorText = await embeddingResponse.text();
    throw new Error(`Embedding API failed: ${errorText}`);
  }

  const { embeddings } = await embeddingResponse.json();
  if (!Array.isArray(embeddings)) {
    throw new Error("Invalid embedding response from API.");
  }

  // Update context + embedding in menu_context
  const { error: updateContextError } = await supabaseClient
    .from("menu_context")
    .update({
      context: newContext,
      embedding: embeddings[0],
      updated_at: new Date().toISOString(),
    })
    .eq("business_id", businessID)
    .eq("type", "description");

  if (updateContextError) {
    throw new Error(
      `Failed to update "menu_context" table: ${updateContextError.message}`
    );
  }

  return true;
}
