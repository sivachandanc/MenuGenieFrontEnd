import {
    GoogleGenAI,
    Type,
    createUserContent,
    createPartFromUri,
  } from "@google/genai";
  
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_KEY,
  });
  
  const cafeMenu = {
    name: "cafe_item",
    description: "Details about an item served in a Cafe",
    parameters: {
      type: Type.OBJECT,
      properties: {
        name: {
          type: Type.STRING,
          description: "Name of the Item sold",
        },
        category: {
          type: Type.STRING,
          description:
            'Type of Item: "Coffee", "Tea", "Iced Beverages", "Pastries", "Smoothies", "Juices"',
        },
        size_options: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              size: {
                type: Type.STRING,
                description: "Size name (e.g., Small, Medium, Large, etc.)"
              },
              price: {
                type: Type.NUMBER,
                description: "Price of this size"
              }
            },
            required: ["size", "price"]
          },
          description: "List of sizes and their corresponding prices"
        },
        dairy_options: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description:
            'Available dairy options: "Oat Milk", "Almond Milk", "2% Milk", "Whole Milk", "Non-Dairy"',
        },
        tags: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description:
            'Item tags: "vegan", "gluten-free", "caffeinated", "popular", "seasonal"',
        },
        description: {
          type: Type.STRING,
          description: "Description of the Item",
        },
        form_options: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Form options: "Hot", "Cold", "Frozen"',
        },
      },
      required: [
        "name",
        "category",
        "size_options",
        "dairy_options",
        "tags",
        "description"
      ],
    },
  };
  
  
  export async function ExtractCafeItemsFromBlob(fileBlob) {
      try {
        const myfile = await ai.files.upload({
          file: fileBlob,
          config: { mimeType: fileBlob.type },
        });
    
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: createUserContent([
            createPartFromUri(myfile.uri, myfile.mimeType),
            "Generate details about the items in the menu",
          ]),
          config: {
            tools: [
              {
                functionDeclarations: [cafeMenu],
              },
            ],
          },
        });
    
        const functionCalls = response.functionCalls;
        return functionCalls.map((call) => ({
          functionName: call.name,
          arguments: call.args,
        }));
      } catch (error) {
        console.error("Failed to extract cafe items:", error);
        return [];
      }
    }
    
  
  // Example usage:
  // import { extractCafeItemsFromImage } from './path-to-this-file';
  // const results = await extractCafeItemsFromImage("/path/to/menu.jpeg");
  