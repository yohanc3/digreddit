import OpenAI from "openai";

export const openai = new OpenAI({
    baseURL: process.env.AI_BASE_URL!,
    apiKey: process.env.AI_API_KEY!
});