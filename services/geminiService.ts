import { GoogleGenAI } from "@google/genai";

// Fix: Initialize GoogleGenAI with API key directly from process.env as per guidelines.
// The complex check and warning have been removed, assuming the environment variable is set.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const refinePrompt = async (originalPrompt: string): Promise<string> => {
    // Fix: Removed redundant API key check, as per guidelines to assume it is configured.
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are an AI prompt engineering expert. Your task is to refine and improve a given user prompt. 
    Focus on adding specific details, artistic styles, technical parameters (like resolution or aspect ratio if applicable), and clarity to get a better result from an AI model.
    Return ONLY the improved prompt text, without any explanation or preamble.`;
    
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: `Refine this prompt: "${originalPrompt}"`,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
            },
        });

        // Fix: Directly return the response text, which is the simplest and recommended way.
        return response.text.trim();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to communicate with the Gemini API.");
    }
};
