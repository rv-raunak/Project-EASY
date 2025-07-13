import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "AIzaSyCqGql9ksE7_fiHOoedWnN4TT3yfevgRFw" });

export interface HealthChatResponse {
  message: string;
  urgency: "low" | "medium" | "high";
  recommendations: string[];
  shouldSeekCare: boolean;
}

export async function generateHealthResponse(userMessage: string, chatHistory: { role: "user" | "assistant"; content: string }[]): Promise<HealthChatResponse> {
  try {
    const systemPrompt = `You are a professional medical assistant AI. Your role is to provide helpful, accurate health information while emphasizing the importance of professional medical care when needed.

Guidelines:
1. Always provide helpful, evidence-based health information
2. Never diagnose medical conditions
3. Always recommend consulting healthcare professionals for serious symptoms
4. Be empathetic and supportive
5. Provide practical advice when appropriate
6. Use clear, understandable language
7. Include urgency levels and recommendations

For serious symptoms (fever with severe headache, chest pain, difficulty breathing, severe abdominal pain, etc.), always recommend immediate medical attention.

Respond with a JSON object containing:
- message: Your response to the user
- urgency: "low", "medium", or "high" based on symptoms described
- recommendations: Array of 2-4 practical recommendations
- shouldSeekCare: Boolean indicating if professional medical care is recommended

Remember: You are providing information, not medical advice. Always emphasize consulting healthcare professionals.`;

    // Build conversation history for context
    const conversationHistory = chatHistory.map(msg => msg.content).join('\n');
    const fullPrompt = `${systemPrompt}\n\nConversation History:\n${conversationHistory}\n\nUser: ${userMessage}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            message: { type: "string" },
            urgency: { type: "string", enum: ["low", "medium", "high"] },
            recommendations: { type: "array", items: { type: "string" } },
            shouldSeekCare: { type: "boolean" }
          },
          required: ["message", "urgency", "recommendations", "shouldSeekCare"]
        }
      },
      contents: userMessage,
    });

    const rawJson = response.text;
    console.log(`Raw JSON: ${rawJson}`);

    if (rawJson) {
      const result = JSON.parse(rawJson);
      return {
        message: result.message || "I'm here to help with your health questions. Could you provide more details?",
        urgency: result.urgency || "low",
        recommendations: result.recommendations || ["Consider consulting a healthcare professional"],
        shouldSeekCare: result.shouldSeekCare || false
      };
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    return {
      message: "I'm having trouble processing your request right now. For any health concerns, please consider consulting a healthcare professional.",
      urgency: "medium",
      recommendations: ["Consult with a healthcare professional", "Monitor your symptoms"],
      shouldSeekCare: true
    };
  }
}
