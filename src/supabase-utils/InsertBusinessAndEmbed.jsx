import { supabaseClient } from "./SupaBaseClient";

export async function insertBusinessAndEmbed(formData) {
  // 1. Authenticate user
  const {
    data: { session },
    error: sessionError,
  } = await supabaseClient.auth.getSession();

  if (sessionError || !session?.user) {
    throw new Error("Authentication error. Please log in again.");
  }

  const userId = session.user.id;

  // 2. Prepare business payload
  const businessPayload = {
    user_id: userId,
    name: formData.business_name,
    business_type: formData.business_type,
    location: formData.location,
    description: formData.business_description,
    email: formData.email,
    phone: formData.phone,
    opening_time: formData.openingTime,
    closing_time: formData.closingTime,
    website: formData.website,
    top_items: formData.topItems,
    ownership_tags: formData.ownershipTags,
    bot_name: formData.botName,
    bot_personality: formData.tone,
  };

  // 3. Insert business
  const { data: businessInsertData, error: insertError } = await supabaseClient
    .from("business")
    .insert(businessPayload)
    .select();

  if (insertError || !businessInsertData || businessInsertData.length === 0) {
    throw new Error("Failed to insert business data.");
  }

  const business = businessInsertData[0];

  // 4. Build embedding contexts
  const contextBlocks = [
    {
      context: `Top selling items (According to owner): ${business.top_items}`,
      type: "top_seller",
    },
    {
      context: `Name of ${business.business_type} is ${business.name}\nDescription:\n${business.description}\nLocation: ${business.location}\nOpens at:${business.opening_time}\nCloses at:${business.closing_time}`,
      type: "description",
    },
    {
      context: `This cafe is: ${business.ownership_tags.join(", ")}`,
      type: "ownership",
    },
    {
      context: `Contact Info:\nEmail: ${business.email}\nPhone: ${business.phone}\nWebsite: ${business.website}`,
      type: "contact",
    },
  ];

  // 5. Send to embedding API
  const response = await fetch(`${import.meta.env.VITE_EMBEDDING_BACKEND_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contextBlocks.map((c) => ({ context: c.context }))),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Embedding API failed: ${errorText}`);
  }

  const { embeddings } = await response.json();
  if (!Array.isArray(embeddings) || embeddings.length !== contextBlocks.length) {
    throw new Error("Invalid embedding response from API.");
  }

  // 6. Build payload for menu_context
  const contextPayload = contextBlocks.map((block, index) => ({
    user_id: userId,
    business_id: business.business_id,
    type: block.type,
    context: block.context,
    embedding: embeddings[index], // float[] vector
  }));

  // 7. Batch insert into menu_context
  const { error: contextInsertError } = await supabaseClient
    .from("menu_context")
    .insert(contextPayload);

  if (contextInsertError) {
    throw new Error("Failed to insert embeddings into menu_context.");
  }

  // 8. Done
  return { business, inserted_contexts: contextPayload.length };
}
