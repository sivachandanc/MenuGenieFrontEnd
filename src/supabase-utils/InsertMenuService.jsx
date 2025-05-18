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

function buildMenuEmbeddingPayload(insertedMenu, businessType) {
  if (businessType === "cafe") {
    const context = [
      `name: ${insertedMenu.name}`,
      `category: ${insertedMenu.category}`,
      `description: ${insertedMenu.description}`,
      `size_options: ${JSON.stringify(insertedMenu.size_options)}`,
      `dairy_options: ${JSON.stringify(insertedMenu.dairy_options)}`,
      `tags: ${JSON.stringify(insertedMenu.tags)}`,
      `form_options: ${JSON.stringify(insertedMenu.form_options)}`,
      `available: ${insertedMenu.available}`,
    ].join("\n");
    return context;
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

  const { data: insertedMenuItems, error: insertError } = await supabaseClient
    .from(table)
    .insert([payload])
    .select();
  if (insertError || !insertedMenuItems || insertedMenuItems.length === 0) {
    throw new Error("Failed to insert business data.");
  }
  for (const insertedMenu of insertedMenuItems) {
    const context = buildMenuEmbeddingPayload(insertedMenu, businessType);
    const response = await fetch(
      `${import.meta.env.VITE_EMBEDDING_BACKEND_URL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ context: context }]),
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Embedding API failed for Menu: ${errorText}`);
    }
    const { embeddings } = await response.json();
    if (!Array.isArray(embeddings)) {
      throw new Error("Invalid embedding response(menu item) from API.");
    }

    const contextPayload = {
      user_id: userId,
      business_id: businessID,
      item_id: insertedMenu.item_id,
      context: context,
      type: "menu_item",
      embedding: embeddings[0],
    };
    console.log("embedding_payload:")
    console.log(contextPayload)


    const { error: contextInsertError } = await supabaseClient
      .from("menu_context")
      .insert([contextPayload]);

    if (contextInsertError) {
      throw new Error("Failed to insert embeddings into menu_context.");
    }
  }
}
