import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';

export const openai = new OpenAI({
    baseURL: process.env.AI_BASE_URL!,
    apiKey: process.env.AI_API_KEY!,
});

export const geminiAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
});

export const llamaAI = new OpenAI({
    baseURL: 'https://api.llama.com/compat/v1/',
    apiKey: process.env.LLAMA_API_KEY!,
});

// Model constants
export const LLAMA_MODEL = 'Llama-4-Maverick-17B-128E-Instruct-FP8';
