import { GoogleGenAI } from "@google/genai";
import { AspectRatio, WallpaperStyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWallpaperImage = async (
  prompt: string,
  style: WallpaperStyle,
  aspectRatio: AspectRatio
): Promise<string> => {
  try {
    // Construct a rich prompt based on user input and selected style
    const enhancedPrompt = `Create a high-quality wallpaper. 
    Subject: ${prompt}. 
    Style: ${style}. 
    Details: High resolution, detailed, aesthetic, suitable for background usage, 4k quality.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: enhancedPrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No candidates returned from Gemini API");
    }

    const content = response.candidates[0].content;
    
    // Iterate through parts to find the image
    let imageUrl = "";
    if (content && content.parts) {
        for (const part of content.parts) {
            if (part.inlineData) {
                const mimeType = part.inlineData.mimeType || 'image/png';
                imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
                break;
            }
        }
    }

    if (!imageUrl) {
        throw new Error("No image data found in the response");
    }

    return imageUrl;

  } catch (error) {
    console.error("Error generating wallpaper:", error);
    throw error;
  }
};