import { supabaseClient } from "../SupaBaseClient";

export async function UpdateBusinessTags(
  businessID,
  newTags,
) {
  // Update description in business table
  const { error: updateDescriptionError } = await supabaseClient
    .from("business")
    .update({
      ownership_tags: newTags,
      updated_at: new Date().toISOString(),
    })
    .eq("business_id", businessID);

  if (updateDescriptionError) {
    throw new Error(
      `Failed to update "business" table: ${updateDescriptionError.message}`
    );
  }

  // Construct new context string
  const newContext = `This cafe is: ${newTags.join(", ")}`;

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
    .eq("type", "ownership");

  if (updateContextError) {
    throw new Error(
      `Failed to update "menu_context" table: ${updateContextError.message}`
    );
  }

  return true;
}
