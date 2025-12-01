import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResponse, DietaryRestriction } from "../types";

// Initialize the client. The API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    cuisineType: {
      type: Type.STRING,
      description: "The detected type of cuisine (e.g., Japanese Ramen, Thai, French Bistro)",
    },
    menuItems: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          originalName: { type: Type.STRING, description: "Exact text of the dish name on the menu" },
          translatedName: { type: Type.STRING, description: "Traditional Chinese translation" },
          ingredients: { type: Type.STRING, description: "Description of ingredients, texture, or taste. Must include '🚫' if it violates user restrictions." },
          price: { type: Type.STRING, description: "Price as shown on menu (e.g. $10, ¥1000)" },
          score: { type: Type.INTEGER, description: "Recommendation score from 1 to 5" },
        },
        required: ["originalName", "translatedName", "ingredients", "price", "score"],
      },
      description: "A comprehensive list of detected dishes on the menu.",
    },
  },
  required: ["cuisineType", "menuItems"],
};

export const analyzeMenu = async (
  file: File,
  restrictions: DietaryRestriction[]
): Promise<AnalysisResponse> => {
  try {
    const base64Data = await fileToBase64(file);
    const mimeType = file.type;

    const restrictionText = restrictions.length > 0
      ? `使用者有以下飲食禁忌: ${restrictions.join(', ')}。請分析每一道菜，若某道菜含有禁忌食材，請務必在 'ingredients' 欄位的開頭加上 '🚫' 符號並說明原因。`
      : "使用者沒有特別的飲食禁忌。";

    const prompt = `
      你是一位資深美食評論家與在地導遊。
      請將這張圖片中的菜單內容「數位化」，轉換為結構化的中文表格資料。
      
      請執行以下步驟：
      1. 識別菜單語言 (日、韓、泰、英、法等)。
      2. 盡可能提取圖片中可見的所有菜色項目。
      3. ${restrictionText}
      4. 為每道菜進行評分 (1-5顆星)，基於美味程度與CP值。
      5. 翻譯菜名並解析內容物/口感 (例如：生魚片、很辣、有香菜)。

      請以 JSON 格式回傳，欄位包含：
      - originalName (原菜名)
      - translatedName (中文菜名)
      - ingredients (內容物/口感解析 + 避雷警示)
      - price (價格)
      - score (推薦指數 1-5)
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(response.text) as AnalysisResponse;

  } catch (error) {
    console.error("Error analyzing menu:", error);
    throw error;
  }
};
