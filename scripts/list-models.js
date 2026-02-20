import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error('GEMINI_API_KEY is not set');
    process.exit(1);
}

const client = new GoogleGenAI({ apiKey });

async function listModels() {
    try {
        const response = await client.models.list();
        console.log('Available Models:');
        for await (const model of response) {
            console.log(`- ${model.name}`);
        }
    } catch (error) {
        console.error('Error listing models:', error);
    }
}

listModels();
