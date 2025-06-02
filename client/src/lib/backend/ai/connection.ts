import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';

export const openai = new OpenAI({
    baseURL: process.env.AI_BASE_URL!,
    apiKey: process.env.AI_API_KEY!,
});

export const geminiAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
});
