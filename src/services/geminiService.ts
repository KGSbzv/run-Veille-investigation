import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, MessageRole } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key is not set. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

// Helper to convert base64 to a file part for Gemini
const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

export const analyzeImageWithGemini = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
  try {
    const imagePart = fileToGenerativePart(base64Image, mimeType);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, { text: prompt }] },
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    return "Une erreur est survenue lors de l'analyse de l'image.";
  }
};

export const getWebSearchResults = async (query: string): Promise<{ text: string, sources: any[] }> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [{text: query}] },
            config: {
                tools: [{googleSearch: {}}],
            },
        });
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = groundingChunks
            .filter((chunk: any) => chunk.web)
            .map((chunk: any) => ({
                uri: chunk.web.uri,
                title: chunk.web.title,
            }));
        
        return { text: response.text, sources };
    } catch (error) {
        console.error("Error with Google Search grounding:", error);
        return { text: "Erreur lors de la recherche web.", sources: [] };
    }
};

export const streamChatResponse = async (
    history: Message[], 
    newMessage: string, 
    ragContext: string
): Promise<AsyncGenerator<GenerateContentResponse>> => {
    
    // The history for Gemini should not include the new message itself.
    const geminiHistory = history.map(msg => ({
        role: msg.role === MessageRole.USER ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));

    const chat = ai.chats.create({
        model: 'gemini-2.5-pro',
        history: geminiHistory,
        config: {
            systemInstruction: `Tu es un assistant d'analyse pour le Centre d'Analyse du Contre-Renseignement et de la Sécurité (CACRS). Ta mission est d'aider les analystes dans leurs enquêtes liées à l'élection 2026. Sois précis, factuel et neutre. Utilise le contexte fourni pour enrichir tes réponses. Contexte pertinent (RAG): ${ragContext}`,
        },
    });

    return chat.sendMessageStream({ message: newMessage });
};

export const generateReport = async (caseTitle: string, messages: Message[]): Promise<string> => {
  const prompt = `
    Tu es un assistant d'analyse pour le CACRS.
    Génère un rapport de synthèse concis et structuré basé sur la conversation suivante pour le dossier: "${caseTitle}".
    Le rapport doit être au format Markdown.
    Incluis les points clés, les actions suggérées et les entités mentionnées.
    Ne mentionne que les informations pertinentes issues des messages fournis.

    Conversation à analyser :
    ${messages.map(m => `**${m.role === MessageRole.USER ? 'Analyste' : 'Assistant'}:** ${m.content}`).join('\n\n')}
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: { parts: [{ text: prompt }] },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating report with Gemini:", error);
    return "## Erreur de Génération\n\nUne erreur est survenue lors de la création du rapport.";
  }
};